"use client";

import { useHomeRegion } from "@/components/home/HomeRegionContext";
import { Link } from "@/i18n/navigation";
import { mergeProductHomeOrder } from "@/lib/regions";
import type { ShortFormReelDTO } from "@/lib/short-form-clips";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type Props = {
  clips: ShortFormReelDTO[];
};

const SLIDE_STYLE: CSSProperties = {
  minHeight: "min(78dvh, 36rem)",
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
};

export function HomeShortFormReels({ clips }: Props) {
  const tHome = useTranslations("Home");
  const tProducts = useTranslations("Products");
  const { region } = useHomeRegion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement | null>>(new Map());
  const [activeProductId, setActiveProductId] = useState("");

  const ordered = useMemo(() => {
    const ids = mergeProductHomeOrder(
      region,
      clips.map((c) => c.productId),
    );
    const m = new Map(clips.map((c) => [c.productId, c]));
    return ids.map((id) => m.get(id)).filter(Boolean) as ShortFormReelDTO[];
  }, [clips, region]);

  useEffect(() => {
    setActiveProductId((prev) => {
      if (ordered.length === 0) return "";
      if (prev && ordered.some((c) => c.productId === prev)) return prev;
      return ordered[0]!.productId;
    });
  }, [ordered]);

  const syncPlayback = useCallback(() => {
    for (const [id, el] of videoRefs.current) {
      if (!el) continue;
      if (id === activeProductId) {
        void el.play().catch(() => {});
      } else {
        el.pause();
        el.currentTime = 0;
      }
    }
  }, [activeProductId]);

  useEffect(() => {
    syncPlayback();
  }, [syncPlayback]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || ordered.length === 0) return;

    const slides = root.querySelectorAll<HTMLElement>("[data-reel-slide]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio >= 0.5)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target) {
          const id = visible.target.getAttribute("data-product-id");
          if (id) setActiveProductId(id);
        }
      },
      { root, rootMargin: "0px", threshold: [0.45, 0.55, 0.65, 0.75] },
    );

    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ordered]);

  if (ordered.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4"
      aria-label={tHome("reelAria")}
    >
      <div className="px-0.5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-boss-accent/95">{tHome("reelEyebrow")}</p>
        <h2 className="reel-display mt-1.5 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{tHome("reelTitle")}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{tHome("reelHint")}</p>
        <p className="mt-1 text-xs font-medium text-boss-accent/80">{tHome("reelSwipe")}</p>
      </div>

      <div
        ref={scrollRef}
        className="reel-scroll-hide flex max-h-[min(78dvh,40rem)] w-[calc(100%+2.5rem)] -mx-5 flex-col gap-4 overflow-y-auto overflow-x-hidden pb-1 pl-5 pr-5 pt-0.5 [scroll-snap-type:y_mandatory]"
      >
        {ordered.map((clip, idx) => {
          const isActive = clip.productId === activeProductId;
          return (
            <article
              key={clip.id}
              data-reel-slide
              data-product-id={clip.productId}
              style={SLIDE_STYLE}
              className="relative shrink-0 overflow-hidden rounded-[1.65rem] border border-white/[0.12] bg-[var(--navy-900)] shadow-[0_28px_80px_-32px_rgba(0,0,0,0.75)]"
            >
              <div className="absolute inset-0">
                {!isActive ? (
                  <Image
                    src={clip.posterSrc}
                    alt=""
                    fill
                    sizes="(max-width: 448px) 100vw, 28rem"
                    className="object-cover"
                    loading={idx === 0 ? "eager" : "lazy"}
                    priority={idx === 0}
                  />
                ) : (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current.set(clip.productId, el);
                      else videoRefs.current.delete(clip.productId);
                    }}
                    className="h-full w-full object-cover"
                    src={clip.videoSrc}
                    poster={clip.posterSrc}
                    muted
                    playsInline
                    loop
                    preload={idx === 0 ? "auto" : "metadata"}
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070c]/95 via-[#05070c]/35 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-5 pt-16">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-boss-accent/95">{tHome("reelFrom")}</p>
                  <h3 className="mt-1 text-xl font-semibold leading-snug text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]">
                    {tProducts(`${clip.messageKey}.name`)}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/75 drop-shadow-md">{tProducts(`${clip.messageKey}.tagline`)}</p>
                  <p className="mt-2 text-sm font-semibold tabular-nums text-boss-accent">{clip.priceLabel}</p>
                </div>
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
                  <Link
                    href="/inquiry"
                    className="flex min-h-[3.25rem] flex-1 items-center justify-center rounded-2xl bg-boss-accent text-center text-sm font-semibold text-navy-950 shadow-[0_12px_36px_rgba(199,179,119,0.35)] transition hover:brightness-110 active:scale-[0.99]"
                  >
                    {tHome("reelCtaConsult")}
                  </Link>
                  <Link
                    href={`/product/${clip.productId}`}
                    className="flex min-h-[3.25rem] flex-1 items-center justify-center rounded-2xl border border-white/25 bg-white/[0.08] text-center text-sm font-semibold text-white backdrop-blur-md transition hover:border-boss-accent/45 hover:bg-white/[0.12]"
                  >
                    {tHome("reelCtaProduct")}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </motion.section>
  );
}
