"use client";

import { useHomeRegion } from "@/components/home/HomeRegionContext";
import { fetchRealtimeMockSnapshot, type RealtimeMockSnapshot, type WeatherConditionCode } from "@/lib/realtime-api";
import { REGION_LOCAL_TIMEZONE, type HomeRegionId } from "@/lib/regions";
import { motion } from "framer-motion";
import {
  CloudRain,
  CloudSun,
  Sun,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

const cardMotion = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function weatherIcon(code: WeatherConditionCode, className: string) {
  switch (code) {
    case "clear":
      return <Sun className={className} strokeWidth={1.5} aria-hidden />;
    case "partly_cloudy":
      return <CloudSun className={className} strokeWidth={1.5} aria-hidden />;
    case "rain":
      return <CloudRain className={className} strokeWidth={1.5} aria-hidden />;
    default:
      return <CloudSun className={className} strokeWidth={1.5} aria-hidden />;
  }
}

function PulseTimeDisplay({ timeZone }: { timeZone: string }) {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    setMounted(true);
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const localeTag = locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "ko-KR";
  const hour12 = locale === "en";

  // Avoid SSR/CSR mismatches (seconds tick) by rendering time only after mount.
  if (!mounted) {
    return <span className="font-mono text-[1.35rem] font-semibold tabular-nums tracking-tight text-[var(--foreground)]">--:--:--</span>;
  }

  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat(localeTag, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12,
      timeZone,
    }).formatToParts(now);
  } catch {
    parts = [{ type: "literal", value: now.toLocaleTimeString() }];
  }

  return (
    <span className="font-mono text-[1.35rem] font-semibold tabular-nums tracking-tight text-[var(--foreground)]">
      {parts.map((p, i) =>
        p.type === "literal" && p.value === ":" ? (
          <span key={i} className="mx-0.5 inline-block animate-pulse text-boss-accent" aria-hidden>
            :
          </span>
        ) : (
          <span key={i} className={p.type === "dayPeriod" ? "ml-1 text-sm font-medium text-[var(--muted)]" : undefined}>
            {p.value}
          </span>
        ),
      )}
    </span>
  );
}

function formatKrwCompact(n: number, locale: string) {
  const tag = locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "ko-KR";
  return new Intl.NumberFormat(tag, { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(n);
}

function glassCardClass() {
  return [
    "relative overflow-hidden rounded-[1.35rem]",
    "border border-[var(--border-subtle)] bg-[var(--surface-0)]/75",
    "shadow-[0_16px_48px_-18px_rgba(0,0,0,0.55)] backdrop-blur-xl",
    "ring-1 ring-inset ring-white/[0.06]",
  ].join(" ");
}

export function RealTimeInfoCards() {
  const t = useTranslations("RealTime");
  const { region } = useHomeRegion();
  const locale = useLocale();
  const [snap, setSnap] = useState<RealtimeMockSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const data = await fetchRealtimeMockSnapshot(region as HomeRegionId);
      if (!cancelled) setSnap(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [region]);

  const localTz = REGION_LOCAL_TIMEZONE[region as HomeRegionId];

  const weatherStatusLabel =
    snap == null
      ? ""
      : snap.weather.code === "clear"
        ? t("weather_clear")
        : snap.weather.code === "partly_cloudy"
          ? t("weather_partly_cloudy")
          : t("weather_rain");

  const currencyLabel = snap?.fx.quoteCode === "MOP" ? t("currencyMOP") : t("currencyCNY");
  const trendUp = snap != null && snap.fx.trendPct >= 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4"
      aria-label={t("aria")}
    >
      <div className="px-0.5">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.36em] text-boss-accent/95">{t("eyebrow")}</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground)]">{t("title")}</h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-16px" }}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-visible pb-2 pl-0.5 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Weather */}
        <motion.article variants={cardMotion} className={`${glassCardClass()} w-[min(86vw,18.5rem)] shrink-0 snap-start p-5`}>
          <div className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full bg-boss-accent/15 blur-2xl" />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">{t("weatherLabel")}</p>
                <p className="mt-1 text-xs font-medium text-boss-accent/90">{t(`region_${region}`)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)]/80 text-boss-accent">
                {snap ? weatherIcon(snap.weather.code, "h-6 w-6") : <CloudSun className="h-6 w-6 opacity-40" strokeWidth={1.5} />}
              </div>
            </div>
            {snap ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tabular-nums tracking-tight text-[var(--foreground)]">{snap.weather.tempC}</span>
                  <span className="text-lg font-medium text-[var(--muted)]">°C</span>
                </div>
                <p className="text-sm font-medium leading-snug text-[var(--foreground)]">{weatherStatusLabel}</p>
                <p className="text-xs text-[var(--muted-2)]">{t("humidity", { n: snap.weather.humidityPct })}</p>
              </>
            ) : (
              <div className="h-24 animate-pulse rounded-xl bg-[var(--surface-1)]/50" />
            )}
          </div>
        </motion.article>

        {/* FX */}
        <motion.article variants={cardMotion} className={`${glassCardClass()} w-[min(86vw,18.5rem)] shrink-0 snap-start p-5`}>
          <div className="pointer-events-none absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-boss-accent/12 blur-2xl" />
          <div className="relative flex flex-col gap-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">{t("fxLabel")}</p>
            {snap ? (
              <>
                <p className="text-xs font-medium text-boss-accent/90">
                  {t("fxPair", { currency: currencyLabel })}
                </p>
                <p className="text-[0.7rem] text-[var(--muted-2)]">{t("fxUnitCaption")}</p>
                <div className="flex flex-wrap items-end gap-2">
                  <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-[var(--foreground)]">
                    {formatKrwCompact(snap.fx.krwPerUnit, locale)}
                  </span>
                  <span className="pb-0.5 text-sm font-medium text-[var(--muted)]">KRW</span>
                </div>
                <div
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums ${
                    trendUp
                      ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-200"
                      : "border-rose-400/35 bg-rose-500/10 text-rose-100"
                  }`}
                >
                  {trendUp ? <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> : <TrendingDown className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />}
                  <span>
                    {trendUp ? "+" : ""}
                    {snap.fx.trendPct.toFixed(2)}%
                  </span>
                  <span className="font-normal opacity-80">{t("trendVsPrev")}</span>
                </div>
              </>
            ) : (
              <div className="h-28 animate-pulse rounded-xl bg-[var(--surface-1)]/50" />
            )}
            <p className="text-[0.65rem] leading-relaxed text-[var(--muted-2)]">{t("fxDisclaimer")}</p>
          </div>
        </motion.article>

        {/* Dual clock */}
        <motion.article variants={cardMotion} className={`${glassCardClass()} w-[min(92vw,20rem)] shrink-0 snap-start p-5`}>
          <div className="relative flex flex-col gap-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">{t("clocksLabel")}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex min-w-0 flex-col gap-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)]/60 px-3 py-3">
                <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-boss-accent/90">{t("seoulLabel")}</p>
                <PulseTimeDisplay timeZone="Asia/Seoul" />
              </div>
              <div className="flex min-w-0 flex-col gap-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)]/60 px-3 py-3">
                <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-boss-accent/90">{t("localLabel")}</p>
                <PulseTimeDisplay timeZone={localTz} />
              </div>
            </div>
            <p className="text-[0.62rem] leading-relaxed text-[var(--muted-2)]">{t("clockHint")}</p>
          </div>
        </motion.article>
      </motion.div>
    </motion.section>
  );
}
