"use client";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { sendChatMessage, type ChatContext } from "@/lib/ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// localStorage에서 사용자 데이터 수집 → AI 컨텍스트 구성
function buildContext(): ChatContext {
  if (typeof window === "undefined") return {};
  try {
    const rawGoals = JSON.parse(localStorage.getItem("rm_goals") || "[]") as {
      title: string;
      subgoals?: { actions?: { done: boolean }[] }[];
    }[];
    const goals = rawGoals
      .map((g) => {
        const actions = g.subgoals?.flatMap((s) => s.actions || []) || [];
        return { title: g.title, progress: `${actions.filter((a) => a.done).length}/${actions.length}` };
      })
      .filter((g) => g.title);

    const rawHabits = JSON.parse(localStorage.getItem("rm_habits") || "[]") as {
      name: string;
      checkedDates?: Record<string, boolean>;
    }[];
    const today = new Date();
    const habits = rawHabits.map((h) => {
      let streak = 0;
      const d = new Date(today);
      while (true) {
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (h.checkedDates?.[key]) { streak++; d.setDate(d.getDate() - 1); }
        else break;
      }
      return { name: h.name, streak };
    }).filter((h) => h.name);

    const recentJournal = (
      JSON.parse(localStorage.getItem("rm_journal") || "[]") as {
        date: string; gratitude: string; reflection: string; mood: number;
      }[]
    ).slice(0, 3);

    const cells = JSON.parse(localStorage.getItem("rm_mandalart_cells") || "[]") as string[];
    const mandalartCenter = cells[40] || "";
    const visionCount = (JSON.parse(localStorage.getItem("rm_vision_items") || "[]") as unknown[]).length;

    return { mandalartCenter, goals, habits, recentJournal, visionCount };
  } catch {
    return {};
  }
}

const SUGGESTIONS = ["오늘 할일 정리해줘", "습관 분석해줘", "목표 점검해줘", "동기부여 해줘 🔥"];

const WELCOME: Message = {
  role: "assistant",
  content: "안녕하세요 ✦ 저는 Moon AI예요.\n목표·습관·일기 데이터를 분석해서 맞춤 조언을 드릴게요. 무엇이 궁금하신가요?",
};

export function MoonChat() {
  const { theme, moons } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 패널 열림 애니메이션
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10);
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // 새 메시지 시 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const userMsg = (text ?? input).trim();
    if (!userMsg || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const context = buildContext();
      // 웰컴 메시지 제외하고 API 전송
      const apiMessages = newMessages.filter((_, i) => i > 0);
      const reply = await sendChatMessage(apiMessages, context);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "죄송해요, 잠시 후 다시 시도해주세요 🙏" }]);
    } finally {
      setLoading(false);
    }
  };

  // Rainbow gradient
  const rainbow = `conic-gradient(from 0deg, ${moons[0].color}, ${moons[1].color}, ${moons[2].color}, ${moons[3].color}, ${moons[4].color}, ${moons[5].color}, ${moons[6].color}, ${moons[0].color})`;

  return (
    <>
      {/* ── 플로팅 버튼 ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        title="Moon AI 열기"
        style={{
          position: "fixed", bottom: 28, right: 28,
          width: 52, height: 52, borderRadius: "50%",
          background: rainbow, border: "none", cursor: "pointer",
          zIndex: 1000, fontSize: 20, color: "#fff", fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.12)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)";
        }}
      >
        {isOpen ? "✕" : "✦"}
      </button>

      {/* ── 채팅 패널 ── */}
      {isOpen && (
        <div
          style={{
            position: "fixed", bottom: 92, right: 28,
            width: 368, height: 540,
            background: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: 24, zIndex: 999,
            display: "flex", flexDirection: "column", overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >
          {/* 헤더 */}
          <div style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${theme.border}`,
            background: theme.bg,
            display: "flex", alignItems: "center", gap: 10,
            flexShrink: 0,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: rainbow, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, color: "#fff", fontWeight: 700,
            }}>✦</div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 500, color: theme.text }}>
                Moon AI
              </div>
              <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                데이터 기반 개인 코치
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              {moons.slice(0, 7).map((m, i) => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: m.color, opacity: 0.6 }} />
              ))}
            </div>
          </div>

          {/* 메시지 목록 */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px 14px 8px",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "assistant" && (
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: rainbow, flexShrink: 0, marginRight: 6, marginTop: 2,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: "#fff",
                  }}>✦</div>
                )}
                <div style={{
                  maxWidth: "78%",
                  padding: "9px 13px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user" ? `${theme.accent}22` : theme.bg,
                  border: `1px solid ${msg.role === "user" ? theme.accent + "35" : theme.border}`,
                  fontSize: 13, color: theme.textSecondary,
                  fontFamily: "'DM Sans', sans-serif", lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* 로딩 */}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: rainbow, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: "#fff",
                }}>✦</div>
                <div style={{
                  padding: "9px 13px", borderRadius: "16px 16px 16px 4px",
                  background: theme.bg, border: `1px solid ${theme.border}`,
                  fontSize: 13, color: theme.textMuted,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  생각 중<span style={{ animation: "none" }}>...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 추천 질문 칩 */}
          {messages.length <= 1 && (
            <div style={{ padding: "0 14px 8px", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SUGGESTIONS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => send(chip)}
                  style={{
                    background: "transparent",
                    border: `1px solid ${theme.border}`,
                    borderRadius: 20, padding: "4px 11px",
                    fontSize: 11, color: theme.textMuted,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.accent;
                    e.currentTarget.style.color = theme.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.color = theme.textMuted;
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* 입력창 */}
          <div style={{
            padding: "10px 14px 14px",
            borderTop: `1px solid ${theme.border}`,
            display: "flex", gap: 8, flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="무엇이든 물어보세요..."
              style={{
                flex: 1, background: theme.inputBg,
                border: `1px solid ${theme.border}`, borderRadius: 12,
                padding: "9px 13px", fontSize: 13,
                color: theme.textSecondary,
                fontFamily: "'DM Sans', sans-serif", outline: "none",
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: input.trim() && !loading ? rainbow : theme.inputBg,
                border: `1px solid ${theme.border}`,
                cursor: input.trim() && !loading ? "pointer" : "default",
                fontSize: 15, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
                opacity: input.trim() && !loading ? 1 : 0.4,
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
