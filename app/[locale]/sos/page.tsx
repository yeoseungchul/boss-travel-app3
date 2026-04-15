import { getTranslations, setRequestLocale } from "next-intl/server";
import { SosClient } from "./SosClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Sos");

  return (
    <main className="flex flex-col gap-6" suppressHydrationWarning>
      <div>
        <h1 className="text-2xl font-semibold text-white">{t("title")}</h1>
        <p className="mt-2 text-base leading-relaxed text-white/65">{t("subtitle")}</p>
      </div>
      <SosClient />
    </main>
  );
}
