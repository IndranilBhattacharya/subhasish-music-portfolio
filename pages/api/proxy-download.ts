import { NextApiRequest, NextApiResponse } from "next";

/**
 * GET /api/proxy-download?url=<signedUrl>&filename=<name>
 *
 * Proxies a Supabase signed URL through our server with
 * Content-Disposition: attachment headers so the browser
 * downloads the file without navigating away.
 */

export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
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

    // Validate the URL is from our Supabase storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    if (!url.startsWith(supabaseUrl)) {
      return res.status(403).json({ error: "Invalid download source" });
    }

    const upstream = await fetch(url);
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: "Failed to fetch file" });
    }

    const safeFilename = (typeof filename === "string" && filename) ? filename : "download";
    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");

    // Force download with correct binary content-type
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }
    res.setHeader("Cache-Control", "no-store, no-cache");

    // Read as raw bytes and send the exact buffer — no text encoding
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.status(200).end(buffer);
  } catch (error: any) {
    console.error("Proxy download error:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Download failed" });
    }
  }
}
