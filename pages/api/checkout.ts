import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { sendFreeProductEmail } from "../../lib/email";

// ============================================================================
// RAZORPAY INTEGRATION (PRESERVED FOR FUTURE REVERT)
// Currently commented out as only free releases are active.
// To re-enable Razorpay in the future:
// 1. Uncomment the import below:
//    import Razorpay from "razorpay";
// 2. Uncomment the razorpay instance below:
//    const razorpay = new Razorpay({
//      key_id: process.env.RAZORPAY_KEY_ID || "",
//      key_secret: process.env.RAZORPAY_SECRET || "",
//    });
// 3. Uncomment the "Paid Product Razorpay Flow" at the bottom of this file.
// ============================================================================
// import Razorpay from "razorpay";
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID || "",
//   key_secret: process.env.RAZORPAY_SECRET || "",
// });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { product_id, currency, customer_name, customer_email, fingerprint } = req.body;

    if (!product_id || !currency) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", product_id)
      .single();

    if (error || !product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const price = currency === "USD" ? product.price_usd : product.price_inr;

    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || (host?.includes("localhost") ? "http" : "https");
    const baseUrl = `${protocol}://${host}`;

    // ── Free Product Claim Flow ─────────────────────────────────────────
    if (price === 0) {
      if (!customer_email || !customer_email.includes("@")) {
        return res.status(400).json({ error: "A valid email is required to claim this release." });
      }

      // 1. Create completed free order (with fallback if DB constraint only allows stripe/razorpay)
      const orderPayload = {
        product_id: product.id,
        customer_email: customer_email.trim().toLowerCase(),
        customer_name: customer_name?.trim() || "",
        currency: currency || "USD",
        amount_paid: 0,
        payment_provider: "free",
        payment_intent_id: `free_${crypto.randomUUID()}`,
        status: "completed",
      };

      let { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert([orderPayload])
        .select()
        .single();

      // Graceful fallback: If Supabase orders_payment_provider_check constraint is ('stripe', 'razorpay')
      if (orderError && orderError.message.includes("orders_payment_provider_check")) {
        orderPayload.payment_provider = "razorpay";
        const retry = await supabaseAdmin
          .from("orders")
          .insert([orderPayload])
          .select()
          .single();
        order = retry.data;
        orderError = retry.error;
      }

      if (orderError) {
        throw new Error(`Failed to record free claim: ${orderError.message}`);
      }

      // 2. Create license record with device fingerprint (enables re-download from store)
      const fingerprintsArray = fingerprint ? [fingerprint] : [];
      await supabaseAdmin
        .from("licenses")
        .insert([
          {
            order_id: order.id,
            status: "active",
            fingerprints: fingerprintsArray,
          },
        ]);

      // 3. Increment download counter atomically in DB (concurrency-safe if RPC exists)
      try {
        await supabaseAdmin.rpc("increment_product_download", { product_id: product.id });
      } catch {
        // Silently continue if RPC not yet installed
      }

      // 4. Generate signed download URL
      const { data: signedUrlData } = await supabaseAdmin.storage
        .from("vst-releases")
        .createSignedUrl(product.file_path, 60 * 60 * 24 * 7);

      // 5. Send separate free release confirmation email (without license key)
      await sendFreeProductEmail({
        customerEmail: customer_email.trim().toLowerCase(),
        customerName: customer_name?.trim() || "",
        productName: product.name,
        downloadUrl: signedUrlData?.signedUrl,
        orderId: order.id,
        baseUrl,
      });

      return res.status(200).json({
        is_free: true,
        order_id: order.id,
        success_url: `/samples-store/success?free=true&order_id=${order.id}`,
        download_url: signedUrlData?.signedUrl,
        product_name: product.name,
      });
    }

    // ── Paid Product Razorpay Flow (Preserved for Future Revert) ───────
    /*
    const customer: any = {};
    if (customer_name) customer.name = customer_name;
    if (customer_email) customer.email = customer_email;

    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round(price * 100),
      currency: currency === "USD" ? "USD" : "INR",
      accept_partial: false,
      description: `${product.name}`,
      customer,
      notify: {
        email: !!customer_email,
        sms: false,
      },
      reminder_enable: false,
      notes: {
        product_id: product.id,
        currency,
        customer_name: customer_name || "",
        customer_email: customer_email || "",
      },
      callback_url: `${baseUrl}/samples-store/success`,
      callback_method: "get",
    });

    return res.status(200).json({ url: paymentLink.short_url });
    */

    return res.status(400).json({
      error: "Paid purchases are currently paused. Only free releases are available."
    });
  } catch (error: any) {
    console.error("Checkout Error:", error.message);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
