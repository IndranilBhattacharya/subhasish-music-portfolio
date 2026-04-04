import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase/admin";

/**
 * GET /api/proxy-download?url=<signedUrl>&filename=<name>
 *
 * Proxies a Supabase signed URL through our own server so the browser
 * receives proper Content-Disposition: attachment headers.
 *
 * This ensures the file downloads as a file (not opened in the tab)
 * regardless of file type (.txt, .zip, .pdf, etc.).
 */

export const config = {
  api: {
    responseLimit: false, // Allow large file downloads
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { url, filename } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing download URL" });
    }

    // Validate that the URL is from our Supabase storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    if (!url.startsWith(supabaseUrl)) {
      return res.status(403).json({ error: "Invalid download source" });
    }

    // Fetch the file from Supabase
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch file from storage" });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const contentLength = response.headers.get("content-length");
    const safeFilename = (typeof filename === "string" && filename) ? filename : "download";

    // Set headers to force download
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }
    res.setHeader("Cache-Control", "no-store");

    // Stream the response body to the client
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.status(200).send(buffer);
  } catch (error: any) {
    console.error("Proxy download error:", error.message);
    return res.status(500).json({ error: "Download failed" });
  }
}
