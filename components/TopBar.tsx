"use client";

import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { RegionSelector } from "@/components/RegionSelector";
import { ThemeToggle } from "@/components/ThemeToggle";

function WingMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M4 28c8-4 14-12 16-22 2 10 8 18 16 22-6-2-10-6-12-11-2 5-6 9-12 11-2-6-4-10-8-11Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path d="M20 6v14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

export function TopBar() {
  const t = useTranslations("Home");

  return (
    <header className="mb-8 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] text-boss-accent shadow-sm">
            <WingMark className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-boss-accent/90">{t("brandKicker")}</p>
            <p className="truncate text-lg font-semibold tracking-tight text-[var(--foreground)]">{t("brandName")}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </div>
      <RegionSelector />
    </header>
  );
}
