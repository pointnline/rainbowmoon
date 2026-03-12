"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
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
  const toggleTheme = () => setIsDark((d) => !d);

  return (
    <ThemeContext.Provider value={{ theme, isDark, moons, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
