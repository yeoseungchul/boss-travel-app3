import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PRODUCTS, formatKRW } from "@/lib/products";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProductCatalogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ProductCatalog");
  const tProducts = await getTranslations("Products");
  const tHome = await getTranslations("Home");
  const appLocale = await getLocale();

  return (
    <main className="flex flex-col gap-6" suppressHydrationWarning>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">{t("title")}</h1>
        <p className="mt-2 text-base text-white/65">{t("subtitle")}</p>
      </div>
      <ul className="flex flex-col gap-4">
        {PRODUCTS.map((p) => (
          <li key={p.id}>
            <Link
              href={`/product/${p.id}`}
              className="flex min-h-[5.5rem] flex-col justify-center gap-2 rounded-[1.25rem] border border-white/[0.08] bg-navy-800/60 px-5 py-5 transition active:scale-[0.99] hover:border-boss-accent/40"
            >
              <span className="text-lg font-semibold text-white">{tProducts(`${p.messageKey}.name`)}</span>
              <span className="text-sm text-white/55">{tProducts(`${p.messageKey}.tagline`)}</span>
              <span className="text-base font-medium text-boss-accent">
                {formatKRW(p.priceKRW, appLocale)} · {p.durationDays}
                {tHome("daysUnit")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
