import { memo, useState } from "react";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import { motion } from "framer-motion";

import ToolBar from "../../components/Utilities/ToolBar";
import BottomNavBar from "../../components/Utilities/BottomNavBar";
import classes from "../../styles/SampleStore.module.css";

import { supabaseAdmin } from "../../lib/supabase/admin";
import CurrencyToggle from "../../components/store/CurrencyToggle";
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
}

const sampleStorePageAnimationStates = {
  initial: { opacity: 0 },
  stable: { opacity: 1 },
  exit: { opacity: 0 },
};

const SamplesStore: NextPage<SamplesStoreProps> = ({ products }) => {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const featuredProduct = products.find((p) => p.is_featured);

  return (
    <motion.div
      exit="exit"
      animate="stable"
      initial="initial"
      variants={sampleStorePageAnimationStates}
      className="relative overflow-hidden w-full min-h-screen flex flex-col items-center pb-24"
    >
      <Head>
        <title>Subhasish Music - Samples Store</title>
        <meta property="og:title" content="Subhasish Music | Sample Store" />
        <meta
          name="description"
          content="Enterprise-grade digital store for premium VST plugins and music samples."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToolBar />

      <main className="flex-1 w-[90vw] md:w-[85vw] lg:w-[80vw] 2xl:w-[75vw] 2k:w-[68vw] 4k:w-[58vw] 8k:w-[48vw] px-2 sm:px-4 4k:px-12 8k:px-24 pt-32 4k:pt-48 8k:pt-80 z-10 selection:bg-indigo-500 selection:text-white transition-colors duration-500">
        
        {/* Header section with toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 sm:mb-16 gap-6 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-[200px] bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="mb-4 sm:mb-0 text-center md:text-left relative z-10">
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center space-x-4 4k:space-x-8 lg:space-x-4 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 4k:px-12 4k:py-8 8k:px-24 8k:py-16 rounded-3xl 4k:rounded-[3rem] shadow-xl z-10"
          >
            <span className="text-sm 4k:text-2xl 8k:text-4xl font-bold text-indigo-300 uppercase tracking-[0.2em] 4k:tracking-widest">Pricing Region</span>
            <CurrencyToggle currency={currency} onChange={setCurrency} />
          </motion.div>
        </div>

        {/* Featured Section */}
        {featuredProduct && (
          <HeroSection product={featuredProduct} currency={currency} />
        )}

        {/* All Products */}
        <div className="mt-16 4k:mt-32 8k:mt-64 mb-20 4k:mb-40 text-left w-full">
          <h2 className="text-3xl 4k:text-5xl 8k:text-8xl font-bold text-white mb-8 4k:mb-16 border-l-4 4k:border-l-8 8k:border-l-[12px] border-indigo-500 pl-4 4k:pl-8 8k:pl-16 py-1 4k:py-3">
            All Releases
          </h2>
          <ProductGrid products={products} currency={currency} />
        </div>

      </main>

      <div
        className={`fixed -bottom-1/2 left-0 lg:-bottom-[35vw] lg:left-[23vw] ${classes["bg-bottom"]} -z-10 opacity-30 pointer-events-none`}
      ></div>

      <BottomNavBar />
    </motion.div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error.message);
  }

  return {
    props: {
      products: data || [],
    },
  };
};

export default memo(SamplesStore);
