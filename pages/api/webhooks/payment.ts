import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import crypto from "crypto";
import { supabaseAdmin } from "../../../lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any,
});

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

// We need to disable the default body parser to verify the Stripe signature
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const textBody = Buffer.concat(chunks).toString("utf-8");

    const stripeSignature = req.headers["stripe-signature"] as string;
    const razorpaySignature = req.headers["x-razorpay-signature"] as string;

    let eventType: string = "";
    let customerEmail: string = "";
    let customerName: string = "";
    let productId: string = "";
    let currency: string = "";
    let amountPaid: number = 0;
    let paymentIntentId: string = "";
    let paymentProvider: "stripe" | "razorpay" = "stripe";

    if (stripeSignature) {
      paymentProvider = "stripe";
      let event: Stripe.Event;
      try {
        event = stripe.webhooks.constructEvent(textBody, stripeSignature, STRIPE_WEBHOOK_SECRET);
      } catch (err: any) {
        return res.status(400).json({ error: `Stripe webhook error: ${err.message}` });
      }

      eventType = event.type;
      
      if (eventType === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        paymentIntentId = session.payment_intent as string;
        customerEmail = session.customer_details?.email || "";
        customerName = session.customer_details?.name || "";
        currency = session.currency?.toUpperCase() || "USD";
        amountPaid = (session.amount_total || 0) / 100;
        productId = session.metadata?.product_id || "";
      } else {
        return res.status(200).json({ received: true });
      }

    } else if (razorpaySignature) {
      paymentProvider = "razorpay";
      
      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
        .update(textBody)
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ error: "Invalid Razorpay signature" });
      }

      const event = JSON.parse(textBody);
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
        return res.status(200).json({ received: true });
      }
    } else {
      return res.status(400).json({ error: "No signature provided" });
    }

    if (!productId || !customerEmail) {
      console.warn("Product ID or Customer Email is missing from webhook payload.");
      return res.status(200).json({ received: true });
    }

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

    const { data: license, error: licenseError } = await supabaseAdmin
      .from("licenses")
      .insert([{ order_id: order.id, status: "active" }])
      .select()
      .single();

    if (licenseError) throw new Error(`License insertion failed: ${licenseError.message}`);

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("file_path, name")
      .eq("id", productId)
      .single();

    if (productError || !product) throw new Error("Could not find purchased product.");

    const { data: uploadInfo, error: storageError } = await supabaseAdmin
      .storage
      .from("vst-releases")
      .createSignedUrl(product.file_path, 60 * 60 * 24);

    if (storageError) throw new Error(`Signed URL generation failed: ${storageError.message}`);

    const downloadUrl = uploadInfo.signedUrl;

    console.log(`Email Sent! Download URL: ${downloadUrl}`);

    return res.status(200).json({ success: true, received: true });

  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
