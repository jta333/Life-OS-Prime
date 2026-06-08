// NOTE: This module is imported by client-side code (see client.ts), so it must
// only ever reference NEXT_PUBLIC_* vars. The service-role key is a server-only
// secret and is intentionally NOT read here, keep it out of any client bundle.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
