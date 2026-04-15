import { NextResponse } from "next/server";
import { getSupabasePublicEnv } from "@/lib/supabase";

/** GET /api/health/supabase — confirms env vars are loaded (no secrets in response). */
export function GET() {
  const env = getSupabasePublicEnv();
  let host: string | null = null;
  if (env?.url) {
    try {
      host = new URL(env.url).hostname;
    } catch {
      host = "invalid_url";
    }
  }
  return NextResponse.json({
    envConfigured: Boolean(env),
    urlHost: host,
    keySource: env?.keySource ?? null,
  });
}
