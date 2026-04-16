"use client";

import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { RegionSelector } from "@/components/RegionSelector";
import { ThemeToggle } from "@/components/ThemeToggle";

export function TopBar() {
  const t = useTranslations("Home");

  return (
    <header className="mb-8 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          
          {/* 📍 로고 상자 시작 */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-1)] overflow-hidden shadow-sm">
            <img 
              src="/seojin-logo.jpg" 
              alt="Seojin Logo" 
              className="h-full w-full object-cover" 
            />
          </div> {/* 📍 여기가 아까 빠졌던 닫는 태그입니다! */}

          {/* 📍 브랜드 텍스트 상자 */}
          <div className="min-w-0">
            <p className="truncate text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-boss-accent/90">
              {t("brandKicker")}
            </p>
            <p className="truncate text-lg font-semibold tracking-tight text-[var(--foreground)]">
              {t("brandName")}
            </p>
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