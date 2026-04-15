"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function SosGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path strokeLinecap="round" d="M12 4v4M12 16v4M4 12h4M16 12h4" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function SosFab() {
  const t = useTranslations("Nav");

  return (
    <Link
      href="/sos"
      className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-400/40 bg-red-500/15 text-red-100 shadow-[0_8px_32px_rgba(239,68,68,0.35)] transition hover:bg-red-500/25 active:scale-95"
      aria-label={t("sos")}
    >
      <SosGlyph className="h-8 w-8" />
    </Link>
  );
}
