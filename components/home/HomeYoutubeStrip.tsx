"use client";

import { useHomeRegion } from "@/components/home/HomeRegionContext";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { YOUTUBE_BY_REGION, youtubeThumbnailUrl } from "@/lib/youtube-spotlight";

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

export function HomeYoutubeStrip() {
  const t = useTranslations("Home");
  const { region } = useHomeRegion();
  const items = YOUTUBE_BY_REGION[region];
  const regionName =
    region === "macau" ? t("regionMacau") : region === "shanghai" ? t("regionShanghai") : t("regionCombo");

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4"
      aria-labelledby="youtube-spotlight-heading"
    >
      <div className="flex flex-col gap-1 px-0.5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-boss-accent/90">{t("ytEyebrow")}</p>
        <h2 id="youtube-spotlight-heading" className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
          {t("ytSectionTitle")}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">{t("ytSectionHint")}</p>
        <p className="text-xs font-medium text-boss-accent/90">{t("ytCuratedFor", { region: regionName })}</p>
      </div>

      <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, idx) => (
          <li key={`${region}-${item.youtubeVideoId}`} className="snap-start" style={{ minWidth: "min(78vw, 17.5rem)" }}>
            <motion.a
              href={`https://www.youtube.com/watch?v=${item.youtubeVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.985 }}
              className="group relative block aspect-video w-full overflow-hidden rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface-1)] shadow-[0_16px_40px_-20px_rgba(0,0,0,0.55)] outline-none ring-boss-accent/0 transition hover:border-boss-accent/40 hover:shadow-[0_20px_48px_-18px_rgba(199,179,119,0.25)] focus-visible:ring-2 focus-visible:ring-boss-accent"
            >
              {/* Use <img> (not next/image) to avoid optimizer 404 noise for missing thumbnails. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={youtubeThumbnailUrl(item.youtubeVideoId)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/master-logo.png";
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-90 transition group-hover:scale-105 group-hover:opacity-100">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/35 backdrop-blur-md transition group-hover:bg-boss-accent group-hover:text-navy-950 group-hover:ring-boss-accent/50">
                  <PlayGlyph className="h-7 w-7 translate-x-0.5" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-white drop-shadow-md">{t(item.titleKey)}</p>
                <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-wider text-white/70">{t("ytOpen")}</p>
              </div>
              <span className="absolute right-2.5 top-2.5 rounded-md bg-black/55 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-white/90">
                YouTube
              </span>
              <span className="sr-only">{t("ytOpenSr", { n: idx + 1 })}</span>
            </motion.a>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
