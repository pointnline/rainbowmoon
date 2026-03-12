"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Light Mode" : "Dark Mode"}
      style={{
        width: 40, height: 40, borderRadius: 12, border: "none",
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(26,26,46,0.06)",
        cursor: "pointer", transition: "all 0.4s",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(255,255,255,0.12)" : "rgba(26,26,46,0.1)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(26,26,46,0.06)"; }}
    >
      <span style={{ transition: "all 0.4s", transform: isDark ? "rotate(0deg)" : "rotate(180deg)", display: "block" }}>
        {isDark ? "☀" : "☾"}
      </span>
    </button>
  );
}
