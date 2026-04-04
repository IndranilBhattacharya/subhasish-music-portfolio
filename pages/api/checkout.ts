import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import Razorpay from "razorpay";
import { supabaseAdmin } from "../../lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any,
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_SECRET || "",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { product_id, currency, customer_name, customer_email } = req.body;

    if (!product_id || !currency) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data: product, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", product_id)
      .single();

    if (error || !product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const price = currency === "USD" ? product.price_usd : product.price_inr;

    if (currency === "USD") {
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
              unit_amount: Math.round(price * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        // Stripe Checkout natively collects email
        customer_email: customer_email || undefined,
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/samples-store/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/samples-store`,
        metadata: {
          product_id: product.id,
          currency: "USD",
          customer_name: customer_name || "",
        },
      });

      return res.status(200).json({ url: session.url });
    } else if (currency === "INR") {
      // Build customer object — Razorpay will pre-fill these fields on the payment page
      const customer: any = {};
      if (customer_name) customer.name = customer_name;
      if (customer_email) customer.email = customer_email;

      const paymentLink = await razorpay.paymentLink.create({
        amount: Math.round(price * 100),
        currency: "INR",
        accept_partial: false,
        description: `Payment for ${product.name}`,
        customer,
        notify: {
          email: !!customer_email, // Send Razorpay's own receipt if email is provided
          sms: false,
        },
        reminder_enable: false,
        notes: {
          product_id: product.id,
          currency: "INR",
          customer_name: customer_name || "",
          customer_email: customer_email || "",
        },
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/samples-store/success`,
        callback_method: "get",
      });

      return res.status(200).json({ url: paymentLink.short_url });
    } else {
      return res.status(400).json({ error: "Unsupported currency" });
    }
  } catch (error: any) {
    console.error("Checkout Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
