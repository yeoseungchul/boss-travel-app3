import type { HomeRegionId } from "@/lib/regions";

/** Mock weather codes — map to Lucide + i18n in the UI. */
export type WeatherConditionCode = "clear" | "partly_cloudy" | "rain";

export type MockWeather = {
  tempC: number;
  code: WeatherConditionCode;
  humidityPct: number;
};

export type MockFx = {
  /** Display currency for the region (MOP Macau, CNY Shanghai/combo ref). */
  quoteCode: "MOP" | "CNY";
  /** KRW received for 1 unit of quote currency (indicative). */
  krwPerUnit: number;
  /** Daily change % for trend chip (+ up, − down). */
  trendPct: number;
};

export type RealtimeMockSnapshot = {
  weather: MockWeather;
  fx: MockFx;
};

const MOCK_TABLE: Record<HomeRegionId, RealtimeMockSnapshot> = {
  macau: {
    weather: { tempC: 27, code: "clear", humidityPct: 62 },
    fx: { quoteCode: "MOP", krwPerUnit: 186.42, trendPct: 0.28 },
  },
  shanghai: {
    weather: { tempC: 19, code: "partly_cloudy", humidityPct: 71 },
    fx: { quoteCode: "CNY", krwPerUnit: 198.35, trendPct: -0.51 },
  },
  combo: {
    weather: { tempC: 23, code: "clear", humidityPct: 65 },
    fx: { quoteCode: "CNY", krwPerUnit: 198.12, trendPct: 0.19 },
  },
};

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock “live” snapshot — swap for Open-Meteo / Frankfurter / etc. later.
 * Small delay simulates network so loading states can be tested if needed.
 */
export async function fetchRealtimeMockSnapshot(region: HomeRegionId): Promise<RealtimeMockSnapshot> {
  await delay(100);
  return MOCK_TABLE[region];
}
