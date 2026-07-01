import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { supabaseAdmin } from "../../../lib/supabase/admin";
import { sendPurchaseEmail } from "../../../lib/email";

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

    const razorpaySignature = req.headers["x-razorpay-signature"] as string;

    if (!razorpaySignature) {
      return res.status(400).json({ error: "No signature provided" });
    }

    // Verify Razorpay webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(textBody)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: "Invalid Razorpay signature" });
    }

    const event = JSON.parse(textBody);
    const eventType = event.event;

    if (eventType !== "payment.captured" && eventType !== "payment_link.paid") {
      return res.status(200).json({ received: true });
    }

    const payment = event.payload?.payment?.entity;
    if (!payment) {
      return res.status(200).json({ received: true });
    }

    const paymentIntentId = payment.id;
    const customerEmail = payment.email || payment.notes?.customer_email || "";
    const customerName = payment.notes?.customer_name || "";
    const currency = (payment.currency || "INR").toUpperCase();
    const amountPaid = payment.amount / 100;
    const productId = payment.notes?.product_id || "";

    if (!productId) {
      console.warn("[WEBHOOK] Product ID missing from webhook payload.");
      return res.status(200).json({ received: true });
    }

    // Idempotency: skip if already processed by verify-payment
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("payment_intent_id", paymentIntentId)
      .maybeSingle();

    if (existingOrder) {
      console.log(`[WEBHOOK] Order already exists for ${paymentIntentId} — skipping.`);
      return res.status(200).json({ received: true, already_processed: true });
    }

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([{
        product_id: productId,
        customer_email: customerEmail || "unknown",
        customer_name: customerName,
        currency,
        amount_paid: amountPaid,
        payment_provider: "razorpay",
        payment_intent_id: paymentIntentId,
        status: "completed",
      }])
      .select()
      .single();

    if (orderError) {
      if (orderError.message.includes("duplicate") || orderError.message.includes("unique")) {
        console.log(`[WEBHOOK] Race condition — order already created for ${paymentIntentId}`);
        return res.status(200).json({ received: true, already_processed: true });
      }
      throw new Error(`Order insertion failed: ${orderError.message}`);
    }

    // Create license
    const { data: license, error: licenseError } = await supabaseAdmin
      .from("licenses")
      .insert([{ order_id: order.id, status: "active", fingerprints: [] }])
      .select()
      .single();

    if (licenseError) throw new Error(`License insertion failed: ${licenseError.message}`);

    // Send confirmation email
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
            .createSignedUrl(product.file_path, 60 * 60 * 24 * 7);

          const host = req.headers.host;
          const protocol = req.headers["x-forwarded-proto"] || (host?.includes("localhost") ? "http" : "https");
          const baseUrl = host ? `${protocol}://${host}` : undefined;

          await sendPurchaseEmail({
            customerEmail,
            customerName,
            productName: product.name,
            licenseKey: license.license_key,
            downloadUrl: signedUrlData?.signedUrl,
            amountPaid,
            currency,
            orderId: order.id,
            baseUrl,
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
