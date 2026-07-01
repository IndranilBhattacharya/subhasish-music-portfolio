import { memo, useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import { motion } from "framer-motion";

import ToolBar from "../../components/Utilities/ToolBar";
import BottomNavBar from "../../components/Utilities/BottomNavBar";
import classes from "../../styles/SampleStore.module.css";

import { supabaseAdmin } from "../../lib/supabase/admin";
import HeroSection from "../../components/store/HeroSection";
import ProductGrid from "../../components/store/ProductGrid";

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
  is_featured: boolean;
}

interface SamplesStoreProps {
  products: Product[];
  detectedCurrency: "USD" | "INR";
}

const sampleStorePageAnimationStates = {
  initial: { opacity: 0 },
  stable: { opacity: 1 },
  exit: { opacity: 0 },
};

const SamplesStore: NextPage<SamplesStoreProps> = ({ products, detectedCurrency }) => {
  const currency = detectedCurrency;
  const featuredProduct = products.find((p) => p.is_featured);
  const [purchases, setPurchases] = useState<Record<string, string>>({});

  const getFingerprint = useCallback(async (): Promise<string> => {
    try {
      const FingerprintJS = (await import("@fingerprintjs/fingerprintjs")).default;
      const fp = await FingerprintJS.load();
      const fpResult = await fp.get();
      return fpResult.visitorId;
    } catch {
      const raw = [navigator.userAgent, navigator.language, screen.width, screen.height, screen.colorDepth, new Date().getTimezoneOffset()].join("|");
      let hash = 0;
      for (let i = 0; i < raw.length; i++) { hash = (hash << 5) - hash + raw.charCodeAt(i); hash |= 0; }
      return `fallback-${Math.abs(hash).toString(36)}`;
    }
  }, []);

  // Check which products this device has already purchased
  useEffect(() => {
    const checkPurchases = async () => {
      try {
        const fingerprint = await getFingerprint();
        const res = await fetch("/api/check-purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fingerprint }),
        });
        const data = await res.json();
        if (data.purchases) setPurchases(data.purchases);
      } catch { /* silent */ }
    };
    checkPurchases();
  }, [getFingerprint]);

  return (
    <motion.div
      exit="exit"
      animate="stable"
      initial="initial"
      variants={sampleStorePageAnimationStates}
      className="relative overflow-hidden w-full min-h-screen flex flex-col items-center pb-24"
    >
      <Head>
        <title>Subhasish Music - The Vault</title>
        <meta property="og:title" content="Subhasish Music | The Vault" />
        <meta name="description" content="Premium VST plugins and music samples for professional audio production." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToolBar />

      <main className="flex-1 w-[90vw] md:w-[85vw] lg:w-[80vw] 2xl:w-[75vw] 2k:w-[68vw] 4k:w-[58vw] 8k:w-[48vw] px-2 sm:px-4 4k:px-12 8k:px-24 pt-32 4k:pt-48 8k:pt-80 z-10 selection:bg-indigo-500 selection:text-white transition-colors duration-500">
        
        {/* Header */}
        <div className="flex flex-col items-center md:items-start mb-12 sm:mb-16 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-[200px] bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="text-center md:text-left relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl 4k:text-[6rem] 8k:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-indigo-400 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)] tracking-tight 4k:leading-tight 8k:leading-tight"
            >
              The Vault
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-3 4k:mt-8 8k:mt-12 text-lg sm:text-xl 4k:text-3xl 8k:text-5xl text-indigo-200/70 font-medium max-w-2xl 4k:max-w-4xl 8k:max-w-7xl tracking-wide 4k:leading-snug"
            >
              Studio-grade tools & artifacts engineered to elevate your production workflow.
            </motion.p>
          </div>
        </div>

        {/* Featured Section */}
        {featuredProduct && (
          <HeroSection product={featuredProduct} currency={currency} purchased={!!purchases[featuredProduct.id]} />
        )}

        {/* All Products */}
        <div className="mt-16 4k:mt-32 8k:mt-64 mb-20 4k:mb-40 text-left w-full">
          <h2 className="text-3xl 4k:text-5xl 8k:text-8xl font-bold text-white mb-8 4k:mb-16 border-l-4 4k:border-l-8 8k:border-l-[12px] border-indigo-500 pl-4 4k:pl-8 8k:pl-16 py-1 4k:py-3">
            All Releases
          </h2>
          <ProductGrid products={products} currency={currency} purchases={purchases} />
        </div>

      </main>

      <div
        className={`fixed -bottom-1/2 left-0 lg:-bottom-[35vw] lg:left-[23vw] ${classes["bg-bottom"]} -z-10 opacity-30 pointer-events-none`}
      ></div>

      <BottomNavBar />
    </motion.div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error.message);
  }

  // Auto-detect currency from Accept-Language or CF-IPCountry header
  let detectedCurrency: "USD" | "INR" = "USD";
  const cfCountry = ctx.req.headers["cf-ipcountry"] as string | undefined;
  const xCountry = ctx.req.headers["x-vercel-ip-country"] as string | undefined;
  const country = cfCountry || xCountry || "";

  if (country.toUpperCase() === "IN") {
    detectedCurrency = "INR";
  } else {
    // Fallback: check Accept-Language for Indian locales
    const acceptLang = ctx.req.headers["accept-language"] || "";
    if (acceptLang.includes("hi") || acceptLang.includes("bn") || acceptLang.includes("ta") || acceptLang.includes("te") || acceptLang.includes("mr") || acceptLang.includes("en-IN")) {
      detectedCurrency = "INR";
    }
  }

  return {
    props: {
      products: data || [],
      detectedCurrency,
    },
  };
};

export default memo(SamplesStore);
