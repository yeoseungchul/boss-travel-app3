import { createBrowserClient } from "@supabase/ssr";

function cleanEnv(raw: string | undefined): string {
  if (raw == null) return "";
  let s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function requireSupabasePublicEnv(): { url: string; supabaseKey: string } {
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anon = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const publishable = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const supabaseKey = anon || publishable;
  if (!url || !supabaseKey) {
    throw new Error(
      "Supabase: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in .env.local.",
    );
  }
  return { url, supabaseKey };
}

/**
 * Browser-only Supabase client.
 *
 * NOTE: `lib/supabase.ts` imports `next/headers` for server cookies, so it must not
 * be imported by Client Components. This thin wrapper keeps client bundles clean.
 */
export function createBrowserSupabaseClient() {
  const { url, supabaseKey } = requireSupabasePublicEnv();
  return createBrowserClient(url, supabaseKey);
}

