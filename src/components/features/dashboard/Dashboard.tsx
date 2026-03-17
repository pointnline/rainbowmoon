"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { MoonOrbit } from "@/components/ui/MoonOrbit";
import type { PageId } from "@/types";

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

const QUOTES = [
  { text: "결국 인생은 하나의 점에서 시작된다." },
  { text: "점은 선택이고, 선은 실행이다." },
  { text: "선은 배신하지 않는다." },
  { text: "작은 점이 인생을 확장시킨다." },
  { text: "Create a Good Life by Point & Line." },
];

const QUICK_LINKS: { label: string; desc: string; page: PageId; icon: string; ml: string }[] = [
  { label: "Mandalart", desc: "아이디어를 9×9로 확장", page: "mandalart", icon: "✦", ml: "Orange Moon" },
  { label: "Goal Map", desc: "목표→세부목표→액션", page: "goals", icon: "◈", ml: "Blue Moon" },
  { label: "Habit Line", desc: "점이 선이 되는 습관", page: "habits", icon: "━", ml: "Green Moon" },
  { label: "Journal", desc: "오늘의 점을 기록", page: "journal", icon: "◇", ml: "Indigo Moon" },
  { label: "Vision Board", desc: "비전과 실행의 연결", page: "vision", icon: "☾", ml: "Violet Moon" },
];

interface StatItem { label: string; value: string; unit: string; icon: string; color?: string }

function loadStats(): StatItem[] {
  try {
    // 활성 목표 수
    const goals = JSON.parse(localStorage.getItem("rm_goals") || "[]") as { title: string }[];
    const activeGoals = goals.filter((g) => g.title?.trim()).length;

    // 오늘 습관 달성
    const habits = JSON.parse(localStorage.getItem("rm_habits") || "[]") as {
      name: string; checkedDates?: Record<string, boolean>;
    }[];
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const habitsDone = habits.filter((h) => h.checkedDates?.[todayKey]).length;

    // 최대 연속 기록
    let maxStreak = 0;
    habits.forEach((h) => {
      let streak = 0;
      const d = new Date(today);
      while (true) {
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (h.checkedDates?.[key]) { streak++; d.setDate(d.getDate() - 1); }
        else break;
      }
      if (streak > maxStreak) maxStreak = streak;
    });

    // 저널 엔트리 수
    const journal = JSON.parse(localStorage.getItem("rm_journal") || "[]") as unknown[];

    return [
      { label: "활성 목표", value: String(activeGoals), unit: "goals", icon: "◎" },
      { label: "오늘 습관", value: `${habitsDone}/${habits.length}`, unit: "", icon: "━" },
      { label: "연속 기록", value: String(maxStreak), unit: "days", icon: "◆" },
      { label: "저널 엔트리", value: String(journal.length), unit: "total", icon: "◇" },
    ];
  } catch {
    return [
      { label: "활성 목표", value: "0", unit: "goals", icon: "◎" },
      { label: "오늘 습관", value: "0/0", unit: "", icon: "━" },
      { label: "연속 기록", value: "0", unit: "days", icon: "◆" },
      { label: "저널 엔트리", value: "0", unit: "total", icon: "◇" },
    ];
  }
}

function loadLifeGraph(): number[] {
  try {
    const habits = JSON.parse(localStorage.getItem("rm_habits") || "[]") as {
      checkedDates?: Record<string, boolean>;
    }[];
    if (habits.length === 0) return Array(30).fill(4);
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (29 - i));
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const done = habits.filter((h) => h.checkedDates?.[key]).length;
      return Math.max(4, Math.round((done / habits.length) * 100));
    });
  } catch {
    return Array(30).fill(4);
  }
}

interface DashboardProps { setPage: (p: PageId) => void }

export function Dashboard({ setPage }: DashboardProps) {
  const { theme, moons } = useTheme();
  const { user } = useAuth();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [hoveredMoon, setHoveredMoon] = useState<string | null>(null);
  const [stats, setStats] = useState<StatItem[]>(() => [
    { label: "활성 목표", value: "0", unit: "goals", icon: "◎" },
    { label: "오늘 습관", value: "0/0", unit: "", icon: "━" },
    { label: "연속 기록", value: "0", unit: "days", icon: "◆" },
    { label: "저널 엔트리", value: "0", unit: "total", icon: "◇" },
  ]);
  const [lifeData, setLifeData] = useState<number[]>(() => Array(30).fill(4));

  // localStorage에서 실제 데이터 로드
  useEffect(() => {
    setStats(loadStats());
    setLifeData(loadLifeGraph());
  }, []);

  // 6초마다 quote 순환
  useEffect(() => {
    const id = setInterval(() => setQuoteIndex((p) => (p + 1) % QUOTES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const greeting = getGreeting();
  const displayName = user?.name ?? "Explorer";

  return (
    <div style={{ padding: "40px 48px 80px", fontFamily: "'DM Sans', sans-serif", maxWidth: 1400 }}>

      {/* ── Hero ── */}
      <section style={{ textAlign: "center", marginBottom: 48 }}>
        <p style={{ fontSize: 13, color: theme.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>
          {greeting}
        </p>
        <h1 style={{ fontSize: 40, fontWeight: 200, color: theme.text, letterSpacing: "-0.02em", marginBottom: 8 }}>
          {displayName}
        </h1>
        <div style={{ minHeight: 52, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: 15, color: theme.textSecondary, fontWeight: 300, fontStyle: "italic", letterSpacing: "0.02em" }}>
            &ldquo;{QUOTES[quoteIndex].text}&rdquo;
          </p>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {QUOTES.map((_, i) => (
              <div key={i} style={{
                width: i === quoteIndex ? 16 : 4, height: 4, borderRadius: 2,
                background: i === quoteIndex ? theme.accent : theme.textFaint,
                transition: "all 0.4s ease",
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 2-Column Layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 32, marginBottom: 40, alignItems: "start" }}>

        {/* Left: Moon Orbit + Philosophy */}
        <div>
          <div style={{
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            borderRadius: 20, padding: "28px 20px", marginBottom: 20,
          }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <MoonOrbit hoveredMoon={hoveredMoon} setHoveredMoon={setHoveredMoon} />
            </div>
          </div>

          {/* Philosophy */}
          <div style={{
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            borderRadius: 20, padding: "24px",
          }}>
            <p style={{ fontSize: 10, color: theme.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>
              Philosophy
            </p>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {[
                { char: "점", meaning: "선택", icon: "·" },
                { char: "선", meaning: "실행", icon: "━" },
                { char: "면", meaning: "결과", icon: "◇" },
                { char: "원", meaning: "순환", icon: "○" },
              ].map((step, i) => (
                <div key={step.char} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, color: moons[i * 2]?.color || theme.accent, marginBottom: 4 }}>{step.icon}</div>
                  <div style={{ fontSize: 14, color: theme.text, fontWeight: 500, fontFamily: "'Cormorant Garamond', serif" }}>{step.char}</div>
                  <div style={{ fontSize: 9, color: theme.textMuted, letterSpacing: "0.08em", marginTop: 2 }}>{step.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Stats + Life Graph */}
        <div>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {stats.map((stat, i) => (
              <div key={stat.label} style={{
                background: theme.bgCard, border: `1px solid ${theme.border}`,
                borderRadius: 16, padding: "24px 16px", textAlign: "center",
                transition: "all 0.3s ease",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = theme.bgCardHover;
                  (e.currentTarget as HTMLDivElement).style.borderColor = moons[i * 2]?.color || theme.borderHover;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = theme.bgCard;
                  (e.currentTarget as HTMLDivElement).style.borderColor = theme.border;
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 10, color: moons[i * 2]?.color || theme.accent, opacity: 0.8 }}>{stat.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 300, color: theme.text, letterSpacing: "-0.02em", fontFamily: "'Cormorant Garamond', serif" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 10, color: theme.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 6 }}>
                  {stat.label}
                </div>
                {stat.unit && <div style={{ fontSize: 9, color: theme.textFaint, marginTop: 2 }}>{stat.unit}</div>}
              </div>
            ))}
          </div>

          {/* Life Graph */}
          <div style={{
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            borderRadius: 20, padding: "24px 28px",
          }}>
            <p style={{ fontSize: 10, color: theme.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
              Life Graph · 최근 30일 습관 달성률
            </p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
              {lifeData.map((h, i) => {
                const isWeekend = i % 7 === 5 || i % 7 === 6;
                return (
                  <div key={i} style={{
                    flex: 1, height: `${h}%`, borderRadius: "3px 3px 0 0",
                    background: isWeekend ? theme.barWeekend(i) : theme.barDefault(i),
                    transition: "height 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  }} />
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 9, color: theme.textFaint, fontFamily: "'DM Sans', sans-serif" }}>30일 전</span>
              <span style={{ fontSize: 9, color: theme.textFaint, fontFamily: "'DM Sans', sans-serif" }}>오늘</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Links ── */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 10, color: theme.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
          Quick Links
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {QUICK_LINKS.map((link) => (
            <div key={link.label}
              onClick={() => setPage(link.page)}
              style={{
                background: theme.bgCard, border: `1px solid ${theme.border}`,
                borderRadius: 16, padding: "24px 16px", cursor: "pointer",
                textAlign: "center", transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = theme.bgCardHover;
                (e.currentTarget as HTMLDivElement).style.borderColor = theme.borderHover;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = theme.bgCard;
                (e.currentTarget as HTMLDivElement).style.borderColor = theme.border;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 10, opacity: 0.7, color: theme.text }}>{link.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 4 }}>{link.label}</div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.4 }}>{link.desc}</div>
              <div style={{ fontSize: 9, color: theme.textFaint, marginTop: 8, letterSpacing: "0.08em" }}>{link.ml}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rainbow Moon ── */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 10, color: theme.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
          Rainbow Moon
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
          {moons.map((moon) => {
            const isHovered = hoveredMoon === moon.id;
            return (
              <div key={moon.id}
                onMouseEnter={() => setHoveredMoon(moon.id)}
                onMouseLeave={() => setHoveredMoon(null)}
                style={{
                  background: `${moon.color}${theme.moonBgAlpha}`,
                  border: `1px solid ${moon.color}${theme.moonBorderAlpha}`,
                  borderRadius: 16, padding: "20px 10px",
                  textAlign: "center", cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: isHovered ? "translateY(-4px) scale(1.04)" : "none",
                  boxShadow: isHovered ? `0 8px 24px ${moon.color}25` : "none",
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", margin: "0 auto 10px",
                  background: `radial-gradient(circle at 35% 30%, ${moon.color}, ${moon.color}80)`,
                  boxShadow: `0 0 ${isHovered ? 20 : 8}px ${moon.color}${isHovered ? "50" : "25"}`,
                  transition: "box-shadow 0.3s ease",
                }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: moon.color, marginBottom: 3 }}>{moon.label}</div>
                <div style={{ fontSize: 9, color: theme.textMuted, lineHeight: 1.3 }}>{moon.meaning}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: "center", paddingTop: 24, borderTop: `1px solid ${theme.border}` }}>
        <p style={{ fontSize: 10, color: theme.textFaint, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Point &amp; Line · Connect · Amplify · Elevate
        </p>
      </footer>
    </div>
  );
}
