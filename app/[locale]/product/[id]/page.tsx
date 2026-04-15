import { getLocale, getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  asFiniteInt,
  getCachedProductRow,
  parseItineraryFromDb,
  parseStringArray,
} from "@/lib/product-supabase";
import { PRODUCTS, formatKRW, getProduct } from "@/lib/products";
import { routing } from "@/i18n/routing";
import { ProductDetailClient } from "./ProductDetailClient";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => PRODUCTS.map((p) => ({ locale, id: p.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const product = getProduct(id);
  if (!product) {
    return { title: "Seojin Travel (SEOJIN)" };
  }
  const row = await getCachedProductRow(product.id);
  const ctaByLocale: Record<string, string> = {
    ko: "전담 컨시어지 상담 예약",
    en: "Reserve a concierge consult",
    zh: "预约专属顾问咨询",
  };
  const cta = ctaByLocale[locale] ?? ctaByLocale.en;
  const t = await getTranslations({ locale, namespace: "Products" });
  const titleBase =
    locale === "ko" && row?.title?.trim() ? row.title.trim() : t(`${product.messageKey}.name`);
  const tagline =
    locale === "ko" && row?.subtitle?.trim()
      ? row.subtitle.trim()
      : t(`${product.messageKey}.tagline`);
  const messages = (await getMessages()) as { Itinerary?: Record<string, string[]> };
  const itineraryDb = parseItineraryFromDb(row?.itinerary);
  const itineraryMsg = messages.Itinerary?.[product.messageKey] ?? [];
  const itinerary = itineraryDb.length > 0 ? itineraryDb : itineraryMsg;
  const dbDesc = row?.description?.trim() ?? "";
  const raw = dbDesc
    ? dbDesc.length > 150
      ? dbDesc.slice(0, 150).trimEnd()
      : dbDesc
    : [tagline, ...itinerary].filter(Boolean).join(" ");
  const description = `${raw} · ${cta}`;
  const gi = parseStringArray(row?.gallery_images);
  const shareImage = gi[0] || product.gallery_images?.[0] || product.heroImage || "/master-logo.png";
  const fullTitle = `${titleBase} | Seojin Travel`;
  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      siteName: "Seojin Travel",
      images: [{ url: shareImage, width: 1200, height: 630, alt: titleBase }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [shareImage],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const product = getProduct(id);
  if (!product) {
    notFound();
  }

  const messages = (await getMessages()) as { Itinerary?: Record<string, string[]> };
  const row = await getCachedProductRow(product.id);
  const itineraryDb = parseItineraryFromDb(row?.itinerary);
  const itineraryMsg = messages.Itinerary?.[product.messageKey] ?? [];
  const itinerary = itineraryDb.length > 0 ? itineraryDb : itineraryMsg;
  const inclusions = parseStringArray(row?.inclusions);
  const exclusions = parseStringArray(row?.exclusions);

  const t = await getTranslations("ProductDetail");
  const tProducts = await getTranslations("Products");
  const appLocale = await getLocale();
  const priceKrw = asFiniteInt(row?.price_krw) ?? product.priceKRW;
  const durationDays = asFiniteInt(row?.duration_days) ?? product.durationDays;
  const headline =
    locale === "ko" && row?.title?.trim() ? row.title.trim() : tProducts(`${product.messageKey}.name`);
  const subline =
    locale === "ko" && row?.subtitle?.trim()
      ? row.subtitle.trim()
      : tProducts(`${product.messageKey}.tagline`);
  const youtubeRaw = row?.youtube_url?.trim();
  const youtubeUrl = youtubeRaw && youtubeRaw.length > 0 ? youtubeRaw : null;

  return (
    <main className="flex flex-col gap-8" suppressHydrationWarning>
      <Link
        href="/product"
        className="inline-flex min-h-12 items-center self-start rounded-2xl border border-white/[0.1] bg-white/[0.04] px-5 text-base font-medium text-white/85 transition hover:border-boss-accent/35"
      >
        ← {t("back")}
      </Link>

      <div>
        <h1 className="text-2xl font-semibold leading-snug text-white">{headline}</h1>
        <p className="mt-2 text-base text-white/60">{subline}</p>
        {durationDays > 0 ? (
          <p className="mt-2 text-sm text-white/45">{t("durationDays", { days: durationDays })}</p>
        ) : null}
      </div>

      {row?.description?.trim() ? (
        <section className="rounded-[1.25rem] border border-white/[0.08] bg-navy-800/50 p-5">
          <h2 className="text-lg font-semibold text-boss-accent">{t("overview")}</h2>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-white/70">{row.description.trim()}</p>
        </section>
      ) : null}

      <section className="rounded-[1.25rem] border border-white/[0.08] bg-navy-800/50 p-5">
        <h2 className="text-lg font-semibold text-boss-accent">{t("itinerary")}</h2>
        {itinerary.length ? (
          <ol className="mt-4 flex list-decimal flex-col gap-3 pl-5 text-base leading-relaxed text-white/80">
            {itinerary.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-base text-white/45">—</p>
        )}
      </section>

      {inclusions.length > 0 ? (
        <section className="rounded-[1.25rem] border border-emerald-400/15 bg-emerald-500/[0.06] p-5">
          <h2 className="text-lg font-semibold text-emerald-200/90">{t("inclusions")}</h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-base leading-relaxed text-white/75">
            {inclusions.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {exclusions.length > 0 ? (
        <section className="rounded-[1.25rem] border border-white/[0.08] bg-navy-800/50 p-5">
          <h2 className="text-lg font-semibold text-white/70">{t("exclusions")}</h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-base leading-relaxed text-white/55">
            {exclusions.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-[1.25rem] border border-white/[0.08] bg-navy-800/50 p-5">
        <h2 className="text-lg font-semibold text-boss-accent">{t("price")}</h2>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{formatKRW(priceKrw, appLocale)}</p>
        <p className="mt-1 text-sm text-white/55">{t("perPerson")}</p>
        <p className="mt-2 text-sm text-white/45">{t("taxNote")}</p>
      </section>

      <ProductDetailClient
        youtubeUrl={youtubeUrl}
        title={t("travelWithBossTitle")}
        subtitle={t("travelWithBossSubtitle")}
      />

      <div className="flex flex-col gap-3">
        <Link
          href={`/inquiry?product=${encodeURIComponent(product.id)}`}
          className="flex min-h-16 items-center justify-center rounded-2xl bg-boss-accent text-lg font-semibold text-navy-950 shadow-lg transition hover:brightness-110 active:scale-[0.99]"
        >
          {t("inquireCta")}
        </Link>
        <Link
          href={`/inquiry?product=${encodeURIComponent(product.id)}&intent=deposit`}
          className="flex min-h-14 items-center justify-center rounded-2xl border border-white/[0.14] bg-white/[0.04] text-base font-semibold text-white/90 transition hover:border-boss-accent/35 hover:bg-white/[0.07] active:scale-[0.99]"
        >
          {t("depositInquiryCta")}
        </Link>
        <p className="text-center text-xs leading-relaxed text-white/45">{t("depositFlowNote")}</p>
      </div>
    </main>
  );
}
