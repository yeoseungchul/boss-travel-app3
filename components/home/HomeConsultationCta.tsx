"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function HomeConsultationCta() {
  const t = useTranslations("Home");

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[1.35rem] border border-boss-accent/35 bg-gradient-to-br from-boss-accent-soft/40 via-[var(--surface-0)] to-[var(--surface-1)] p-5 shadow-[0_20px_50px_-28px_rgba(199,179,119,0.2)]"
      aria-labelledby="home-consult-heading"
    >
      <div className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full bg-boss-accent/25 blur-3xl" />
      <div className="relative flex flex-col gap-3">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-boss-accent">{t("consultEyebrow")}</p>
        <h2 id="home-consult-heading" className="text-xl font-semibold leading-snug text-[var(--foreground)]">
          {t("consultTitle")}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">{t("consultBody")}</p>
        <motion.div whileTap={{ scale: 0.99 }} className="mt-1">
          <Link
            href="/inquiry"
            className="flex min-h-14 items-center justify-center rounded-2xl bg-boss-accent text-base font-semibold text-navy-950 shadow-[0_12px_32px_rgba(199,179,119,0.35)] transition hover:brightness-110"
          >
            {t("consultCta")}
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
