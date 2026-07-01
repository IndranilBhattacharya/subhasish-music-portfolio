import React from "react";
import ProductCard from "./ProductCard";

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

interface ProductGridProps {
  products: Product[];
  currency: "USD" | "INR";
  purchases?: Record<string, string>;
}

export default function ProductGrid({ products, currency, purchases = {} }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        No products available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2k:grid-cols-5 4k:grid-cols-6 8k:grid-cols-8 gap-8 4k:gap-14 8k:gap-24 w-full mt-10">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          currency={currency}
          purchased={!!purchases[product.id]}
        />
      ))}
    </div>
  );
}
