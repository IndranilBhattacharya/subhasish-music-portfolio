

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface FeaturedProductProps {
  product: any;
  currency: "USD" | "INR";
}

export default function HeroSection({ product, currency }: FeaturedProductProps) {
  const [loading, setLoading] = useState(false);

  if (!product) {
    return (
      <div className="w-full bg-white/5 rounded-3xl p-8 mb-12 flex items-center justify-center min-h-[300px] border border-white/10">
        <span className="animate-spin h-6 w-6 border-2 border-indigo-400 border-t-transparent rounded-full" />
        <p className="text-gray-400 font-medium ml-4">Loading featured release...</p>
      </div>
    );
  }

  const price = currency === "USD" ? product.price_usd : product.price_inr;
  const currencySymbol = currency === "USD" ? "$" : "₹";

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, currency }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden w-full bg-black/40 backdrop-blur-3xl rounded-[2.5rem] 4k:rounded-[5rem] p-8 md:p-14 4k:p-24 8k:p-48 mb-16 4k:mb-32 8k:mb-64 shadow-2xl border border-white/5 group">
      {/* Animated glowing background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black/80 opacity-60 pointer-events-none group-hover:opacity-80 transition-opacity duration-1000" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute top-0 right-0 p-8 4k:p-24 opacity-10 pointer-events-none blur-sm">
        <Sparkles size={160} className="text-indigo-300 w-40 h-40 4k:w-96 4k:h-96 8k:w-[800px] 8k:h-[800px]" />
      </div>

      <div className="relative z-10 grid md:grid-cols-2 gap-12 4k:gap-24 8k:gap-48 items-center">
        <div className="order-2 md:order-1 flex flex-col items-start gap-5 4k:gap-12 8k:gap-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 4k:px-8 4k:py-4 8k:px-16 8k:py-8 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 text-sm 4k:text-3xl 8k:text-6xl font-semibold tracking-wide border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          >
            <Sparkles size={14} className="4k:w-8 4k:h-8 8k:w-24 8k:h-24" />
            Featured Release
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl 4k:text-8xl 8k:text-[14rem] font-extrabold text-white leading-tight drop-shadow-lg"
          >
            Elevate Your Mixes with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-pulse 8k:leading-snug">
              {product.name}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl 4k:text-4xl 8k:text-7xl max-w-md 4k:max-w-4xl 8k:max-w-7xl mt-2 font-light leading-relaxed 4k:leading-normal"
          >
            {product.description}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 4k:mt-16 8k:mt-32 flex flex-col sm:flex-row items-center gap-4 4k:gap-10 8k:gap-20 w-full sm:w-auto"
          >
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="group relative w-full sm:w-auto px-8 py-4 4k:px-16 4k:py-10 8k:px-40 8k:py-20 bg-white text-gray-900 hover:bg-gray-100 rounded-2xl 4k:rounded-[3rem] 8k:rounded-[6rem] font-bold text-base 4k:text-3xl 8k:text-6xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 4k:gap-6 8k:gap-12 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 4k:w-16 4k:h-16 8k:w-32 8k:h-32 border-2 4k:border-8 border-indigo-500 border-t-transparent rounded-full" />
              ) : (
                <>
                  <span className="relative z-10 flex items-center gap-2 4k:gap-6 8k:gap-12">
                    Get It Now for {price !== undefined ? `${currencySymbol}${price}` : "Free"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 4k:group-hover:translate-x-4 transition-transform 4k:w-12 4k:h-12 8k:w-24 8k:h-24" />
                  </span>
                </>
              )}
            </button>
          </motion.div>
        </div>

        <div className="order-1 md:order-2 w-full flex justify-center md:justify-end perspective-1000">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -15, rotateX: 5 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative w-full aspect-[4/3] max-w-lg 4k:max-w-5xl 8k:max-w-none 8k:w-[80%] rounded-3xl 4k:rounded-[4rem] 8k:rounded-[8rem] overflow-hidden shadow-2xl border-4 4k:border-8 8k:border-[16px] border-white/10 group-hover:border-indigo-500/30 transition-colors duration-700"
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
  );
}
