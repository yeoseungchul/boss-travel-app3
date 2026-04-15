import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { AiHandoffBadge } from "@/components/AiHandoffBadge";
import { HomeConsultationCta } from "@/components/home/HomeConsultationCta";
import { HomeDestinations } from "@/components/home/HomeDestinations";
import { HomeInsuranceTeaser } from "@/components/home/HomeInsuranceTeaser";
import { RealTimeInfoCards } from "@/components/home/RealTimeInfoCards";
import { HomeProductShowcase } from "@/components/home/HomeProductShowcase";
import { HomeYoutubeStrip } from "@/components/home/HomeYoutubeStrip";
import { HomeSosBar } from "@/components/HomeSosBar";
import { HomeShortFormReels } from "@/components/home/HomeShortFormReels";
import { defaultShortFormReelsFromProducts } from "@/lib/short-form-clips";
import { PRODUCTS, formatKRW } from "@/lib/products";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHome = await getTranslations("Home");
  const tProducts = await getTranslations("Products");
  const appLocale = await getLocale();

  const destinationCatalog = PRODUCTS.map((p) => ({
    id: p.id,
    label: tProducts(`${p.messageKey}.name`),
    src: p.videoSrc,
    tint: p.videoTint,
  }));

  const showcaseItems = PRODUCTS.map((p) => ({
    id: p.id,
    messageKey: p.messageKey,
    formattedPrice: formatKRW(p.priceKRW, appLocale),
    durationDays: p.durationDays,
    heroImage: p.heroImage,
  }));

  const reelClips = defaultShortFormReelsFromProducts((krw) => formatKRW(krw, appLocale));

  return (
    <main className="flex flex-col gap-10 pb-2" suppressHydrationWarning>
      <AiHandoffBadge />

      <HomeShortFormReels clips={[...reelClips]} />

      <RealTimeInfoCards />

      <HomeDestinations catalog={destinationCatalog} />

      <HomeYoutubeStrip />

      <HomeProductShowcase items={showcaseItems} daysUnit={tHome("daysUnit")} />

      <HomeConsultationCta />
      <HomeInsuranceTeaser />

      <HomeSosBar />
    </main>
  );
}
