"use client";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import type { Habit } from "@/types";

export function Habits() {
  const { theme, moons } = useTheme();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: "명상 10분", color: moons[5].color, checkedDates: {} },
    { id: 2, name: "운동 30분", color: moons[0].color, checkedDates: {} },
    { id: 3, name: "독서 20페이지", color: moons[3].color, checkedDates: {} },
  ]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

  const dateKey = (d: number) => `${year}-${month}-${d}`;
  const isToday = (d: number) => dateKey(d) === todayStr;
  const isWeekend = (d: number) => { const dow = new Date(year, month, d).getDay(); return dow === 0 || dow === 6; };
  const isPast = (d: number) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isFuture = (d: number) => new Date(year, month, d) > today;

  const toggleDay = (habitIdx: number, day: number) => {
    if (isFuture(day)) return;
    const hb = [...habits];
    const key = dateKey(day);
    if (hb[habitIdx].checkedDates[key]) {
      delete hb[habitIdx].checkedDates[key];
    } else {
      hb[habitIdx].checkedDates[key] = true;
    }
    setHabits(hb);
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  // Stats calculations
  const getMonthCount = (h: Habit) => {
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) { if (h.checkedDates[dateKey(d)]) count++; }
    return count;
  };

  const getStreak = (h: Habit) => {
    let streak = 0;
    const d = new Date(today);
    while (true) {
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (h.checkedDates[key]) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  };

  const getTodayTotal = () => {
    let done = 0;
    habits.forEach(h => { if (h.checkedDates[todayStr]) done++; });
    return done;
  };

  // Calendar grid: 6 rows x 7 cols
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  // How many habits done on a specific day
  const dayCompletionCount = (day: number | null) => {
    if (!day) return 0;
    return habits.filter(h => h.checkedDates[dateKey(day)]).length;
  };

  const dayCompletionRatio = (day: number | null) => {
    if (!day || habits.length === 0) return 0;
    return dayCompletionCount(day) / habits.length;
  };

  return (
    <div style={{ padding: "48px 56px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: moons[3].color }} />
          <span style={{ fontSize: 11, color: moons[3].color, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>Green Moon · Growth</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: theme.text, margin: 0 }}>Habit Line</h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: theme.textMuted, marginTop: 6, fontStyle: "italic" }}>점이 7일 연결되면 선, 30일 연결되면 원</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

        {/* LEFT: Habit Cards */}
        <div>
          {/* Today summary bar */}
          <div style={{
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            borderRadius: 16, padding: "20px 28px", marginBottom: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>오늘의 습관</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: theme.text, margin: 0 }}>
                <span style={{ fontWeight: 600, color: moons[3].color }}>{getTodayTotal()}</span>
                <span style={{ fontSize: 16, color: theme.textFaint }}> / {habits.length}</span>
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <p style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                {today.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })}
              </p>
              {getTodayTotal() === habits.length && habits.length > 0 && (
                <div style={{
                  background: `${moons[3].color}15`, border: `1px solid ${moons[3].color}30`,
                  borderRadius: 8, padding: "4px 10px", fontSize: 11, color: moons[3].color,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                }}>Complete!</div>
              )}
            </div>
          </div>

          {/* Habit cards */}
          {habits.map((h, hi) => {
            const streak = getStreak(h);
            const monthCount = getMonthCount(h);
            const monthRate = daysInMonth > 0 ? Math.round((monthCount / Math.min(today.getDate(), daysInMonth)) * 100) : 0;
            const isCheckedToday = !!h.checkedDates[todayStr];

            return (
              <div key={h.id} style={{
                background: theme.bgCard, border: `1px solid ${theme.border}`,
                borderRadius: 20, padding: "24px 28px", marginBottom: 16,
                animation: `fadeSlideUp 0.4s ease ${hi * 0.08}s both`,
              }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: h.color }} />
                    <input value={h.name} placeholder="습관 이름..."
                      onChange={e => { const hb = [...habits]; hb[hi].name = e.target.value; setHabits(hb); }}
                      style={{ background: "transparent", border: "none", outline: "none", color: theme.text, fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {streak > 0 && (
                      <span style={{ fontSize: 11, color: h.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                        {streak >= 30 ? "● " : streak >= 7 ? "━ " : "· "}{streak}일 연속
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{monthRate}%</span>
                  </div>
                </div>

                {/* Today toggle - big button */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                  <button onClick={() => toggleDay(hi, today.getDate())}
                    style={{
                      height: 40, paddingLeft: 14, paddingRight: 18, borderRadius: 12,
                      background: isCheckedToday ? `${h.color}20` : theme.inputBg,
                      border: `1.5px solid ${isCheckedToday ? h.color + "60" : theme.border}`,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                      transition: "all 0.25s",
                    }}
                    onMouseEnter={e => { if (!isCheckedToday) e.currentTarget.style.borderColor = h.color + "40"; }}
                    onMouseLeave={e => { if (!isCheckedToday) e.currentTarget.style.borderColor = theme.border; }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 6,
                      background: isCheckedToday ? h.color : "transparent",
                      border: isCheckedToday ? "none" : `1.5px solid ${theme.checkBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}>
                      {isCheckedToday && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{
                      fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                      color: isCheckedToday ? h.color : theme.textMuted, fontWeight: 500,
                    }}>{isCheckedToday ? "완료!" : "오늘 체크하기"}</span>
                  </button>
                  <div style={{ flex: 1, height: 4, background: theme.textUltraFaint, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${monthRate}%`, background: `linear-gradient(90deg, ${h.color}80, ${h.color})`, borderRadius: 2, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ fontSize: 11, color: theme.textFaint, fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>{monthCount}/{Math.min(today.getDate(), daysInMonth)}일</span>
                </div>

                {/* Mini month grid - inline calendar */}
                <div>
                  {/* Day labels */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
                    {dayNames.map((d, di) => (
                      <div key={di} style={{
                        textAlign: "center", fontSize: 8, fontFamily: "'DM Sans', sans-serif",
                        color: di === 0 ? `${moons[0].color}80` : di === 6 ? `${moons[4].color}60` : theme.textFaint,
                        padding: "2px 0",
                      }}>{d}</div>
                    ))}
                  </div>
                  {/* Days */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                    {calendarDays.map((day, di) => {
                      if (!day) return <div key={di} />;
                      const checked = !!h.checkedDates[dateKey(day)];
                      const tdy = isToday(day);
                      const future = isFuture(day);
                      const wknd = isWeekend(day);
                      return (
                        <button key={di} onClick={() => toggleDay(hi, day)}
                          disabled={future}
                          style={{
                            aspectRatio: "1", borderRadius: checked ? 6 : 4,
                            background: checked ? `${h.color}25` : "transparent",
                            border: tdy ? `1.5px solid ${h.color}60` : checked ? `1px solid ${h.color}35` : `1px solid ${theme.textUltraFaint}`,
                            cursor: future ? "default" : "pointer",
                            opacity: future ? 0.3 : 1,
                            transition: "all 0.15s", padding: 0,
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center", gap: 1,
                            position: "relative",
                          }}
                        >
                          <span style={{
                            fontSize: 8, fontFamily: "'DM Sans', sans-serif",
                            color: tdy ? h.color : wknd ? (new Date(year, month, day).getDay() === 0 ? `${moons[0].color}70` : `${moons[4].color}50`) : checked ? h.color : theme.textFaint,
                            fontWeight: tdy ? 700 : checked ? 600 : 400,
                          }}>{day}</span>
                          {checked && <div style={{ width: 3, height: 3, borderRadius: "50%", background: h.color }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add habit */}
          <button onClick={() => {
            const c = moons.map(m => m.color);
            setHabits([...habits, { id: Date.now(), name: "", color: c[habits.length % 7], checkedDates: {} }]);
          }} style={{
            background: "transparent", border: `1px solid ${theme.border}`,
            color: theme.textMuted, fontSize: 14, cursor: "pointer",
            padding: 20, borderRadius: 16, fontFamily: "'DM Sans', sans-serif", width: "100%",
          }}>+ 새 습관</button>
        </div>

        {/* RIGHT: Monthly Calendar Overview */}
        <div style={{ position: "sticky", top: 24 }}>
          <div style={{
            background: theme.bgCard, border: `1px solid ${theme.border}`,
            borderRadius: 20, padding: "24px", overflow: "hidden",
          }}>
            {/* Month nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <button onClick={prevMonth} style={{
                background: "none", border: "none", color: theme.textMuted,
                cursor: "pointer", fontSize: 16, padding: "4px 8px", borderRadius: 6,
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = theme.text}
              onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
              >‹</button>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: theme.text }}>
                  {year}년 {monthNames[month]}
                </span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {!isCurrentMonth && (
                  <button onClick={goToday} style={{
                    background: `${moons[3].color}15`, border: `1px solid ${moons[3].color}25`,
                    color: moons[3].color, fontSize: 10, fontFamily: "'DM Sans', sans-serif",
                    padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                  }}>오늘</button>
                )}
                <button onClick={nextMonth} style={{
                  background: "none", border: "none", color: theme.textMuted,
                  cursor: "pointer", fontSize: 16, padding: "4px 8px", borderRadius: 6,
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = theme.text}
                onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
                >›</button>
              </div>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 6 }}>
              {dayNames.map((d, di) => (
                <div key={di} style={{
                  textAlign: "center", fontSize: 10, fontFamily: "'DM Sans', sans-serif",
                  color: di === 0 ? `${moons[0].color}80` : di === 6 ? `${moons[4].color}60` : theme.textMuted,
                  padding: "4px 0", fontWeight: 500,
                }}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
              {calendarDays.map((day, di) => {
                if (!day) return <div key={di} style={{ aspectRatio: "1" }} />;
                const tdy = isToday(day);
                const future = isFuture(day);
                const wknd = isWeekend(day);
                const ratio = dayCompletionRatio(day);
                const count = dayCompletionCount(day);
                const allDone = count === habits.length && habits.length > 0;

                return (
                  <div key={di} style={{
                    aspectRatio: "1", borderRadius: 10,
                    background: allDone ? `${moons[3].color}15` : ratio > 0 ? `${moons[3].color}08` : "transparent",
                    border: tdy ? `2px solid ${moons[3].color}70` : `1px solid ${ratio > 0 ? moons[3].color + "20" : theme.textUltraFaint}`,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 2,
                    opacity: future ? 0.25 : 1,
                    transition: "all 0.2s",
                    position: "relative",
                  }}>
                    <span style={{
                      fontSize: 11, fontFamily: "'DM Sans', sans-serif",
                      color: tdy ? moons[3].color : wknd ? (new Date(year, month, day).getDay() === 0 ? `${moons[0].color}90` : `${moons[4].color}70`) : theme.text,
                      fontWeight: tdy ? 700 : 400,
                    }}>{day}</span>

                    {/* Completion dots */}
                    {count > 0 && !future && (
                      <div style={{ display: "flex", gap: 2 }}>
                        {habits.map((h, hi) => (
                          <div key={hi} style={{
                            width: 4, height: 4, borderRadius: "50%",
                            background: h.checkedDates[dateKey(day)] ? h.color : theme.textUltraFaint,
                            transition: "background 0.2s",
                          }} />
                        ))}
                      </div>
                    )}
                    {count === 0 && !future && day <= (isCurrentMonth ? today.getDate() : daysInMonth) && (
                      <div style={{ display: "flex", gap: 2 }}>
                        {habits.map((_, hi) => (
                          <div key={hi} style={{ width: 3, height: 3, borderRadius: "50%", background: theme.textUltraFaint }} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{
              marginTop: 16, paddingTop: 16, borderTop: `1px solid ${theme.border}`,
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              {habits.map((h) => {
                const streak = getStreak(h);
                const monthCount = getMonthCount(h);
                return (
                  <div key={h.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: h.color }} />
                      <span style={{ fontSize: 11, color: theme.textSecondary, fontFamily: "'DM Sans', sans-serif" }}>{h.name || "미정"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {streak > 0 && <span style={{ fontSize: 10, color: h.color, fontFamily: "'DM Sans', sans-serif" }}>{streak}일</span>}
                      <span style={{ fontSize: 10, color: theme.textFaint, fontFamily: "'DM Sans', sans-serif" }}>{monthCount}일</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Monthly completion rate */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${theme.border}`, textAlign: "center" }}>
              <p style={{ fontSize: 10, color: theme.textFaint, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>이번 달 달성률</p>
              {(() => {
                const maxDays = isCurrentMonth ? today.getDate() : daysInMonth;
                const totalPossible = maxDays * habits.length;
                let totalDone = 0;
                for (let d = 1; d <= maxDays; d++) {
                  habits.forEach(h => { if (h.checkedDates[dateKey(d)]) totalDone++; });
                }
                const rate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
                return (
                  <>
                    <div style={{ height: 6, background: theme.textUltraFaint, borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ height: "100%", width: `${rate}%`, background: `linear-gradient(90deg, ${moons[3].color}, ${moons[2].color})`, borderRadius: 3, transition: "width 0.5s" }} />
                    </div>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: theme.text }}>{rate}%</span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
