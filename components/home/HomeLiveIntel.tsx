"use client";

import { useHomeRegion } from "@/components/home/HomeRegionContext";
import { motion } from "framer-motion";
import { REGION_LOCAL_TIMEZONE } from "@/lib/regions";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

function formatTime(locale: string, timeZone: string, date: Date) {
  try {
    return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: locale === "en",
      timeZone,
    }).format(date);
  } catch {
    return date.toLocaleTimeString();
  }
}

export function HomeLiveIntel() {
  const t = useTranslations("Home");
  const { region } = useHomeRegion();
  const locale = useLocale();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const tz = REGION_LOCAL_TIMEZONE[region];
  const seoul = useMemo(() => formatTime(locale, "Asia/Seoul", now), [locale, now]);
  const localSpot = useMemo(() => formatTime(locale, tz, now), [locale, now, tz]);

  const localZoneLabel =
    region === "macau" ? t("localTimeZoneMacau") : region === "shanghai" ? t("localTimeZoneShanghai") : t("localTimeZoneCombo");

  const regionName =
    region === "macau" ? t("regionMacau") : region === "shanghai" ? t("regionShanghai") : t("regionCombo");
  const weatherSample =
    region === "macau" ? t("weatherSampleMacau") : region === "shanghai" ? t("weatherSampleShanghai") : t("weatherSampleCombo");

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-0)] p-5 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      aria-label={t("liveCardAria")}
    >
      <div className="pointer-events-none absolute -right-16 -top-24 h-52 w-52 rounded-full bg-boss-accent/18 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-boss-accent/10 blur-3xl" />

      <div className="relative flex flex-col gap-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-boss-accent/90">{t("liveEyebrow")}</p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-[var(--foreground)]">{t("liveTitle")}</h2>
            <p className="mt-1 text-xs font-medium text-[var(--muted)]">{t("liveRegionHint", { region: regionName })}</p>
          </div>
          <span className="flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.75)]" title={t("livePulse")} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-3.5">
            <p className="text-[0.68rem] font-medium uppercase tracking-wider text-[var(--muted)]">{t("rateLabel")}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--foreground)]">{t("rateSample")}</p>
            <p className="mt-0.5 text-[0.65rem] text-[var(--muted-2)]">{t("rateHint")}</p>
          </div>
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-3.5">
            <p className="text-[0.68rem] font-medium uppercase tracking-wider text-[var(--muted)]">{t("weatherLabel")}</p>
            <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">{weatherSample}</p>
            <p className="mt-0.5 text-[0.65rem] text-[var(--muted-2)]">{t("weatherHint")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-3.5">
            <p className="text-[0.68rem] font-medium uppercase tracking-wider text-[var(--muted)]">{t("localTimeLabel")}</p>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums tracking-tight text-boss-accent">{localSpot}</p>
            <p className="mt-0.5 text-[0.65rem] text-[var(--muted-2)]">{localZoneLabel}</p>
          </div>
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-3.5">
            <p className="text-[0.68rem] font-medium uppercase tracking-wider text-[var(--muted)]">{t("seoulTimeLabel")}</p>
            <p className="mt-1 font-mono text-lg font-semibold tabular-nums tracking-tight text-[var(--foreground)]">{seoul}</p>
            <p className="mt-0.5 text-[0.65rem] text-[var(--muted-2)]">{t("seoulTimeZone")}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
