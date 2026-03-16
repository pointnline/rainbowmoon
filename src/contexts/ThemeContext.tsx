"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { THEMES, MOON_COLORS } from "@/constants/themes";
import type { Theme, MoonColor } from "@/types";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  moons: MoonColor[];
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const theme = THEMES[isDark ? "dark" : "light"];
  const moons = MOON_COLORS[isDark ? "dark" : "light"];

  // 다크모드 설정 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rm_theme");
      if (saved !== null) setIsDark(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleTheme = () =>
    setIsDark((d) => {
      const next = !d;
      try { localStorage.setItem("rm_theme", JSON.stringify(next)); } catch {}
      return next;
    });

  return (
    <ThemeContext.Provider value={{ theme, isDark, moons, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
