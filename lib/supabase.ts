import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseServiceClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Reads `NEXT_PUBLIC_SUPABASE_URL` plus either:
 * - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Dashboard → API → anon / legacy), or
 * - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (sb_publishable_…)
 *
 * Values are trimmed; wrapping single/double quotes are stripped.
 * Never commit real keys; use `.env.local` only.
 */
export function cleanEnv(raw: string | undefined): string {
  if (raw == null) return "";
  let s = raw.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function readPublicEnv(): {
  url: string;
  supabaseKey: string;
  keySource: "anon" | "publishable";
} | null {
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anon = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const publishable = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  const supabaseKey = anon || publishable;
  const keySource = anon ? "anon" : publishable ? "publishable" : "anon";

  if (!url || !supabaseKey) return null;
  return { url, supabaseKey, keySource };
}

export function getSupabasePublicEnv() {
  return readPublicEnv();
}

export function requireSupabasePublicEnv() {
  const v = readPublicEnv();
  if (!v) {
    throw new Error(
      "Supabase: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in .env.local — see .env.example.",
    );
  }
  return v;
}

/** Client Components — runs in the browser. */
export function createClient() {
  const { url, supabaseKey } = requireSupabasePublicEnv();
  return createBrowserClient(url, supabaseKey);
}

/** Server Components, Server Actions, Route Handlers. */
export async function createServerSupabaseClient() {
  const { url, supabaseKey } = requireSupabasePublicEnv();
  const cookieStore = await cookies();

  return createServerClient(url, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* Server Component: cookie writes happen in proxy */
        }
      },
    },
  });
}

/** Server-only: bypasses RLS. Set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (never commit). */
export function createServiceRoleSupabaseClient(): SupabaseClient | null {
  const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) return null;
  return createSupabaseServiceClient(url, key, { auth: { persistSession: false } });
}
