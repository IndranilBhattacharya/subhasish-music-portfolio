import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase/admin";

/**
 * POST /api/check-purchase
 *
 * Checks if a device (fingerprint) has already purchased specific products.
 * Returns a map of product_id → license_key for already-purchased items.
 * Used by the storefront to show "Download" instead of "Buy Now".
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
    const { fingerprint } = req.body;

    if (!fingerprint) {
      return res.status(200).json({ purchases: {} });
    }

    // Find all active licenses where this fingerprint is registered
    const { data: licenses, error } = await supabaseAdmin
      .from("licenses")
      .select("license_key, orders(product_id)")
      .contains("fingerprints", [fingerprint])
      .eq("status", "active");

    if (error || !licenses) {
      return res.status(200).json({ purchases: {} });
    }

    // Build a map: product_id → license_key
    const purchases: Record<string, string> = {};
    for (const lic of licenses) {
      const productId = (lic as any).orders?.product_id;
      if (productId) {
        purchases[productId] = lic.license_key;
      }
    }

    return res.status(200).json({ purchases });
  } catch (err: any) {
    console.error("Check purchase error:", err.message);
    return res.status(200).json({ purchases: {} });
  }
}
