"use client";

import React, { useState } from "react";
import CurrencyToggle from "@/components/store/CurrencyToggle";
import HeroSection from "@/components/store/HeroSection";
import ProductGrid from "@/components/store/ProductGrid";

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

interface StoreClientProps {
  products: Product[];
}

export default function StoreClient({ products }: StoreClientProps) {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  const featuredProduct = products.find((p) => p.is_featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 px-4 sm:px-6 lg:px-8 py-12 font-sans selection:bg-indigo-300 selection:text-indigo-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header section with toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 pb-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Sample Store
            </h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 font-medium">
              Premium audio plugins for your workflow
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Pricing</span>
            <CurrencyToggle currency={currency} onChange={setCurrency} />
          </div>
        </div>

        {/* Featured Section */}
        {featuredProduct && (
          <HeroSection product={featuredProduct} currency={currency} />
        )}

        {/* All Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-l-4 border-indigo-500 pl-4 py-1">
            All Releases
          </h2>
          <ProductGrid products={products} currency={currency} />
        </div>
      </div>
    </div>
  );
}
