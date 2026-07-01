import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any,
});

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const headersList = headers();

    const stripeSignature = headersList.get("stripe-signature");
    const razorpaySignature = headersList.get("x-razorpay-signature");

    let eventType: string = "";
    let customerEmail: string = "";
    let customerName: string = "";
    let productId: string = "";
    let currency: string = "";
    let amountPaid: number = 0;
    let paymentIntentId: string = "";
    let paymentProvider: "stripe" | "razorpay" = "stripe";

    // --- IDENTIFY AND PARSE PROVIDER WEBHOOK ---

    if (stripeSignature) {
      paymentProvider = "stripe";
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(rawBody, stripeSignature, STRIPE_WEBHOOK_SECRET);
      } catch (err: any) {
        return NextResponse.json({ error: `Stripe webhook error: ${err.message}` }, { status: 400 });
      }

      eventType = event.type;
      
      if (eventType === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        paymentIntentId = session.payment_intent as string;
        customerEmail = session.customer_details?.email || "";
        customerName = session.customer_details?.name || "";
        currency = session.currency?.toUpperCase() || "USD";
        amountPaid = (session.amount_total || 0) / 100;
        
        // Ensure metadata was captured in checkout session
        productId = session.metadata?.product_id || "";
      } else {
        return NextResponse.json({ received: true });
      }

    } else if (razorpaySignature) {
      paymentProvider = "razorpay";
      
      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        return NextResponse.json({ error: "Invalid Razorpay signature" }, { status: 400 });
      }

      const event = JSON.parse(rawBody);
      eventType = event.event;

      if (eventType === "payment.captured") {
        const payment = event.payload.payment.entity;
        paymentIntentId = payment.id;
        customerEmail = payment.email || "";
        customerName = payment.notes?.customer_name || "Guest";
        currency = payment.currency.toUpperCase() || "INR";
        amountPaid = payment.amount / 100;
        productId = payment.notes?.product_id || "";
      } else {
        return NextResponse.json({ received: true });
      }
    } else {
      return NextResponse.json({ error: "No signature provided" }, { status: 400 });
    }

    // --- PROCESS SUCCESSFUL PAYMENT ---
    if (!productId || !customerEmail) {
      console.warn("Product ID or Customer Email is missing from webhook payload.");
      return NextResponse.json({ received: true }, { status: 200 }); // Return 200 so Stripe/Razorpay doesn't retry infinitely
    }

    // 1. Insert order into DB
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          product_id: productId,
          customer_email: customerEmail,
          customer_name: customerName,
          currency: currency,
          amount_paid: amountPaid,
          payment_provider: paymentProvider,
          payment_intent_id: paymentIntentId,
          status: "completed",
        },
      ])
      .select()
      .single();

    if (orderError) throw new Error(`Order insertion failed: ${orderError.message}`);

    // 2. Insert license
    const { data: license, error: licenseError } = await supabaseAdmin
      .from("licenses")
      .insert([
        {
          order_id: order.id,
          status: "active",
        },
      ])
      .select()
      .single();

    if (licenseError) throw new Error(`License insertion failed: ${licenseError.message}`);

    // 3. Fetch Product Details (to get file path)
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("file_path, name")
      .eq("id", productId)
      .single();

    if (productError || !product) throw new Error("Could not find purchased product.");

    // 4. Generate 24-hour Signed URL
    const { data: uploadInfo, error: storageError } = await supabaseAdmin
      .storage
      .from("vst-releases")
      .createSignedUrl(product.file_path, 60 * 60 * 24); // 24 hours in seconds

    if (storageError) throw new Error(`Signed URL generation failed: ${storageError.message}`);

    const downloadUrl = uploadInfo.signedUrl;

    // --- MOCK SEND EMAIL WITH RESEND/SENDGRID ---
    console.log("-----------------------------------------");
    console.log(`[POST PAYMENT] Sending email to ${customerEmail}`);
    console.log(`Order ID: ${order.id}`);
    console.log(`Product: ${product.name}`);
    console.log(`License Key: ${license.license_key}`);
    console.log(`Download Link: (Valid for 24 hours)\n${downloadUrl}`);
    console.log("-----------------------------------------");
    
    // TODO: Integrate Resend / SendGrid here:
    // import { resend } from "@/lib/resend";
    // await resend.emails.send({
    //   from: "downloads@yourdomain.com",
    //   to: customerEmail,
    //   subject: `Your Purchase: ${product.name}`,
    //   react: EmailTemplate({ productName: product.name, licenseKey: license.license_key, downloadUrl }),
    // });

    return NextResponse.json({ success: true, received: true });

  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
