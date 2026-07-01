import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase/admin";

/**
 * POST /api/download
 *
 * Re-download a purchased product using fingerprint + (license_key or product_id).
 * Generates a fresh signed URL on demand — no expiry concept for the user.
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
    const { license_key, fingerprint, product_id } = req.body;

    if (!fingerprint) {
      return res.status(400).json({ error: "Device fingerprint is required" });
    }

    let license: any = null;

    // Option 1: lookup by license_key
    if (license_key) {
      const { data } = await supabaseAdmin
        .from("licenses")
        .select("*, orders(product_id)")
        .eq("license_key", license_key)
        .eq("status", "active")
        .single();
      license = data;
    }

    // Option 2: lookup by product_id + fingerprint
    if (!license && product_id) {
      // Find orders for this product, then find active licenses with matching fingerprint
      const { data: orders } = await supabaseAdmin
        .from("orders")
        .select("id")
        .eq("product_id", product_id);

      if (orders && orders.length > 0) {
        const orderIds = orders.map((o: any) => o.id);
        const { data: licenses } = await supabaseAdmin
          .from("licenses")
          .select("*, orders(product_id)")
          .in("order_id", orderIds)
          .contains("fingerprints", [fingerprint])
          .eq("status", "active");

        if (licenses && licenses.length > 0) {
          license = licenses[0];
        }
      }
    }

    if (!license) {
      return res.status(404).json({ error: "No active license found for this device." });
    }

    // Verify fingerprint
    const storedFingerprints: string[] = license.fingerprints || [];
    if (!storedFingerprints.includes(fingerprint)) {
      return res.status(403).json({
        error: "This device is not authorized. Downloads are locked to the purchasing device.",
      });
    }

    // Get product file path
    const productId = (license as any).orders?.product_id;
    if (!productId) {
      return res.status(500).json({ error: "Could not resolve product from license" });
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("file_path, name")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Generate a fresh signed URL (7 days — generous but not permanent since Supabase requires a TTL)
    const { data: signedUrlData, error: storageError } = await supabaseAdmin
      .storage
      .from("vst-releases")
      .createSignedUrl(product.file_path, 60 * 60 * 24 * 7);

    if (storageError) {
      return res.status(500).json({ error: "Failed to generate download link" });
    }

    return res.status(200).json({
      success: true,
      download_url: signedUrlData.signedUrl,
      product_name: product.name,
    });
  } catch (error: any) {
    console.error("Download error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
