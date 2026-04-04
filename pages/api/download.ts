import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase/admin";

/**
 * POST /api/download
 *
 * Re-download a purchased product using license_key + device fingerprint.
 * This allows users to re-download on the same device/browser without
 * paying again — tied to the FingerprintJS visitorId.
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
    const { license_key, fingerprint } = req.body;

    if (!license_key || !fingerprint) {
      return res.status(400).json({ error: "License key and device fingerprint are required" });
    }

    // ── Find the license ─────────────────────────────────────────────
    const { data: license, error: licenseError } = await supabaseAdmin
      .from("licenses")
      .select("*, orders(product_id, customer_email)")
      .eq("license_key", license_key)
      .eq("status", "active")
      .single();

    if (licenseError || !license) {
      return res.status(404).json({ error: "License not found or inactive" });
    }

    // ── Verify device fingerprint ────────────────────────────────────
    const storedFingerprints: string[] = license.fingerprints || [];

    if (!storedFingerprints.includes(fingerprint)) {
      return res.status(403).json({
        error: "This device is not authorized for this license. Downloads are locked to the purchasing device.",
      });
    }

    // ── Get product file path ────────────────────────────────────────
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

    // ── Generate a fresh 24h signed URL ──────────────────────────────
    const { data: signedUrlData, error: storageError } = await supabaseAdmin
      .storage
      .from("vst-releases")
      .createSignedUrl(product.file_path, 60 * 60 * 24);

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
