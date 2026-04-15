"use client";

import type { HomeRegionId } from "@/lib/regions";
import { DEFAULT_HOME_REGION } from "@/lib/regions";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Ctx = {
  region: HomeRegionId;
  setRegion: (r: HomeRegionId) => void;
};

const HomeRegionContext = createContext<Ctx | null>(null);

export function HomeRegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<HomeRegionId>(DEFAULT_HOME_REGION);

  const setRegion = useCallback((r: HomeRegionId) => setRegionState(r), []);

  const value = useMemo(() => ({ region, setRegion }), [region, setRegion]);

  return <HomeRegionContext.Provider value={value}>{children}</HomeRegionContext.Provider>;
}

export function useHomeRegion() {
  const v = useContext(HomeRegionContext);
  if (!v) throw new Error("useHomeRegion must be used within HomeRegionProvider");
  return v;
}
