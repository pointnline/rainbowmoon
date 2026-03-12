"use client";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import type { JournalEntry } from "@/types";

export function Journal() {
  const { theme, moons } = useTheme();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [cur, setCur] = useState({ gratitude: "", reflection: "", mood: 3 });
  const moods = ["😔", "😐", "🙂", "😊", "✨"];

  return (
    <div style={{ padding: "48px 56px", maxWidth: 740 }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: moons[5].color }} />
          <span style={{ fontSize: 11, color: moons[5].color, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>Indigo Moon · Insight</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: theme.text, margin: 0 }}>Journal</h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: theme.textMuted, marginTop: 6, fontStyle: "italic" }}>오늘의 점을 기록하다</p>
      </div>
      <div style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "36px 40px", marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 13, color: theme.textSecondary, fontFamily: "'DM Sans', sans-serif" }}>
            {new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {moods.map((m, i) => (
              <button key={i} onClick={() => setCur({ ...cur, mood: i })} style={{
                background: cur.mood === i ? `${theme.accent}20` : "transparent",
                border: cur.mood === i ? `1px solid ${theme.accent}40` : "1px solid transparent",
                borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: cur.mood === i ? 1 : 0.4, padding: 0,
              }}>{m}</button>
            ))}
          </div>
        </div>
        {[
          { l: "감사한 것", c: moons[2].color, k: "gratitude" as const, p: "오늘 감사한 것은...", r: 3 },
          { l: "오늘의 성찰", c: moons[5].color, k: "reflection" as const, p: "오늘 하루를 돌아보며...", r: 5 },
        ].map((f) => (
          <div key={f.k} style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, color: f.c, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, display: "block" }}>{f.l}</label>
            <textarea value={cur[f.k]} onChange={(e) => setCur({ ...cur, [f.k]: e.target.value })} placeholder={f.p} rows={f.r} style={{
              background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 12,
              padding: "14px 16px", color: theme.textSecondary, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
              width: "100%", resize: "none", outline: "none", lineHeight: 1.7, boxSizing: "border-box",
            }} />
          </div>
        ))}
        <button onClick={() => {
          if (!cur.gratitude && !cur.reflection) return;
          setEntries([{ ...cur, date: new Date().toISOString(), id: Date.now() }, ...entries]);
          setCur({ gratitude: "", reflection: "", mood: 3 });
        }} style={{
          background: theme.ctaPrimary, border: `1px solid ${theme.ctaPrimaryBorder}`,
          color: theme.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
          padding: "12px 32px", borderRadius: 12, cursor: "pointer",
        }}>점 찍기</button>
      </div>
      {entries.map((e, i) => (
        <div key={e.id} style={{ background: theme.bgCard, border: `1px solid ${theme.textUltraFaint}`, borderRadius: 16, padding: "24px 28px", marginBottom: 12, animation: `fadeSlideUp 0.3s ease ${i * 0.05}s both` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{new Date(e.date).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}</span>
            <span style={{ fontSize: 14 }}>{moods[e.mood]}</span>
          </div>
          {e.gratitude && <p style={{ fontSize: 13, color: theme.textSecondary, fontFamily: "'DM Sans', sans-serif", margin: "0 0 8px", lineHeight: 1.6 }}>{e.gratitude}</p>}
          {e.reflection && <p style={{ fontSize: 13, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", margin: 0, lineHeight: 1.6 }}>{e.reflection}</p>}
        </div>
      ))}
    </div>
  );
}
