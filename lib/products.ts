import productCatalog from "@/data/products.json";

/**
 * Travel product ids and defaults come from `data/products.json`.
 * Supabase `public.products` can override price, duration, itinerary, gallery, copy (see `getCachedProductRow`).
 * After adding an id: add matching `Products.{messageKey}` and `Itinerary.{messageKey}` in ko/en/zh messages.
 */
export type ProductId = string;

export type ProductRecord = {
  id: ProductId;
  /** Key under `Products` and `Itinerary` in locale JSON. */
  messageKey: string;
  priceKRW: number;
  durationDays: number;
  videoSrc: string;
  videoTint: string;
  /** Hero still for home product cards (high-res, cinematic crop). */
  heroImage: string;
  /** Optional gallery images for SEO / sharing / detail view. */
  gallery_images?: string[];
};

const loaded = productCatalog as ProductRecord[];

function assertProductCatalog(list: ProductRecord[]) {
  const ids = new Set<string>();
  for (const p of list) {
    if (!p.id?.trim()) throw new Error("[products] Each product needs a non-empty `id`");
    if (ids.has(p.id)) throw new Error(`[products] Duplicate id: ${p.id}`);
    ids.add(p.id);
    if (!p.messageKey?.trim()) throw new Error(`[products] Missing messageKey for id "${p.id}"`);
  }
}

assertProductCatalog(loaded);

export const PRODUCTS: readonly ProductRecord[] = loaded;

export function getProduct(id: string): ProductRecord | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatKRW(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}
