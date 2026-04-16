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
import { asFiniteInt, type ProductDbRow } from "@/lib/product-supabase";
import { formatKRW } from "@/lib/products";
import { createServerSupabaseClient } from "@/lib/supabase";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHome = await getTranslations("Home");
  const appLocale = await getLocale();
  
  const supabase = await createServerSupabaseClient();
  const { data: dbProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  type ProductWithId = ProductDbRow & { id: string };
  const products: ProductWithId[] = (dbProducts ?? []).filter(
    (row): row is ProductWithId =>
      typeof row.id === "string" && row.id.length > 0,
  );

  const destinationCatalog = products.map((p) => ({
    id: p.id,
    label: p.title || "Travel Destination",
    src: p.youtube_url || "",
    tint: "bg-blue-900/40",
  }));

  const showcaseItems = products.map((p) => ({
    id: p.id,
    messageKey: p.id,
    formattedPrice: formatKRW(asFiniteInt(p.price_krw) ?? 0, appLocale),
    durationDays: asFiniteInt(p.duration_days) ?? 0,
    heroImage: "/images/hero-default.jpg",
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