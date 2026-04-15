import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase";

/** Row shape for `public.products` (commerce + media fields). */
export type ProductDbRow = {
  id?: string;
  product_name?: string | null;
  title?: string | null;
  subtitle?: string | null;
  price_krw?: number | string | null;
  duration_days?: number | string | null;
  gallery_images?: string[] | null;
  inclusions?: string[] | null;
  exclusions?: string[] | null;
  description?: string | null;
  youtube_url?: string | null;
  itinerary?: unknown;
};

const PRODUCT_ROW_SELECT =
  "id, product_name, title, subtitle, price_krw, duration_days, gallery_images, inclusions, exclusions, description, youtube_url, itinerary" as const;

export function asFiniteInt(v: unknown): number | null {
  if (v == null) return null;
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string" && v.trim()) {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Normalizes Supabase `jsonb` itinerary to ordered day lines. */
export function parseItineraryFromDb(raw: unknown): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((s) => s.trim());
  }
  return [];
}

export function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((s) => s.trim());
}

/** One query per request when generateMetadata + page both need the row. */
export const getCachedProductRow = cache(async (id: string): Promise<ProductDbRow | null> => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_ROW_SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return data as ProductDbRow;
  } catch {
    return null;
  }
});
