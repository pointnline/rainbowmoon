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

// 달의 위상(Moon Phase) SVG — mask 기반 초승달 렌더링
const MoonPhase = ({
  phase,
  size = 18,
  color,
}: {
  phase: number;
  size?: number;
  color: string;
}) => {
  const dx = [8, 5, 2.5, -1, -5, -99][phase];
  const mid = useRef(
    `mp${phase}_${Math.random().toString(36).slice(2, 7)}`
  ).current;

  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <defs>
        <mask id={mid}>
          <circle cx="10" cy="10" r="8" fill="white" />
          {phase < 5 && (
            <circle cx={10 + dx} cy="10" r="8" fill="black" />
          )}
        </mask>
      </defs>
      <circle
        cx="10"
        cy="10"
        r="8"
        fill={color}
        mask={`url(#${mid})`}
      />
      <circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.3"
      />
    </svg>
  );
};

const navItems: { id: PageId; label: string; phase: number }[] = [
  { id: "dashboard", label: "Dashboard", phase: 0 },
  { id: "vision", label: "Vision", phase: 1 },
  { id: "mandalart", label: "Mandalart", phase: 2 },
  { id: "goals", label: "Goals", phase: 3 },
  { id: "habits", label: "Habits", phase: 4 },
  { id: "journal", label: "Journal", phase: 5 },
];

export function NavBar({ page, setPage }: NavBarProps) {
  const { theme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const initial = user ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: 72,
        background: theme.bgNav,
        borderRight: `1px solid ${theme.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 0",
        zIndex: 100,
        backdropFilter: "blur(20px)",
        transition: "all 0.5s",
      }}
    >
      {/* P·L 로고 — 클릭 시 대시보드로 이동 */}
      <div
        onClick={() => setPage("dashboard")}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6C5CE7, #E8453C)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 8,
          color: "#fff",
          fontWeight: 700,
          letterSpacing: 1,
          marginBottom: 24,
          cursor: "pointer",
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        P·L
      </div>

      <ThemeToggle />

      {/* 네비게이션 아이템 목록 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          flex: 1,
          marginTop: 20,
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              background:
                page === item.id
                  ? isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(26,26,46,0.06)"
                  : "transparent",
              border: "none",
              borderRadius: 12,
              width: 48,
              height: 48,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              gap: 2,
              color:
                page === item.id ? theme.text : theme.textMuted,
            }}
          >
            <MoonPhase
              phase={item.phase}
              size={18}
              color={
                page === item.id ? theme.text : theme.textMuted
              }
            />
            <span
              style={{
                fontSize: 8,
                letterSpacing: 0.5,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* 사용자 아바타 + 드롭다운 메뉴 */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.accent}40, ${theme.accentSecondary}30)`,
            border: `1.5px solid ${theme.accent}50`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            color: theme.text,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = theme.accent)
          }
          onMouseLeave={(e) => {
            if (!showMenu)
              e.currentTarget.style.borderColor = `${theme.accent}50`;
          }}
        >
          {initial}
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 12px)",
              left: "calc(100% + 12px)",
              background: isDark
                ? "rgba(20,20,30,0.95)"
                : "rgba(255,255,255,0.97)",
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
              padding: "20px",
              backdropFilter: "blur(20px)",
              minWidth: 220,
              animation: "fadeSlideUp 0.2s ease both",
              boxShadow: isDark
                ? "0 8px 32px rgba(0,0,0,0.4)"
                : "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            {/* 사용자 정보 헤더 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
                paddingBottom: 16,
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.accent}40, ${theme.accentSecondary}30)`,
                  border: `1.5px solid ${theme.accent}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  color: theme.text,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {initial}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: theme.text,
                    margin: 0,
                  }}
                >
                  {user?.name}
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    color: theme.textMuted,
                    margin: "2px 0 0",
                  }}
                >
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Google 계정 연결 표시 */}
            {user?.provider === "google" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                  padding: "6px 0",
                }}
              >
                <GoogleIcon size={14} />
                <span
                  style={{
                    fontSize: 11,
                    color: theme.textMuted,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Google 계정으로 연결됨
                </span>
              </div>
            )}

            {/* 로그아웃 버튼 */}
            <button
              onClick={() => {
                logout();
                setShowMenu(false);
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: isDark
                  ? "rgba(232,69,60,0.1)"
                  : "rgba(232,69,60,0.06)",
                color: "#E8453C",
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = isDark
                  ? "rgba(232,69,60,0.15)"
                  : "rgba(232,69,60,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = isDark
                  ? "rgba(232,69,60,0.1)"
                  : "rgba(232,69,60,0.06)")
              }
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
