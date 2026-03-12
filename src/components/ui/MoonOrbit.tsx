"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface MoonOrbitProps {
  hoveredMoon: string | null;
  setHoveredMoon: (id: string | null) => void;
}

export function MoonOrbit({ hoveredMoon, setHoveredMoon }: MoonOrbitProps) {
  const { theme, isDark, moons } = useTheme();
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRotation((r) => r + 0.15), 30);
    return () => clearInterval(id);
  }, []);

  const radius = 130;

  return (
    <div style={{ position: "relative", width: 320, height: 320, flexShrink: 0 }}>
      {[0.6, 0.78, 1].map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: "50%", top: "50%",
          width: radius * 2 * s, height: radius * 2 * s, borderRadius: "50%",
          border: `1px solid ${theme.orbitRing(i)}`,
          transform: "translate(-50%, -50%)",
        }} />
      ))}

      {/* 중앙 */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
        width: 56, height: 56, borderRadius: "50%",
        background: isDark
          ? "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.12), rgba(255,255,255,0.02))"
          : "radial-gradient(circle at 40% 35%, rgba(26,26,46,0.08), rgba(26,26,46,0.02))",
        border: `1px solid ${theme.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 60px ${theme.centerGlow}`,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.text, opacity: isDark ? 0.8 : 0.5 }} />
      </div>

      {/* 7 Moons */}
      {moons.map((moon, i) => {
        const angle = (rotation + (i * 360) / 7) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const h = hoveredMoon === moon.id;
        return (
          <div key={moon.id}
            onMouseEnter={() => setHoveredMoon(moon.id)}
            onMouseLeave={() => setHoveredMoon(null)}
            style={{
              position: "absolute", left: "50%", top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              cursor: "pointer", zIndex: h ? 10 : 1,
            }}
          >
            <div style={{
              position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
              width: h ? 60 : 36, height: h ? 60 : 36, borderRadius: "50%",
              background: `radial-gradient(circle, ${moon.color}${h ? "30" : "12"}, transparent)`,
              transition: "all 0.4s", filter: "blur(8px)",
            }} />
            <div style={{
              position: "relative",
              width: h ? 28 : 18, height: h ? 28 : 18, borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, ${moon.color}, ${moon.color}80)`,
              boxShadow: `0 0 ${h ? 20 : 8}px ${moon.color}${h ? "50" : "25"}`,
              transition: "all 0.4s",
            }} />
            {h && (
              <div style={{
                position: "absolute", top: "calc(100% + 10px)", left: "50%",
                transform: "translateX(-50%)", whiteSpace: "nowrap", textAlign: "center",
                animation: "fadeSlideUp 0.2s ease both",
              }}>
                <div style={{ fontSize: 11, color: moon.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{moon.label}</div>
                <div style={{ fontSize: 9, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{moon.meaning}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
