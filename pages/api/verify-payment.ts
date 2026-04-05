import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { sendPurchaseEmail } from "../../lib/email";

/**
 * POST /api/verify-payment
 *
 * Called from the success page after Razorpay redirect.
 * Verifies the payment signature, creates an order + license,
 * generates a signed download URL, sends confirmation email,
 * and returns it all to the client so the browser can auto-download.
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const {
      razorpay_payment_id,
      razorpay_payment_link_id,
      razorpay_payment_link_reference_id,
      razorpay_payment_link_status,
      razorpay_signature,
      fingerprint,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_payment_link_id) {
      return res.status(400).json({ error: "Missing Razorpay payment details" });
    }

    // ── Razorpay Payment Link signature verification ─────────────────
    // Per Razorpay docs (4-field format, exact order):
    //   HMAC-SHA256( link_id | reference_id | link_status | payment_id, api_key_secret )
    // reference_id can be empty string if not set during Payment Link creation
    const secret = process.env.RAZORPAY_SECRET || "";
    const refId = razorpay_payment_link_reference_id || "";
    const linkStatus = razorpay_payment_link_status || "paid";
    const signaturePayload = `${razorpay_payment_link_id}|${refId}|${linkStatus}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signaturePayload)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch", {
        expected: expectedSignature,
        received: razorpay_signature,
        payload: signaturePayload,
      });
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // ── Fetch payment details from Razorpay API ──────────────────────
    const Razorpay = (await import("razorpay")).default;
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "",
      key_secret: process.env.RAZORPAY_SECRET || "",
    });

    const payment = await rzp.payments.fetch(razorpay_payment_id);
    if (!payment || payment.status !== "captured") {
      return res.status(400).json({ error: "Payment not captured yet. Please wait a moment and refresh." });
    }

    const productId = payment.notes?.product_id;
    // Razorpay provides email & contact from customer input on their checkout
    const customerEmail = payment.email || payment.notes?.customer_email || "";
    const customerName = payment.notes?.customer_name || "";
    const customerPhone = (payment as any).contact || "";
    const currency = (payment.currency || "INR").toUpperCase();
    const amountPaid = (payment.amount as number) / 100;

    if (!productId) {
      return res.status(400).json({ error: "Product ID missing from payment notes" });
    }

    // ── Idempotency: check if order already exists ───────────────────
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("payment_intent_id", razorpay_payment_id)
      .maybeSingle();

    if (existingOrder) {
      const { data: existingLicense } = await supabaseAdmin
        .from("licenses")
        .select("license_key, fingerprints")
        .eq("order_id", existingOrder.id)
        .single();

      const { data: product } = await supabaseAdmin
        .from("products")
        .select("file_path, name")
        .eq("id", productId)
        .single();

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Update fingerprint if provided
      if (fingerprint && existingLicense) {
        const fps: string[] = existingLicense.fingerprints || [];
        if (!fps.includes(fingerprint)) {
          fps.push(fingerprint);
          await supabaseAdmin
            .from("licenses")
            .update({ fingerprints: fps })
            .eq("order_id", existingOrder.id);
        }
      }

      const { data: signedUrlData } = await supabaseAdmin.storage
        .from("vst-releases")
        .createSignedUrl(product.file_path, 60 * 60 * 24 * 7);

      return res.status(200).json({
        success: true,
        already_processed: true,
        license_key: existingLicense?.license_key,
        download_url: signedUrlData?.signedUrl,
        product_name: product.name,
        customer_email: customerEmail,
      });
    }

    // ── Create new order ─────────────────────────────────────────────
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          product_id: productId,
          customer_email: customerEmail || customerPhone || "unknown",
          customer_name: customerName,
          currency,
          amount_paid: amountPaid,
          payment_provider: "razorpay",
          payment_intent_id: razorpay_payment_id,
          status: "completed",
        },
      ])
      .select()
      .single();

    if (orderError) {
      throw new Error(`Order insertion failed: ${orderError.message}`);
    }

    // ── Create license with fingerprint ──────────────────────────────
    const fingerprintsArray = fingerprint ? [fingerprint] : [];
    const { data: license, error: licenseError } = await supabaseAdmin
      .from("licenses")
      .insert([
        {
          order_id: order.id,
          status: "active",
          fingerprints: fingerprintsArray,
        },
      ])
      .select()
      .single();

    if (licenseError) {
      throw new Error(`License insertion failed: ${licenseError.message}`);
    }

    // ── Get product file path ────────────────────────────────────────
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("file_path, name")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      throw new Error("Could not find purchased product.");
    }

    // ── Generate signed download URL ─────────────────────────────────
    const { data: signedUrlData, error: storageError } = await supabaseAdmin
      .storage
      .from("vst-releases")
      .createSignedUrl(product.file_path, 60 * 60 * 24 * 7);

    if (storageError) {
      throw new Error(`Signed URL generation failed: ${storageError.message}`);
    }

    // ── Send confirmation email ───────────────────────────────────────
    await sendPurchaseEmail({
      customerEmail,
      customerName,
      productName: product.name,
      licenseKey: license.license_key,
      downloadUrl: signedUrlData.signedUrl,
      amountPaid,
      currency,
      orderId: order.id,
    });

    console.log("─────────────────────────────────────────────");
    console.log(`[PAYMENT VERIFIED] Email: ${customerEmail} | Phone: ${customerPhone}`);
    console.log(`Order ID: ${order.id}`);
    console.log(`Product: ${product.name}`);
    console.log(`License Key: ${license.license_key}`);
    console.log(`Download URL: ${signedUrlData.signedUrl}`);
    console.log("─────────────────────────────────────────────");

    return res.status(200).json({
      success: true,
      license_key: license.license_key,
      download_url: signedUrlData.signedUrl,
      product_name: product.name,
      customer_email: customerEmail,
    });
  } catch (error: any) {
    console.error("Verify payment error:", error.message);
    return res
      .status(500)
      .json({ error: "Verification failed", details: error.message });
  }
}
