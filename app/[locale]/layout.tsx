import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { FixedBottomNav } from "@/components/FixedBottomNav";
import { ConditionalSosFab } from "@/components/ConditionalSosFab";
import { HomeRegionProvider } from "@/components/home/HomeRegionContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TopBar } from "@/components/TopBar";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Seojin Travel (SEOJIN)",
  description: "Premium mobile travel companion",
  applicationName: "Seojin Travel (SEOJIN)",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Seojin Travel (SEOJIN)",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Seojin Travel (SEOJIN)",
    description: "Premium mobile travel companion",
    type: "website",
    siteName: "Seojin Travel",
    images: [{ url: "/icons/icon-512x512.png", width: 512, height: 512, alt: "Seojin Travel (SEOJIN)" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seojin Travel (SEOJIN)",
    description: "Premium mobile travel companion",
    images: ["/icons/icon-512x512.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      translate="no"
      className={`notranslate ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground" suppressHydrationWarning>
        <Script id="boss-theme-boot" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('boss-travel-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();`}
        </Script>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <HomeRegionProvider>
            <div
              className="relative mx-auto min-h-dvh w-full max-w-md bg-gradient-to-b from-[var(--navy-950)] via-[var(--navy-900)] to-[var(--navy-950)]"
              suppressHydrationWarning
            >
              <div className="px-5 pb-[calc(6.75rem+env(safe-area-inset-bottom))] pt-6">
                <TopBar />
                {children}
              </div>
              <div className="pointer-events-none fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-5 z-[45] max-[380px]:right-3">
                <ConditionalSosFab />
              </div>
              <FixedBottomNav />
            </div>
            </HomeRegionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
