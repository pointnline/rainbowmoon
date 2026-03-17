"use client";

import { useState, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import type { PageId } from "@/types";

interface NavBarProps {
  page: PageId;
  setPage: (p: PageId) => void;
}

const MoonPhase = ({ phase, size = 18, color }: { phase: number; size?: number; color: string }) => {
  const dx = [8, 5, 2.5, -1, -5, -99][phase];
  const mid = useRef(`mp${phase}_${Math.random().toString(36).slice(2, 7)}`).current;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <defs>
        <mask id={mid}>
          <circle cx="10" cy="10" r="8" fill="white" />
          {phase < 5 && <circle cx={10 + dx} cy="10" r="8" fill="black" />}
        </mask>
      </defs>
      <circle cx="10" cy="10" r="8" fill={color} mask={`url(#${mid})`} />
      <circle cx="10" cy="10" r="8" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
};

const navItems: { id: PageId; label: string; phase: number; moonIdx: number }[] = [
  { id: "dashboard", label: "Home", phase: 0, moonIdx: 6 },
  { id: "vision", label: "Vision", phase: 1, moonIdx: 0 },
  { id: "mandalart", label: "Mandal", phase: 2, moonIdx: 1 },
  { id: "goals", label: "Goals", phase: 3, moonIdx: 4 },
  { id: "habits", label: "Habits", phase: 4, moonIdx: 3 },
  { id: "journal", label: "Journal", phase: 5, moonIdx: 5 },
];

export function NavBar({ page, setPage }: NavBarProps) {
  const { theme, isDark, moons } = useTheme();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const initial = user ? user.name.charAt(0).toUpperCase() : "?";

  const rainbow = `conic-gradient(from 0deg, ${moons[0].color}, ${moons[1].color}, ${moons[2].color}, ${moons[3].color}, ${moons[4].color}, ${moons[5].color}, ${moons[6].color}, ${moons[0].color})`;

  const openChat = () => {
    window.dispatchEvent(new CustomEvent("moonchat:toggle"));
  };

  return (
    <nav style={{
      position: "fixed", left: 0, top: 0, bottom: 0, width: 80,
      background: theme.bgNav,
      borderRight: `1px solid ${theme.border}`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "20px 0", zIndex: 100,
      backdropFilter: "blur(20px)",
    }}>
      {/* P·L 로고 */}
      <div
        onClick={() => setPage("dashboard")}
        style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "linear-gradient(135deg, #6C5CE7, #E8453C)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 8, color: "#fff", fontWeight: 700, letterSpacing: 1,
          marginBottom: 16, cursor: "pointer",
          fontFamily: "'Cormorant Garamond', serif",
          boxShadow: "0 2px 12px rgba(108,92,231,0.4)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        P·L
      </div>

      <ThemeToggle />

      {/* 구분선 */}
      <div style={{ width: 32, height: 1, background: theme.border, margin: "12px 0" }} />

      {/* 네비게이션 아이템 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = page === item.id;
          const moonColor = moons[item.moonIdx]?.color || theme.accent;
          const isHovered = hoveredItem === item.id;

          return (
            <div key={item.id} style={{ position: "relative" }}>
              {/* 활성 상태 좌측 액센트 바 */}
              {isActive && (
                <div style={{
                  position: "absolute", left: -1, top: "50%",
                  transform: "translateY(-50%)",
                  width: 3, height: 28, borderRadius: "0 3px 3px 0",
                  background: moonColor,
                  boxShadow: `0 0 8px ${moonColor}60`,
                }} />
              )}
              <button
                onClick={() => setPage(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                title={item.label}
                style={{
                  background: isActive
                    ? `${moonColor}15`
                    : isHovered ? `${moonColor}08` : "transparent",
                  border: "none",
                  borderRadius: 12,
                  width: 56, height: 52,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  cursor: "pointer", gap: 3,
                  color: isActive ? moonColor : isHovered ? theme.textSecondary : theme.textMuted,
                  transition: "all 0.2s",
                }}
              >
                <MoonPhase
                  phase={item.phase}
                  size={17}
                  color={isActive ? moonColor : isHovered ? theme.textSecondary : theme.textMuted}
                />
                <span style={{ fontSize: 7.5, letterSpacing: 0.4, fontFamily: "'DM Sans', sans-serif", fontWeight: isActive ? 600 : 400 }}>
                  {item.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 구분선 */}
      <div style={{ width: 32, height: 1, background: theme.border, margin: "8px 0" }} />

      {/* Moon AI 챗봇 버튼 */}
      <button
        onClick={openChat}
        title="Moon AI"
        style={{
          width: 40, height: 40, borderRadius: "50%",
          background: rainbow,
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          marginBottom: 12,
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.4)";
        }}
      >
        ✦
      </button>

      {/* 사용자 아바타 */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            width: 34, height: 34, borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.accent}40, ${theme.accentSecondary}30)`,
            border: `1.5px solid ${theme.accent}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: theme.text, fontWeight: 600,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = theme.accent)}
          onMouseLeave={(e) => { if (!showMenu) e.currentTarget.style.borderColor = `${theme.accent}50`; }}
        >
          {initial}
        </button>

        {showMenu && (
          <div style={{
            position: "absolute", bottom: "calc(100% + 12px)", left: "calc(100% + 12px)",
            background: isDark ? "rgba(20,20,30,0.97)" : "rgba(255,255,255,0.97)",
            border: `1px solid ${theme.border}`,
            borderRadius: 16, padding: "20px", backdropFilter: "blur(20px)",
            minWidth: 220, animation: "fadeSlideUp 0.2s ease both",
            boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.1)",
            zIndex: 200,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${theme.border}` }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: `linear-gradient(135deg, ${theme.accent}40, ${theme.accentSecondary}30)`,
                border: `1.5px solid ${theme.accent}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: theme.text, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
              }}>{initial}</div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: theme.text, margin: 0 }}>{user?.name}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: theme.textMuted, margin: "2px 0 0" }}>{user?.email}</p>
              </div>
            </div>

            {user?.provider === "google" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "6px 0" }}>
                <GoogleIcon size={14} />
                <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Google 계정으로 연결됨</span>
              </div>
            )}

            <button
              onClick={() => { logout(); setShowMenu(false); }}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
                background: isDark ? "rgba(232,69,60,0.1)" : "rgba(232,69,60,0.06)",
                color: "#E8453C", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer", transition: "all 0.2s", textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? "rgba(232,69,60,0.18)" : "rgba(232,69,60,0.12)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = isDark ? "rgba(232,69,60,0.1)" : "rgba(232,69,60,0.06)")}
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
