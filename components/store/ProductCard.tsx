import React, { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Download, Loader2, Check } from "lucide-react";
import CheckoutModal from "./CheckoutModal";

interface Product {
  id: string;
  name: string;
  description: string;
  cover_image_url: string;
  platforms: string[];
  price_usd: number;
  mrp_usd: number;
  price_inr: number;
  mrp_inr: number;
}

interface ProductCardProps {
  product: Product;
  currency: "USD" | "INR";
  purchased?: boolean;
}

export default function ProductCard({ product, currency, purchased }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const price = currency === "USD" ? product.price_usd : product.price_inr;
  const mrp = currency === "USD" ? product.mrp_usd : product.mrp_inr;
  const currencySymbol = currency === "USD" ? "$" : "₹";

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
      if (!res.ok || !data.download_url) {
        alert(data.error || "Download failed. Please try again.");
        return;
      }
      const filename = `${product.name}.zip`;
      const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(data.download_url)}&filename=${encodeURIComponent(filename)}`;
      const dlRes = await fetch(proxyUrl);
      if (!dlRes.ok) throw new Error("Download failed");
      const blob = await dlRes.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      setDownloaded(true);
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-zinc-900/80 border border-zinc-800 rounded-2xl 4k:rounded-[2rem] 8k:rounded-[4rem] overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col group"
      >
        <div className="relative h-56 4k:h-96 8k:h-[600px] w-full bg-zinc-800 overflow-hidden">
          <Image
            src={product.cover_image_url || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
            alt={product.name || "Product image"}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle bottom gradient for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-900/80 to-transparent pointer-events-none" />
        </div>

        <div className="p-5 4k:p-10 8k:p-20 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2 mb-2 4k:mb-6 8k:mb-12">
            <h3 className="text-xl 4k:text-4xl 8k:text-6xl font-bold text-white leading-tight">{product.name}</h3>
            {purchased && (
              <span className="flex-shrink-0 text-[10px] 4k:text-lg 8k:text-2xl font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 4k:px-4 4k:py-1.5 rounded-full uppercase tracking-wider">
                Owned
              </span>
            )}
          </div>
          <p className="text-sm 4k:text-2xl 8k:text-4xl text-zinc-500 line-clamp-2 mb-5 4k:mb-10 8k:mb-20 flex-grow leading-relaxed">{product.description}</p>

          <div className="flex items-end justify-between mb-5 4k:mb-10 8k:mb-20">
            <div>
              {!purchased && mrp && (
                <span className="text-xs 4k:text-2xl 8k:text-4xl text-zinc-600 line-through block mb-0.5">{currencySymbol}{mrp}</span>
              )}
              <span className="text-2xl 4k:text-5xl 8k:text-7xl font-extrabold text-white">
                {purchased ? "" : price !== undefined ? `${currencySymbol}${price}` : "Free"}
              </span>
            </div>
          </div>

          {purchased ? (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-3 px-4 4k:py-6 4k:px-8 8k:py-12 8k:px-16 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/30 rounded-xl 4k:rounded-2xl 8k:rounded-[3rem] font-semibold text-sm 4k:text-3xl 8k:text-5xl flex items-center justify-center gap-2 4k:gap-5 8k:gap-10 transition-all disabled:opacity-60"
            >
              {downloading ? (
                <><Loader2 size={16} className="animate-spin" /> Downloading...</>
              ) : downloaded ? (
                <><Check size={16} /> Downloaded</>
              ) : (
                <><Download size={16} className="4k:w-8 4k:h-8 8k:w-16 8k:h-16" /> Download</>
              )}
            </button>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3 px-4 4k:py-6 4k:px-8 8k:py-12 8k:px-16 bg-white hover:bg-zinc-100 text-zinc-900 rounded-xl 4k:rounded-2xl 8k:rounded-[3rem] font-semibold text-sm 4k:text-3xl 8k:text-5xl flex items-center justify-center gap-2 4k:gap-5 8k:gap-10 transition-colors"
            >
              <ShoppingCart size={16} className="4k:w-8 4k:h-8 8k:w-16 8k:h-16" />
              Buy Now
            </button>
          )}
        </div>
      </motion.div>

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
