"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function HomeInsuranceTeaser() {
  const t = useTranslations("Home");

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[1.25rem] border border-[var(--border-subtle)] bg-[var(--surface-0)] px-5 py-4"
      aria-labelledby="insurance-teaser-heading"
    >
      <h2 id="insurance-teaser-heading" className="text-sm font-semibold text-[var(--foreground)]">
        {t("insuranceTitle")}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{t("insuranceBody")}</p>
      <Link href="/inquiry" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-boss-accent underline-offset-4 hover:underline">
        {t("insuranceLink")}
      </Link>
    </motion.section>
  );
}
