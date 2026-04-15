import { getTranslations, setRequestLocale } from "next-intl/server";
import { InquiryForm } from "./InquiryForm";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function InquiryPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Inquiry");
  const sp = (await searchParams) ?? {};
  const product = Array.isArray(sp.product) ? sp.product[0] : sp.product;
  const intent = Array.isArray(sp.intent) ? sp.intent[0] : sp.intent;
  const prefillDepositIntent = intent === "deposit";

  return (
    <main className="flex flex-col gap-6" suppressHydrationWarning>
      <div>
        <h1 className="text-2xl font-semibold text-white">{t("title")}</h1>
        <p className="mt-2 text-base leading-relaxed text-white/65">{t("subtitle")}</p>
      </div>
      <InquiryForm
        preselectedProductId={typeof product === "string" ? product : ""}
        prefillDepositIntent={prefillDepositIntent}
      />
    </main>
  );
}
