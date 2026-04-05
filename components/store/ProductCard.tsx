import React, { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Download, Monitor, Apple, Loader2, Check } from "lucide-react";
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
      // Get re-download URL
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
      // Proxy download
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
        className="bg-zinc-900 border border-zinc-800 rounded-2xl 4k:rounded-[2rem] 8k:rounded-[4rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
      >
        <div className="relative h-56 4k:h-96 8k:h-[600px] w-full bg-zinc-800">
          <Image
            src={product.cover_image_url || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
            alt={product.name || "Product image"}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 hover:scale-105"
          />
          {purchased && (
            <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Check size={12} /> Owned
            </div>
          )}
          <div className="absolute top-3 left-3 4k:top-6 4k:left-6 8k:top-12 8k:left-12 flex gap-2 4k:gap-4 8k:gap-8">
            {((product.platforms as any) || (product as any).platform ? (Array.isArray(product.platforms) ? product.platforms : [(product as any).platform || "Universal"]) : []).map((platform: string, i: number) => (
              <span key={i} className="bg-black/70 backdrop-blur-md text-white text-xs 4k:text-2xl 8k:text-4xl px-2 py-1 4k:px-4 4k:py-2 8k:px-8 8k:py-4 rounded-md 4k:rounded-xl 8k:rounded-3xl flex items-center gap-1 4k:gap-3 8k:gap-6">
                {platform.toLowerCase() === "macos" ? <Apple size={12} className="4k:w-8 4k:h-8 8k:w-16 8k:h-16" /> : <Monitor size={12} className="4k:w-8 4k:h-8 8k:w-16 8k:h-16" />}
                {platform}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 4k:p-10 8k:p-20 flex flex-col flex-grow">
          <h3 className="text-xl 4k:text-4xl 8k:text-6xl font-bold text-white mb-2 4k:mb-6 8k:mb-12">{product.name}</h3>
          <p className="text-sm 4k:text-2xl 8k:text-4xl text-gray-400 line-clamp-2 mb-4 4k:mb-10 8k:mb-20 flex-grow">{product.description}</p>

          <div className="flex items-end justify-between mb-5 4k:mb-10 8k:mb-20">
            <div>
              {!purchased && mrp && (
                <span className="text-xs 4k:text-2xl 8k:text-4xl text-gray-400 line-through block">{currencySymbol}{mrp}</span>
              )}
              <span className="text-2xl 4k:text-5xl 8k:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                {purchased ? "Purchased" : price !== undefined ? `${currencySymbol}${price}` : "Free"}
              </span>
            </div>
          </div>

          {purchased ? (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-3 px-4 4k:py-6 4k:px-8 8k:py-12 8k:px-16 bg-green-600 hover:bg-green-500 text-white rounded-xl 4k:rounded-2xl 8k:rounded-[3rem] font-semibold text-base 4k:text-3xl 8k:text-5xl flex items-center justify-center gap-2 4k:gap-5 8k:gap-10 transition-colors disabled:opacity-60"
            >
              {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} className="4k:w-8 4k:h-8 8k:w-16 8k:h-16" />}
              {downloading ? "Downloading..." : downloaded ? "Downloaded ✓" : "Download"}
            </button>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3 px-4 4k:py-6 4k:px-8 8k:py-12 8k:px-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl 4k:rounded-2xl 8k:rounded-[3rem] font-semibold text-base 4k:text-3xl 8k:text-5xl flex items-center justify-center gap-2 4k:gap-5 8k:gap-10 transition-colors"
            >
              <ShoppingCart size={18} className="4k:w-8 4k:h-8 8k:w-16 8k:h-16" />
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
