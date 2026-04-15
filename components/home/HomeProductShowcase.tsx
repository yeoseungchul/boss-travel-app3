"use client";

import { useHomeRegion } from "@/components/home/HomeRegionContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { mergeProductHomeOrder } from "@/lib/regions";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useMemo } from "react";

export type ShowcaseItem = {
  id: string;
  messageKey: string;
  formattedPrice: string;
  durationDays: number;
  heroImage: string;
};

type Props = {
  items: ShowcaseItem[];
  daysUnit: string;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const itemV = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const } },
};

export function HomeProductShowcase({ items, daysUnit }: Props) {
  const { region } = useHomeRegion();
  const tHome = useTranslations("Home");
  const tProducts = useTranslations("Products");

  const ordered = useMemo(() => {
    const catalogIds = items.map((x) => x.id);
    const order = mergeProductHomeOrder(region, catalogIds);
    const byId = new Map(items.map((x) => [x.id, x]));
    return order.map((id) => byId.get(id)).filter(Boolean) as ShowcaseItem[];
  }, [items, region]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      id="tours"
      className="flex scroll-mt-28 flex-col gap-5"
      aria-labelledby="tours-heading"
    >
      <div className="px-0.5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-boss-accent/90">{tHome("toursEyebrow")}</p>
        <h2 id="tours-heading" className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {tHome("toursTitle")}
        </h2>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-[var(--muted)]">{tHome("productsHint")}</p>
      </div>

      <motion.ul variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-24px" }} className="flex flex-col gap-4">
        {ordered.map((p) => (
          <motion.li key={`${region}-${p.id}`} variants={itemV}>
            <Link
              href={`/product/${p.id}`}
              className="group relative flex min-h-[7.5rem] flex-row overflow-hidden rounded-[1.35rem] border border-[var(--border-subtle)] bg-[var(--surface-0)] shadow-[0_18px_48px_-28px_rgba(0,0,0,0.55)] outline-none ring-boss-accent/0 transition active:scale-[0.992] focus-visible:ring-2 focus-visible:ring-boss-accent"
            >
              <div className="relative h-full w-[38%] max-w-[9.5rem] shrink-0 sm:w-[34%]">
                <Image
                  src={p.heroImage}
                  alt=""
                  fill
                  sizes="(max-width: 430px) 38vw, 160px"
                  className="object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-4 py-4 sm:px-5">
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-boss-accent/95">{tHome("tourBadge")}</span>
                <span className="text-lg font-semibold leading-snug text-[var(--foreground)] group-hover:text-boss-accent">
                  {tProducts(`${p.messageKey}.name`)}
                </span>
                <span className="line-clamp-2 text-sm leading-snug text-[var(--muted)]">{tProducts(`${p.messageKey}.tagline`)}</span>
                <span className="pt-1 text-sm font-semibold tabular-nums text-[var(--foreground)]">
                  <span className="text-boss-accent">{p.formattedPrice}</span>
                  <span className="mx-1.5 text-[var(--muted-2)]">·</span>
                  <span>
                    {p.durationDays}
                    {daysUnit}
                  </span>
                </span>
              </div>
              <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 text-boss-accent opacity-0 transition group-hover:opacity-100 sm:block">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div whileTap={{ scale: 0.99 }}>
        <Link
          href="/product"
          className="flex min-h-[3.5rem] items-center justify-center rounded-[1.25rem] border border-boss-accent/45 bg-gradient-to-r from-boss-accent-soft/35 via-boss-accent-soft/20 to-transparent py-3.5 text-base font-semibold text-boss-accent transition hover:border-boss-accent/60 hover:from-boss-accent-soft/50"
        >
          {tHome("seeAll")}
        </Link>
      </motion.div>
    </motion.section>
  );
}
