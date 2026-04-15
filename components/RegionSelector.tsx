"use client";

import { useHomeRegion } from "@/components/home/HomeRegionContext";
import type { HomeRegionId } from "@/lib/regions";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

export type { HomeRegionId };

export function RegionSelector() {
  const t = useTranslations("Home");
  const { region: active, setRegion } = useHomeRegion();

  const chip = useCallback(
    (id: HomeRegionId, label: string) => {
      const on = active === id;
      return (
        <button
          key={id}
          type="button"
          onClick={() => setRegion(id)}
          className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold tracking-wide transition active:scale-[0.98] ${
            on
              ? "bg-boss-accent text-navy-950 shadow-[0_8px_24px_rgba(199,179,119,0.35)]"
              : "border border-[var(--border-subtle)] bg-[var(--surface-1)] text-[var(--muted)] hover:border-boss-accent/30 hover:text-[var(--foreground)]"
          }`}
        >
          {label}
        </button>
      );
    },
    [active, setRegion],
  );

  return (
    <div
      className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label={t("regionPickerAria")}
    >
      {chip("macau", t("regionMacau"))}
      {chip("shanghai", t("regionShanghai"))}
      {chip("combo", t("regionCombo"))}
    </div>
  );
}
