import { createClient as createSb } from "@supabase/supabase-js";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE,
  isSupabaseConfigured,
} from "./config";

// Single-user app: no SSR cookies, no auth. We just instantiate a plain
// supabase client on the server. Prefer the service-role key when available
// (server-only), fall back to the anon key.
export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  const key = SUPABASE_SERVICE_ROLE || SUPABASE_ANON_KEY!;
  return createSb(SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
