import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

export const supabase = (() => {
  if (supabaseInstance) return supabaseInstance;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build time to prevent prerender errors
    // Real client will be created at runtime when env vars are available
    return null as unknown as SupabaseClient;
  }
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
})();
