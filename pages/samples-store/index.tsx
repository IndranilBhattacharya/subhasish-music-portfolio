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
      className="relative overflow-hidden w-full min-h-screen flex flex-col items-center pb-28"
    >
      <Head>
        <title>Subhasish Music - The Vault</title>
        <meta property="og:title" content="Subhasish Music | The Vault" />
        <meta name="description" content="Premium VST plugins and music samples for professional audio production." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToolBar />

      <main className="flex-1 container-app pt-10 lg:pt-32 z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center md:items-start mb-12 sm:mb-16 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-[200px] bg-red-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="text-center md:text-left relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-red-100 to-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)] tracking-tight"
            >
              The Vault
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-3 text-lg sm:text-xl text-red-200/70 font-medium max-w-2xl tracking-wide"
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
        <div className="mt-16 mb-20 text-left w-full">
          <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-red-500 pl-4 py-1">
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
