import { createClient } from '@supabase/supabase-js';

// The Service Role Key allows bypassing Row Level Security (RLS) policies.
// Use this ONLY in secure server environments like API routes or server actions.
// Never expose NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY to the client.

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("Missing Supabase Environment Variables");
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
