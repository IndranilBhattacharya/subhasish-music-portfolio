-- Products Table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  platforms TEXT[] DEFAULT '{}',
  price_usd NUMERIC(10, 2) NOT NULL,
  mrp_usd NUMERIC(10, 2),
  price_inr NUMERIC(10, 2) NOT NULL,
  mrp_inr NUMERIC(10, 2),
  is_featured BOOLEAN DEFAULT false,
  file_path TEXT NOT NULL, -- Path in the private 'vst-releases' bucket
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'INR')),
  amount_paid NUMERIC(10, 2) NOT NULL,
  payment_provider TEXT NOT NULL CHECK (payment_provider IN ('stripe', 'razorpay')),
  payment_intent_id TEXT UNIQUE NOT NULL, -- Strike checkout session ID or Razorpay order/payment ID
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Licenses Table
CREATE TABLE public.licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  license_key UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  fingerprints TEXT[] DEFAULT '{}', -- Device fingerprints that are authorized to re-download
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read, only anon/authenticated can't write (handled by admin Dashboard)
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- Orders: Users can only see their own orders based on email (if authenticated, though webhook uses service_role to bypass)
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.jwt() ->> 'email' = customer_email);

-- Licenses: Similar setup
CREATE POLICY "Users can view their own licenses" ON public.licenses FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE customer_email = auth.jwt() ->> 'email')
);
