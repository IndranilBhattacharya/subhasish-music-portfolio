import { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";
import { supabaseAdmin } from "../../lib/supabase/admin";

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

    // Use Razorpay for both INR and USD
    // Razorpay supports international payments in USD
    const customer: any = {};
    if (customer_name) customer.name = customer_name;
    if (customer_email) customer.email = customer_email;

    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || (host?.includes("localhost") ? "http" : "https");
    const baseUrl = `${protocol}://${host}`;

    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round(price * 100),
      currency: currency === "USD" ? "USD" : "INR",
      accept_partial: false,
      description: `${product.name}`,
      customer,
      notify: {
        email: !!customer_email,
        sms: false,
      },
      reminder_enable: false,
      notes: {
        product_id: product.id,
        currency,
        customer_name: customer_name || "",
        customer_email: customer_email || "",
      },
      callback_url: `${baseUrl}/samples-store/success`,
      callback_method: "get",
    });

    return res.status(200).json({ url: paymentLink.short_url });
  } catch (error: any) {
    console.error("Checkout Error:", error.message);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
