export type HomeRegionId = "macau" | "shanghai" | "combo";

export const DEFAULT_HOME_REGION: HomeRegionId = "macau";

/** Primary IANA timezone for “local time” on the home intel card. */
export const REGION_LOCAL_TIMEZONE: Record<HomeRegionId, string> = {
  macau: "Asia/Macau",
  shanghai: "Asia/Shanghai",
  combo: "Asia/Macau",
};

/** Pick two hero video tiles (product ids) per region — Video → Interest funnel. */
export const DESTINATION_TILE_IDS: Record<HomeRegionId, [string, string]> = {
  macau: ["macau-4d", "combo-7d"],
  shanghai: ["shanghai-5d", "combo-7d"],
  combo: ["macau-4d", "shanghai-5d"],
};

/** Preferred product order on home per region; ids from `data/products.json` not listed here are appended automatically. */
export const PRODUCT_HOME_ORDER: Record<HomeRegionId, string[]> = {
  macau: ["macau-4d", "combo-7d", "shanghai-5d"],
  shanghai: ["shanghai-5d", "combo-7d", "macau-4d"],
  combo: ["combo-7d", "macau-4d", "shanghai-5d"],
};

/** Full home list: region preference first, then remaining catalog ids in file order. */
export function mergeProductHomeOrder(region: HomeRegionId, catalogIdsInFileOrder: string[]): string[] {
  const preferred = PRODUCT_HOME_ORDER[region];
  const allowed = new Set(catalogIdsInFileOrder);
  const out: string[] = [];
  const push = (id: string) => {
    if (!allowed.has(id) || out.includes(id)) return;
    out.push(id);
  };
  for (const id of preferred) push(id);
  for (const id of catalogIdsInFileOrder) push(id);
  return out;
}

/**
 * Resolves the two cinematic tiles for the home funnel. Uses `DESTINATION_TILE_IDS` when those ids exist
 * in the catalog; otherwise falls back to the first distinct ids from the catalog.
 */
export function mergeDestinationTilePair(region: HomeRegionId, catalogIds: string[]): [string, string] {
  const [pa, pb] = DESTINATION_TILE_IDS[region];
  const set = new Set(catalogIds);
  const a = (set.has(pa) ? pa : catalogIds[0]) ?? "";
  const bPreferred = set.has(pb) ? pb : catalogIds.find((id) => id !== a);
  const b = bPreferred ?? catalogIds[1] ?? catalogIds[0] ?? a;
  return [a, b];
}
