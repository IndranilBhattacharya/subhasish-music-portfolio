import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import crypto from "crypto";
import { supabaseAdmin } from "../../../lib/supabase/admin";
import { sendPurchaseEmail } from "../../../lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any,
});

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

// Disable the default body parser to read the raw body for signature verification
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

      if (event.type === "checkout.session.completed") {
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
      
      if (event.event === "payment.captured" || event.event === "payment_link.paid") {
        const payment = event.payload?.payment?.entity;
        if (!payment) {
          return res.status(200).json({ received: true });
        }
        paymentIntentId = payment.id;
        customerEmail = payment.email || payment.notes?.customer_email || "";
        customerName = payment.notes?.customer_name || "Guest";
        currency = (payment.currency || "INR").toUpperCase();
        amountPaid = payment.amount / 100;
        productId = payment.notes?.product_id || "";
      } else {
        return res.status(200).json({ received: true });
      }
    } else {
      return res.status(400).json({ error: "No signature provided" });
    }

    if (!productId) {
      console.warn("[WEBHOOK] Product ID missing from webhook payload.");
      return res.status(200).json({ received: true });
    }

    // ── Idempotency: skip if already processed by verify-payment ─────
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("payment_intent_id", paymentIntentId)
      .maybeSingle();

    if (existingOrder) {
      console.log(`[WEBHOOK] Order already exists for ${paymentIntentId} — skipping (likely processed by verify-payment).`);
      return res.status(200).json({ received: true, already_processed: true });
    }

    // ── Create order ─────────────────────────────────────────────────
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          product_id: productId,
          customer_email: customerEmail || "unknown",
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

    if (orderError) {
      // If duplicate key, it means verify-payment raced ahead
      if (orderError.message.includes("duplicate") || orderError.message.includes("unique")) {
        console.log(`[WEBHOOK] Race condition — order already created for ${paymentIntentId}`);
        return res.status(200).json({ received: true, already_processed: true });
      }
      throw new Error(`Order insertion failed: ${orderError.message}`);
    }

    // ── Create license (no fingerprint yet — will be added when user visits success page) ──
    const { data: license, error: licenseError } = await supabaseAdmin
      .from("licenses")
      .insert([{ order_id: order.id, status: "active", fingerprints: [] }])
      .select()
      .single();

    if (licenseError) throw new Error(`License insertion failed: ${licenseError.message}`);

    // ── Send confirmation email ────────────────────────────────────────
    if (customerEmail) {
      try {
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("file_path, name")
          .eq("id", productId)
          .single();

        if (product) {
          const { data: signedUrlData } = await supabaseAdmin
            .storage
            .from("vst-releases")
            .createSignedUrl(product.file_path, 60 * 60 * 24);

          await sendPurchaseEmail({
            customerEmail,
            customerName,
            productName: product.name,
            licenseKey: license.license_key,
            downloadUrl: signedUrlData?.signedUrl,
            amountPaid,
            currency,
            orderId: order.id,
          });
        }
      } catch (emailErr: any) {
        console.error("[WEBHOOK] Email sending failed:", emailErr.message);
      }
    }

    console.log(`[WEBHOOK] Order ${order.id} created for payment ${paymentIntentId}`);
    return res.status(200).json({ success: true, received: true });

  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
