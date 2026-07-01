import { supabaseAdmin } from "@/lib/supabase/admin";
import StoreClient from "./StoreClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Store | VST Plugins",
  description: "Enterprise-grade digital store for premium VST plugins.",
};

export const revalidate = 60; // Revalidate every 60s

export default async function SampleStorePage() {
  // Fetch products using admin client or standard anon client (here we use admin for simplicity in server component)
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error.message);
  }

  return <StoreClient products={products || []} />;
}
