/**
 * Best-effort per-IP inquiry throttling (in-memory).
 * Replace with Redis / Upstash for multi-instance production.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

type Bucket = { n: number; reset: number };

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size < 2000) return;
  for (const [k, v] of buckets) {
    if (now > v.reset) buckets.delete(k);
  }
}

export type InquiryRateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

export function assertInquiryRateLimit(clientKey: string): InquiryRateLimitResult {
  const key = clientKey.slice(0, 200) || "unknown";
  const now = Date.now();
  prune(now);
  let b = buckets.get(key);
  if (!b || now > b.reset) {
    b = { n: 1, reset: now + WINDOW_MS };
    buckets.set(key, b);
    return { ok: true };
  }
  if (b.n >= MAX_PER_WINDOW) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((b.reset - now) / 1000)) };
  }
  b.n += 1;
  return { ok: true };
}
