"use client";

import { useHomeRegion } from "@/components/home/HomeRegionContext";
import { DestinationVideoTile } from "@/components/DestinationVideoTile";
import { mergeDestinationTilePair } from "@/lib/regions";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export type DestinationCatalogItem = {
  id: string;
  label: string;
  src: string;
  tint: string;
};

type Props = {
  catalog: DestinationCatalogItem[];
};

export function HomeDestinations({ catalog }: Props) {
  const t = useTranslations("Home");
  const { region } = useHomeRegion();

  const tiles = useMemo(() => {
    const ids = catalog.map((c) => c.id);
    const [x, y] = mergeDestinationTilePair(region, ids);
    const map = new Map(catalog.map((c) => [c.id, c]));
    return [map.get(x), map.get(y)].filter(Boolean) as DestinationCatalogItem[];
  }, [catalog, region]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5"
      aria-label={t("destAria")}
    >
      <div className="px-0.5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-boss-accent/90">{t("destEyebrow")}</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground)]">{t("destTitle")}</h2>
        <p className="mt-1 text-xs text-[var(--muted)]">{t("destFunnelHint")}</p>
      </div>
      <div className="flex flex-col gap-5">
        {tiles.map((tile, i) => (
          <motion.div
            key={`${region}-${tile.id}`}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <DestinationVideoTile label={tile.label} src={tile.src} tint={tile.tint} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
