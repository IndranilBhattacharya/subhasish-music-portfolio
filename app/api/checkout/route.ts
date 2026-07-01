import { NextResponse } from "next/server";
import Stripe from "stripe";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any, // use latest or fixed version depending on installation
});

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_id, currency } = body;

    if (!product_id || !currency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Fetch exact product details securely from DB
    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", product_id)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const price = currency === "USD" ? product.price_usd : product.price_inr;

    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
    const baseUrl = `${protocol}://${host}`;

    // 2. Routing Logic based on currency
    if (currency === "USD") {
      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                description: product.description,
                images: product.cover_image_url ? [product.cover_image_url] : [],
              },
              unit_amount: Math.round(price * 100), // Stripe expects cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/sample-store/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/sample-store/cancel`,
        metadata: {
          product_id: product.id,
          currency: "USD",
        },
      });

      return NextResponse.json({ url: session.url });
    } else if (currency === "INR") {
      // Create Razorpay Payment Link (acts like Stripe Checkout)
      // This creates a hosted checkout page URL
      const paymentLink = await razorpay.paymentLink.create({
        amount: Math.round(price * 100), // Razorpay expects paise
        currency: "INR",
        accept_partial: false,
        description: `Payment for ${product.name}`,
        customer: {
          name: "Guest", // Can be passed from client if known
          email: "guest@example.com", // Adjust as necessary
        },
        notify: { email: false, sms: false },
        reminder_enable: false,
        notes: {
          product_id: product.id,
          currency: "INR",
        },
        callback_url: `${baseUrl}/sample-store/success`,
        callback_method: "get",
      });

      return NextResponse.json({ url: paymentLink.short_url });
    } else {
      return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Checkout Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
