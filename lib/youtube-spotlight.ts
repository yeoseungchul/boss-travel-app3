import type { HomeRegionId } from "@/lib/regions";

/**
 * Curated YouTube ids per region (2–3 cards).
 * Replace with YouTube Data API v3 (server) when ready.
 */
export type YoutubeSpotlightItem = {
  youtubeVideoId: string;
  titleKey: "ytCard1Title" | "ytCard2Title" | "ytCard3Title";
};

export const YOUTUBE_BY_REGION: Record<HomeRegionId, YoutubeSpotlightItem[]> = {
  macau: [
    { youtubeVideoId: "YE7VzlLtp-4", titleKey: "ytCard1Title" },
    { youtubeVideoId: "M7FIvfx5J10", titleKey: "ytCard2Title" },
    { youtubeVideoId: "WELTXylsnwE", titleKey: "ytCard3Title" },
  ],
  shanghai: [
    { youtubeVideoId: "LXb3EKWsInQ", titleKey: "ytCard1Title" },
    { youtubeVideoId: "1La4QzGeaaQ", titleKey: "ytCard2Title" },
    { youtubeVideoId: "rYOz9QnCREY", titleKey: "ytCard3Title" },
  ],
  combo: [
    { youtubeVideoId: "YE7VzlLtp-4", titleKey: "ytCard1Title" },
    { youtubeVideoId: "LXb3EKWsInQ", titleKey: "ytCard2Title" },
    { youtubeVideoId: "M7FIvfx5J10", titleKey: "ytCard3Title" },
  ],
};

export function youtubeThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
