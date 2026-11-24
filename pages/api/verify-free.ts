import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase/admin";

/**
 * POST /api/verify-free
 *
 * Verifies a free claimed order, ensures device fingerprint is registered,
 * generates a signed download URL, increments download counter, and returns
 * the download details to the success page.
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
    const { order_id, fingerprint } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: "Missing order ID" });
    }

    // 1. Fetch order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const isFreeOrder =
      order.amount_paid === 0 ||
      order.payment_provider === "free" ||
      order.payment_intent_id?.startsWith("free_");

    if (!isFreeOrder) {
      return res.status(400).json({ error: "This endpoint is only for free orders" });
    }

    // 2. Fetch product
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, name, file_path")
      .eq("id", order.product_id)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 3. Register / update device fingerprint in license if exists
    if (fingerprint) {
      const { data: license } = await supabaseAdmin
        .from("licenses")
        .select("id, fingerprints")
        .eq("order_id", order.id)
        .maybeSingle();

      if (license) {
        const fps: string[] = license.fingerprints || [];
        if (!fps.includes(fingerprint)) {
          fps.push(fingerprint);
          await supabaseAdmin
            .from("licenses")
            .update({ fingerprints: fps })
            .eq("id", license.id);
        }
      }
    }

    // 4. Concurrency-safe atomic download counter increment (if RPC defined)
    try {
      await supabaseAdmin.rpc("increment_product_download", { product_id: product.id });
    } catch {
      // Gracefully continue if RPC is not yet created in Supabase
    }

    // 5. Generate signed download URL
    const { data: signedUrlData, error: storageError } = await supabaseAdmin
      .storage
      .from("vst-releases")
      .createSignedUrl(product.file_path, 60 * 60 * 24 * 7);

    if (storageError || !signedUrlData?.signedUrl) {
      return res.status(500).json({ error: "Failed to generate download URL" });
    }

    return res.status(200).json({
      success: true,
      is_free: true,
      product_name: product.name,
      customer_email: order.customer_email,
      download_url: signedUrlData.signedUrl,
    });
  } catch (error: any) {
    console.error("Verify free order error:", error.message);
    return res.status(500).json({ error: "Verification failed", details: error.message });
  }
}
