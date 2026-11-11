import React, { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Download, Loader2, Check } from "lucide-react";
import CheckoutModal from "./CheckoutModal";

interface FeaturedProductProps {
  product: any;
  currency: "USD" | "INR";
  purchased?: boolean;
}

export default function HeroSection({ product, currency, purchased }: FeaturedProductProps) {
  const [showModal, setShowModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const getFingerprint = useCallback(async (): Promise<string> => {
    try {
      const FingerprintJS = (await import("@fingerprintjs/fingerprintjs")).default;
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      return result.visitorId;
    } catch {
      const raw = [navigator.userAgent, navigator.language, screen.width, screen.height, screen.colorDepth, new Date().getTimezoneOffset()].join("|");
      let hash = 0;
      for (let i = 0; i < raw.length; i++) { hash = (hash << 5) - hash + raw.charCodeAt(i); hash |= 0; }
      return `fallback-${Math.abs(hash).toString(36)}`;
    }
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const fingerprint = await getFingerprint();
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key: "", fingerprint, product_id: product.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.download_url) { alert(data.error || "Download failed."); return; }
      const filename = `${product.name}.zip`;
      const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(data.download_url)}&filename=${encodeURIComponent(filename)}`;
      const dlRes = await fetch(proxyUrl);
      if (!dlRes.ok) throw new Error("Download failed");
      const blob = await dlRes.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl; a.download = filename; a.style.display = "none";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      setDownloaded(true);
    } catch { alert("Download failed. Please try again."); }
    finally { setDownloading(false); }
  };

  if (!product) {
    return (
      <div className="w-full bg-white/5 rounded-3xl p-8 mb-12 flex items-center justify-center min-h-[300px] border border-white/10">
        <span className="animate-spin h-6 w-6 border-2 border-red-400 border-t-transparent rounded-full" />
        <p className="text-gray-400 font-medium ml-4">Loading featured release...</p>
      </div>
    );
  }

  const price = currency === "USD" ? product.price_usd : product.price_inr;
  const currencySymbol = currency === "USD" ? "$" : "₹";

  return (
    <>
      <div className="relative overflow-hidden w-full bg-black/40 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 md:p-14 mb-16 shadow-2xl border border-white/5 group">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-red-900/20 to-black/80 opacity-60 pointer-events-none group-hover:opacity-80 transition-opacity duration-1000" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-700/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none blur-sm">
          <Sparkles size={160} className="text-red-300 w-40 h-40" />
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 flex flex-col items-start gap-5">
            <motion.span 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500/20 to-red-700/20 text-red-300 text-sm font-semibold tracking-wide border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <Sparkles size={14}  />
              {purchased ? "You Own This" : "Featured Release"}
            </motion.span>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-lg"
            >
              {purchased ? "" : "Elevate Your Mixes with "}
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-rose-600">
                {product.name}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-300 text-lg md:text-xl max-w-md mt-2 font-light leading-relaxed"
            >
              {product.description}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              {purchased ? (
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="group relative w-full sm:w-auto px-8 py-4 bg-green-500 text-white hover:bg-green-400 rounded-2xl font-bold text-base transition-all hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg"
                >
                  {downloading ? <Loader2 size={18} className="animate-spin" /> : downloaded ? <Check size={18} /> : <Download size={18}  />}
                  {downloading ? "Downloading..." : downloaded ? "Downloaded" : "Download Now"}
                </button>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="group relative w-full sm:w-auto px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-2xl font-bold text-base transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get It Now for {price !== undefined ? `${currencySymbol}${price}` : "Free"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              )}
            </motion.div>
          </div>

          <div className="order-1 md:order-2 w-full flex justify-center md:justify-end perspective-1000">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -15, rotateX: 5 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative w-full aspect-[4/3] max-w-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 group-hover:border-red-500/30 transition-colors duration-700"
            >
              <Image
                src={product.cover_image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {!purchased && (
        <CheckoutModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          productName={product.name}
          productId={product.id}
          currency={currency}
          price={price}
          currencySymbol={currencySymbol}
        />
      )}
    </>
  );
}
