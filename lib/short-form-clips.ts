import { PRODUCTS } from "@/lib/products";

/** One vertical “reel” item — built from catalog for immersive feed + funnel CTAs. */
export type ShortFormReelDTO = {
  id: string;
  productId: string;
  messageKey: string;
  videoSrc: string;
  posterSrc: string;
  priceLabel: string;
};

export function buildShortFormReelsFromCatalog(
  items: { id: string; messageKey: string; videoSrc: string; heroImage: string; formattedPrice: string }[],
): ShortFormReelDTO[] {
  return items.map((p) => ({
    id: `reel-${p.id}`,
    productId: p.id,
    messageKey: p.messageKey,
    videoSrc: p.videoSrc,
    posterSrc: p.heroImage,
    priceLabel: p.formattedPrice,
  }));
}

/** Server-side default ordering (file order); client reorders by region. */
export function defaultShortFormReelsFromProducts(
  formatPrice: (priceKRW: number) => string,
): ShortFormReelDTO[] {
  return buildShortFormReelsFromCatalog(
    PRODUCTS.map((p) => ({
      id: p.id,
      messageKey: p.messageKey,
      videoSrc: p.videoSrc,
      heroImage: p.heroImage,
      formattedPrice: formatPrice(p.priceKRW),
    })),
  );
}
