"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = { ko: "KO", en: "EN", zh: "中文" };

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-1)] p-1"
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((l) => {
        const on = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => {
              router.replace(pathname, { locale: l });
              router.refresh();
            }}
            className={`min-h-11 min-w-11 rounded-full px-3 text-sm font-semibold tracking-wide transition active:scale-95 ${
              on ? "bg-boss-accent text-navy-950 shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {labels[l]}
          </button>
        );
      })}
    </div>
  );
}
