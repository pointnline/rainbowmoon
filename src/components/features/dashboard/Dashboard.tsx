"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { MoonOrbit } from "@/components/ui/MoonOrbit";
import type { PageId } from "@/types";

// ─── 시간대별 인사말 ───
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Good Night 🌙";
  if (h < 8) return "Good Dawn 🌅";
  if (h < 12) return "Good Morning ☀️";
  if (h < 14) return "Good Afternoon 🌤";
  if (h < 17) return "Good Afternoon 🌤";
  if (h < 20) return "Good Evening 🌇";
  return "Good Night 🌙";
}

// ─── 철학 공개 애니메이션 서브컴포넌트 ───
function PhilosophyReveal({ theme }: { theme: ReturnType<typeof useTheme>["theme"] }) {
  const [revealIndex, setRevealIndex] = useState(-1);

  const steps = [
    { char: "점", meaning: "선택", icon: "·" },
    { char: "선", meaning: "실행", icon: "━" },
    { char: "면", meaning: "결과", icon: "◇" },
    { char: "원", meaning: "순환", icon: "○" },
  ];

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setRevealIndex(i), 600 + i * 400)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      display: "flex", gap: 24, justifyContent: "center",
      padding: "20px 0", flexWrap: "wrap",
    }}>
      {steps.map((step, i) => (
        <div key={step.char} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          opacity: i <= revealIndex ? 1 : 0,
          transform: i <= revealIndex ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          <span style={{
            fontSize: 28, color: theme.text, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300, letterSpacing: "0.05em",
          }}>
            {step.icon}
          </span>
          <span style={{
            fontSize: 16, color: theme.text, fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
          }}>
            {step.char}
          </span>
          <span style={{
            fontSize: 11, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.1em",
          }}>
            {step.meaning}
          </span>
          {i < steps.length - 1 && i <= revealIndex && (
            <span style={{
              position: "absolute", right: -16, top: "50%",
              transform: "translateY(-50%)",
              color: theme.textFaint, fontSize: 10,
            }}>
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Quotes ───
const QUOTES = [
  { text: "결국 인생은 하나의 점에서 시작된다." },
  { text: "점은 선택이고, 선은 실행이다." },
  { text: "선은 배신하지 않는다." },
  { text: "작은 점이 인생을 확장시킨다." },
  { text: "Create a Good Life by Point & Line." },
];

// ─── Quick Links ───
const QUICK_LINKS: { label: string; desc: string; page: PageId; icon: string; ml: string }[] = [
  { label: "Mandalart", desc: "아이디어를 9×9로 확장", page: "mandalart", icon: "✦", ml: "Orange Moon" },
  { label: "Goal Map", desc: "목표→세부목표→액션", page: "goals", icon: "◈", ml: "Blue Moon" },
  { label: "Habit Line", desc: "점이 선이 되는 습관", page: "habits", icon: "━", ml: "Green Moon" },
  { label: "Journal", desc: "오늘의 점을 기록", page: "journal", icon: "◇", ml: "Indigo Moon" },
  { label: "Vision Board", desc: "비전과 실행의 연결", page: "vision", icon: "☾", ml: "Violet Moon" },
];

// ─── Stats ───
const STATS = [
  { label: "활성 목표", value: "3", unit: "goals", icon: "◎" },
  { label: "습관 달성", value: "5/7", unit: "", icon: "━" },
  { label: "연속 기록", value: "12", unit: "days", icon: "◆" },
  { label: "저널 엔트리", value: "48", unit: "total", icon: "◇" },
];

// ─── Dashboard 메인 컴포넌트 ───
interface DashboardProps {
  setPage: (p: PageId) => void;
}

export function Dashboard({ setPage }: DashboardProps) {
  const { theme, moons } = useTheme();
  const { user } = useAuth();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [hoveredMoon, setHoveredMoon] = useState<string | null>(null);
  const [barHeights] = useState(() =>
    Array.from({ length: 30 }, (_, i) => 15 + Math.sin(i * 0.4) * 20 + Math.random() * 25)
  );

  // 6초마다 quote 순환
  useEffect(() => {
    const id = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const greeting = getGreeting();
  const displayName = user?.name ?? "Explorer";

  return (
    <div style={{
      maxWidth: 800, margin: "0 auto", padding: "40px 20px 80px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* ── Hero Section ── */}
      <section style={{ textAlign: "center", marginBottom: 56 }}>
        <p style={{
          fontSize: 13, color: theme.textMuted, letterSpacing: "0.15em",
          textTransform: "uppercase", marginBottom: 8,
        }}>
          {greeting}
        </p>
        <h1 style={{
          fontSize: 36, fontWeight: 200, color: theme.text,
          letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 8,
        }}>
          {displayName}
        </h1>
        <div style={{ minHeight: 48, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <p style={{
            fontSize: 15, color: theme.textSecondary, fontWeight: 300,
            fontStyle: "italic", transition: "opacity 0.6s ease",
            letterSpacing: "0.02em",
          }}>
            &ldquo;{QUOTES[quoteIndex].text}&rdquo;
          </p>
          {/* Quote indicators */}
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            {QUOTES.map((_, i) => (
              <div key={i} style={{
                width: i === quoteIndex ? 16 : 4,
                height: 4,
                borderRadius: 2,
                background: i === quoteIndex ? theme.accent : theme.textFaint,
                transition: "all 0.4s ease",
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy Reveal ── */}
      <section style={{ marginBottom: 56 }}>
        <PhilosophyReveal theme={theme} />
      </section>

      {/* ── Moon Orbit ── */}
      <section style={{
        display: "flex", justifyContent: "center", marginBottom: 56,
      }}>
        <MoonOrbit hoveredMoon={hoveredMoon} setHoveredMoon={setHoveredMoon} />
      </section>

      {/* ── Stats Grid ── */}
      <section style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12,
        marginBottom: 56,
      }}>
        {STATS.map((stat) => (
          <div key={stat.label} style={{
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 12, padding: "20px 16px",
            textAlign: "center", transition: "all 0.3s ease",
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = theme.bgCardHover;
              (e.currentTarget as HTMLDivElement).style.borderColor = theme.borderHover;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = theme.bgCard;
              (e.currentTarget as HTMLDivElement).style.borderColor = theme.border;
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 8, opacity: 0.6 }}>{stat.icon}</div>
            <div style={{
              fontSize: 24, fontWeight: 300, color: theme.text, letterSpacing: "-0.02em",
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: 10, color: theme.textMuted, letterSpacing: "0.1em",
              textTransform: "uppercase", marginTop: 4,
            }}>
              {stat.label}
            </div>
            {stat.unit && (
              <div style={{
                fontSize: 9, color: theme.textFaint, marginTop: 2,
              }}>
                {stat.unit}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ── Life Graph ── */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{
          fontSize: 11, color: theme.textMuted, letterSpacing: "0.15em",
          textTransform: "uppercase", marginBottom: 16,
          textAlign: "center",
        }}>
          Life Graph
        </h2>
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          gap: 3, height: 80, padding: "0 20px",
        }}>
          {barHeights.map((h, i) => {
            const isWeekend = i % 7 === 5 || i % 7 === 6;
            return (
              <div key={i} style={{
                width: "100%", maxWidth: 18,
                height: `${h}%`,
                borderRadius: "3px 3px 0 0",
                background: isWeekend ? theme.barWeekend(i) : theme.barDefault(i),
                transition: "height 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }} />
            );
          })}
        </div>
      </section>

      {/* ── Quick Links ── */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{
          fontSize: 11, color: theme.textMuted, letterSpacing: "0.15em",
          textTransform: "uppercase", marginBottom: 16,
          textAlign: "center",
        }}>
          Quick Links
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
        }}>
          {QUICK_LINKS.map((link) => (
            <div key={link.label}
              onClick={() => setPage(link.page)}
              style={{
                background: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: 12, padding: "20px 16px",
                cursor: "pointer", textAlign: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = theme.bgCardHover;
                (e.currentTarget as HTMLDivElement).style.borderColor = theme.borderHover;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = theme.bgCard;
                (e.currentTarget as HTMLDivElement).style.borderColor = theme.border;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{
                fontSize: 22, marginBottom: 8, opacity: 0.7, color: theme.text,
              }}>
                {link.icon}
              </div>
              <div style={{
                fontSize: 13, fontWeight: 500, color: theme.text,
                marginBottom: 4,
              }}>
                {link.label}
              </div>
              <div style={{
                fontSize: 11, color: theme.textMuted, lineHeight: 1.4,
              }}>
                {link.desc}
              </div>
              <div style={{
                fontSize: 9, color: theme.textFaint, marginTop: 8,
                letterSpacing: "0.08em",
              }}>
                {link.ml}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rainbow Moon Grid ── */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{
          fontSize: 11, color: theme.textMuted, letterSpacing: "0.15em",
          textTransform: "uppercase", marginBottom: 16,
          textAlign: "center",
        }}>
          Rainbow Moon
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
          gap: 10,
        }}>
          {moons.map((moon) => {
            const isHovered = hoveredMoon === moon.id;
            return (
              <div key={moon.id}
                onMouseEnter={() => setHoveredMoon(moon.id)}
                onMouseLeave={() => setHoveredMoon(null)}
                style={{
                  background: `${moon.color}${theme.moonBgAlpha}`,
                  border: `1px solid ${moon.color}${theme.moonBorderAlpha}`,
                  borderRadius: 12, padding: "16px 10px",
                  textAlign: "center", cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: isHovered ? "translateY(-3px) scale(1.04)" : "translateY(0) scale(1)",
                  boxShadow: isHovered ? `0 8px 24px ${moon.color}20` : "none",
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", margin: "0 auto 8px",
                  background: `radial-gradient(circle at 35% 30%, ${moon.color}, ${moon.color}80)`,
                  boxShadow: `0 0 ${isHovered ? 16 : 6}px ${moon.color}${isHovered ? "40" : "20"}`,
                  transition: "box-shadow 0.3s ease",
                }} />
                <div style={{
                  fontSize: 11, fontWeight: 600, color: moon.color,
                  marginBottom: 2,
                }}>
                  {moon.label}
                </div>
                <div style={{
                  fontSize: 9, color: theme.textMuted, lineHeight: 1.3,
                }}>
                  {moon.meaning}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: "center", paddingTop: 32,
        borderTop: `1px solid ${theme.border}`,
      }}>
        <p style={{
          fontSize: 11, color: theme.textFaint, letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}>
          Point &amp; Line
        </p>
        <p style={{
          fontSize: 10, color: theme.textUltraFaint, marginTop: 4,
          letterSpacing: "0.1em",
        }}>
          Connect · Amplify · Elevate
        </p>
      </footer>
    </div>
  );
}
