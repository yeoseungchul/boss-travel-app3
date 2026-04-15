"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";

export type BossTheme = "dark" | "light";

const STORAGE_KEY = "boss-travel-theme";

type Ctx = {
  theme: BossTheme;
  setTheme: (t: BossTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<Ctx | null>(null);

function readStoredTheme(): BossTheme {
  if (typeof window === "undefined") return "dark";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<BossTheme>("dark");

  useLayoutEffect(() => {
    const d = document.documentElement.dataset.theme;
    if (d === "light" || d === "dark") {
      setThemeState(d);
      return;
    }
    setThemeState(readStoredTheme());
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const setTheme = useCallback((t: BossTheme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState((p) => (p === "dark" ? "light" : "dark")), []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useBossTheme() {
  const v = useContext(ThemeContext);
  if (!v) throw new Error("useBossTheme must be used within ThemeProvider");
  return v;
}
