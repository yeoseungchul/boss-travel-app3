import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl.replace(/\/+$/, "");
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    entries.push({
      url: `${base}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    });

    entries.push({
      url: `${base}/${locale}/product`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    entries.push({
      url: `${base}/${locale}/inquiry`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });

    entries.push({
      url: `${base}/${locale}/sos`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    });

    for (const p of PRODUCTS) {
      entries.push({
        url: `${base}/${locale}/product/${encodeURIComponent(p.id)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.85,
      });
    }
  }

  return entries;
}

