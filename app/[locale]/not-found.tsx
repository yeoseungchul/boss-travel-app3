import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("ProductDetail");
  const tNav = await getTranslations("Nav");

  return (
    <div className="flex flex-col items-center gap-8 py-16">
      <p className="text-center text-lg leading-relaxed text-white/75">{t("notFound")}</p>
      <Link
        href="/"
        className="flex min-h-14 min-w-[10rem] items-center justify-center rounded-2xl bg-boss-accent px-8 text-base font-semibold text-navy-950"
      >
        {tNav("home")}
      </Link>
    </div>
  );
}
