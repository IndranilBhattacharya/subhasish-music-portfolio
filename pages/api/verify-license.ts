import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase/admin";
import crypto from "crypto";

/**
 * POST /api/verify-license
 *
 * Publicly accessible endpoint (no auth required) that receives a `license_key`
 * and a `device_id`, and verifies if the license exists, is active, and if the 
 * given device_id is already registered in the license's fingerprints array.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers to allow open public access from any client/origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Enforce POST method
  if (req.method !== "POST") {
    return res.status(405).json({ valid: false, error: "Method Not Allowed" });
  }

  try {
    const { license_key, device_id } = req.body;

    if (!license_key || typeof license_key !== "string") {
      return res.status(400).json({ valid: false, error: "Invalid or missing 'license_key'" });
    }

    if (!device_id || typeof device_id !== "string") {
      return res.status(400).json({ valid: false, error: "Invalid or missing 'device_id'" });
    }

    // Query Supabase. 
    // The Supabase Javascript SDK uses parameterized queries, which natively prevents SQL Injection.
    const { data: license, error } = await supabaseAdmin
      .from("licenses")
      .select("id, status, fingerprints")
      .eq("license_key", license_key)
      .single();

    if (error) {
      // PGRST116 means zero rows returned from .single()
      if (error.code === 'PGRST116') {
        return res.status(404).json({ valid: false, error: "License not found" });
      }
      throw error;
    }

    if (license.status !== "active") {
      return res.status(403).json({ valid: false, error: "License is not active" });
    }

    // Check if the device_id exists in the fingerprints array
    let fingerprints: string[] = license.fingerprints || [];
    const isRegistered = fingerprints.includes(device_id);

    if (isRegistered) {
      const token = crypto
        .createHmac("sha256", process.env.LICENSE_HMAC_SECRET || "")
        .update(`${device_id}|${license_key}`)
        .digest("hex");

      return res.status(200).json({
        valid: true,
        token,
        message: "Device is already registered and verified."
      });
    } else {
      // Configuration for maximum allowed devices per license
      const MAX_ACTIVATIONS = 2; // You can change this to 1 if you only want to allow 1 device

      if (fingerprints.length < MAX_ACTIVATIONS) {
        // Register the new device
        fingerprints.push(device_id);
        
        const { error: updateError } = await supabaseAdmin
          .from("licenses")
          .update({ fingerprints })
          .eq("id", license.id);

        if (updateError) {
          throw updateError;
        }

        const token = crypto
          .createHmac("sha256", process.env.LICENSE_HMAC_SECRET || "")
          .update(`${device_id}|${license_key}`)
          .digest("hex");

        return res.status(200).json({
          valid: true,
          token,
          message: "Device successfully registered and verified."
        });
      } else {
        // Maximum activations reached
        return res.status(403).json({
          valid: false,
          error: `Activation limit reached. This license is already active on ${MAX_ACTIVATIONS} device(s).`
        });
      }
    }
  } catch (err: any) {
    console.error("License verification error:", err.message);
    return res.status(500).json({ valid: false, error: "Internal Server Error" });
  }
}
