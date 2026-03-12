"use client";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import type { Goal } from "@/types";

export function Goals() {
  const { theme, moons } = useTheme();
  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, title: "", subgoals: [{ text: "", actions: [{ text: "", done: false }] }] },
  ]);

  const getProgress = (g: Goal) => {
    const a = g.subgoals.flatMap((s) => s.actions);
    return a.length === 0 ? 0 : Math.round((a.filter((x) => x.done).length / a.length) * 100);
  };

  return (
    <div style={{ padding: "48px 56px", maxWidth: 900 }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: moons[4].color }} />
          <span style={{ fontSize: 11, color: moons[4].color, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>Blue Moon · Focus</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: theme.text, margin: 0 }}>Goal Map</h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: theme.textMuted, marginTop: 6, fontStyle: "italic" }}>선은 배신하지 않는다</p>
      </div>
      {goals.map((goal, gi) => {
        const p = getProgress(goal);
        return (
          <div key={goal.id} style={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "32px 36px", marginBottom: 24, animation: `fadeSlideUp 0.4s ease ${gi * 0.1}s both` }}>
            <div style={{ height: 2, background: theme.textUltraFaint, borderRadius: 1, marginBottom: 24 }}>
              <div style={{ height: "100%", borderRadius: 1, width: `${p}%`, background: p === 100 ? moons[3].color : `linear-gradient(90deg, ${moons[4].color}, ${moons[5].color})`, transition: "width 0.5s" }} />
            </div>
            <input placeholder="목표를 입력하세요..." value={goal.title} onChange={(e) => { const g = [...goals]; g[gi].title = e.target.value; setGoals(g); }} style={{ background: "transparent", border: "none", outline: "none", color: theme.text, fontSize: 22, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, width: "100%", marginBottom: 24 }} />
            {goal.subgoals.map((sub, si) => (
              <div key={si} style={{ marginLeft: 20, marginBottom: 20, borderLeft: `1px solid ${moons[4].color}20`, paddingLeft: 20 }}>
                <input placeholder="세부 목표..." value={sub.text} onChange={(e) => { const g = [...goals]; g[gi].subgoals[si].text = e.target.value; setGoals(g); }} style={{ background: "transparent", border: "none", outline: "none", color: moons[4].color, fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, width: "100%", marginBottom: 12 }} />
                {sub.actions.map((a, ai) => (
                  <div key={ai} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, marginLeft: 12 }}>
                    <button onClick={() => { const g = [...goals]; g[gi].subgoals[si].actions[ai].done = !a.done; setGoals(g); }} style={{ width: 18, height: 18, borderRadius: "50%", cursor: "pointer", border: a.done ? "none" : `1.5px solid ${theme.checkBorder}`, background: a.done ? moons[4].color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0, padding: 0 }}>{a.done ? "✓" : ""}</button>
                    <input placeholder="실행 항목..." value={a.text} onChange={(e) => { const g = [...goals]; g[gi].subgoals[si].actions[ai].text = e.target.value; setGoals(g); }} style={{ background: "transparent", border: "none", outline: "none", flex: 1, color: a.done ? theme.textFaint : theme.textSecondary, fontSize: 13, fontFamily: "'DM Sans', sans-serif", textDecoration: a.done ? "line-through" : "none" }} />
                  </div>
                ))}
                <button onClick={() => { const g = [...goals]; g[gi].subgoals[si].actions.push({ text: "", done: false }); setGoals(g); }} style={{ background: "transparent", border: "none", color: theme.textFaint, fontSize: 12, cursor: "pointer", marginLeft: 12, fontFamily: "'DM Sans', sans-serif", padding: 0 }}>+ 액션 추가</button>
              </div>
            ))}
            <button onClick={() => { const g = [...goals]; g[gi].subgoals.push({ text: "", actions: [{ text: "", done: false }] }); setGoals(g); }} style={{ background: "transparent", border: `1px dashed ${theme.textUltraFaint}`, color: theme.textFaint, fontSize: 12, cursor: "pointer", padding: "8px 16px", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", marginLeft: 20 }}>+ 세부 목표</button>
          </div>
        );
      })}
      <button onClick={() => setGoals([...goals, { id: Date.now(), title: "", subgoals: [{ text: "", actions: [{ text: "", done: false }] }] }])} style={{ background: "transparent", border: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: 14, cursor: "pointer", padding: 20, borderRadius: 16, fontFamily: "'DM Sans', sans-serif", width: "100%", marginTop: 16 }}>+ 새 목표</button>
    </div>
  );
}
