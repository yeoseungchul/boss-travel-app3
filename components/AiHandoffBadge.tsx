import { getTranslations } from "next-intl/server";

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  );
}

export async function AiHandoffBadge() {
  const t = await getTranslations("Home");

  return (
    <div className="flex items-center justify-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-3.5 text-[var(--muted)] shadow-sm">
      <ClockIcon className="h-5 w-5 shrink-0 text-boss-accent/90" />
      <AiIcon className="h-5 w-5 shrink-0 text-boss-accent" />
      <span className="text-center text-sm font-medium leading-snug">{t("badge")}</span>
    </div>
  );
}
