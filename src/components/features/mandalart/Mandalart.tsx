"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { MANDALART_PACKAGES, buildCellsFromPackage } from "@/constants/mandalart-packages";
import { generateMandalart, MANDALART_FALLBACK } from "@/lib/ai";

// ─── 헬퍼 함수 ───
// 셀 인덱스 → 블록 인덱스 (0~8)
const gbi = (ci: number): number => {
  const r = Math.floor(ci / 9),
    c = ci % 9;
  return Math.floor(r / 3) * 3 + Math.floor(c / 3);
};

// 블록 인덱스 → 블록 중앙 셀 인덱스
const cob = (bi: number): number => {
  const br = Math.floor(bi / 3),
    bc = bi % 3;
  return (br * 3 + 1) * 9 + (bc * 3 + 1);
};

export function Mandalart() {
  const { theme, moons } = useTheme();

  // ─── 상태 ───
  const [cells, setCells] = useState<string[]>(Array(81).fill(""));
  const [sel, setSel] = useState<number | null>(null);
  const [showPackages, setShowPackages] = useState(true);
  const [activePackage, setActivePackage] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [aiGoal, setAiGoal] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 블록 → Moon 매핑
  const blockMoonMap: Record<number, { moon: { color: string; label: string }; label: string }> = {
    0: { moon: moons[0], label: "Passion" },
    1: { moon: moons[1], label: "Creation" },
    2: { moon: moons[2], label: "Joy" },
    3: { moon: moons[3], label: "Growth" },
    5: { moon: moons[4], label: "Focus" },
    6: { moon: moons[5], label: "Insight" },
    7: { moon: moons[6], label: "Vision" },
    8: { moon: { ...moons[0], color: theme.accent }, label: "System" },
  };

  // 셀 선택 시 인풋 포커스
  useEffect(() => {
    if (sel !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [sel]);

  // ─── AI 생성 핸들러 ───
  const handleAIGenerate = async () => {
    if (!aiGoal.trim()) return;
    setAiLoading(true);
    try {
      const parsed = await generateMandalart(aiGoal);
      if (parsed.core && parsed.themes && parsed.themes.length === 8) {
        setCells(buildCellsFromPackage(parsed));
        setActivePackage("ai-custom");
        setShowAI(false);
        setShowPackages(false);
        setSel(null);
      }
    } catch (err) {
      console.error("AI generation error:", err);
      setCells(buildCellsFromPackage(MANDALART_FALLBACK(aiGoal)));
      setActivePackage("ai-fallback");
      setShowAI(false);
      setShowPackages(false);
    } finally {
      setAiLoading(false);
    }
  };

  // ─── 패키지 선택 핸들러 ───
  const handleSelectPackage = (pkg: (typeof MANDALART_PACKAGES)[number]) => {
    setCells(buildCellsFromPackage(pkg));
    setActivePackage(pkg.id);
    setShowPackages(false);
    setSel(null);
  };

  // ─── 빈 만다라트 시작 ───
  const handleBlankStart = () => {
    setCells(Array(81).fill(""));
    setActivePackage(null);
    setShowPackages(false);
    setSel(null);
  };

  // ─── 패키지 변경 (리셋) ───
  const handleReset = () => {
    setShowPackages(true);
    setActivePackage(null);
    setCells(Array(81).fill(""));
    setSel(null);
    setShowAI(false);
    setAiGoal("");
  };

  // ─── 셀 편집 핸들러 ───
  const handleCellChange = (idx: number, value: string) => {
    setCells((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  // ─── 블록 중앙 셀 목록 ───
  const blockCenters = Array.from({ length: 9 }, (_, bi) => cob(bi));

  // ─── 패키지 선택 뷰 ───
  if (showPackages) {
    return (
      <div style={{ padding: "0 20px 40px" }}>
        {/* 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 300,
              color: theme.text,
              letterSpacing: "-0.5px",
              marginBottom: 8,
            }}
          >
            만다라트 패키지 선택
          </h2>
          <p style={{ fontSize: 13, color: theme.textMuted }}>
            AI로 나만의 만다라트를 생성하거나, 프리빌트 패키지를 선택하세요
          </p>
        </div>

        {/* AI Custom Generation 카드 */}
        <div
          style={{
            background: showAI
              ? `linear-gradient(135deg, ${theme.accent}15, ${theme.accentSecondary}10)`
              : theme.bgCard,
            border: `1px solid ${showAI ? theme.accent + "40" : theme.border}`,
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            cursor: showAI ? "default" : "pointer",
            transition: "all 0.3s ease",
          }}
          onClick={() => !showAI && setShowAI(true)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: showAI ? 16 : 0 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              ✦
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>
                AI 커스텀 생성
              </div>
              <div style={{ fontSize: 12, color: theme.textMuted }}>
                목표를 입력하면 AI가 81칸을 채워줍니다
              </div>
            </div>
          </div>

          {showAI && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAIGenerate()}
                  placeholder="예: 1년 안에 AI 전문가 되기"
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: `1px solid ${theme.border}`,
                    background: theme.inputBg,
                    color: theme.text,
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleAIGenerate}
                  disabled={aiLoading || !aiGoal.trim()}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 10,
                    border: "none",
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: aiLoading || !aiGoal.trim() ? "not-allowed" : "pointer",
                    opacity: aiLoading || !aiGoal.trim() ? 0.5 : 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {aiLoading ? "생성 중..." : "생성 ✦"}
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAI(false);
                  setAiGoal("");
                }}
                style={{
                  marginTop: 8,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "transparent",
                  color: theme.textMuted,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                취소
              </button>
            </div>
          )}
        </div>

        {/* 프리빌트 패키지 그리드 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {MANDALART_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => handleSelectPackage(pkg)}
              style={{
                background: theme.bgCard,
                border: `1px solid ${theme.border}`,
                borderRadius: 14,
                padding: 18,
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
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
              <div style={{ fontSize: 28, marginBottom: 8 }}>{pkg.icon}</div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: theme.text,
                  marginBottom: 4,
                }}
              >
                {pkg.label}
              </div>
              <div style={{ fontSize: 11, color: theme.textMuted, lineHeight: 1.4 }}>
                {pkg.desc}
              </div>
            </div>
          ))}
        </div>

        {/* 빈 만다라트로 시작 */}
        <button
          onClick={handleBlankStart}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: `1px dashed ${theme.border}`,
            background: "transparent",
            color: theme.textSecondary,
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = theme.borderHover;
            (e.currentTarget as HTMLButtonElement).style.color = theme.text;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = theme.border;
            (e.currentTarget as HTMLButtonElement).style.color = theme.textSecondary;
          }}
        >
          빈 만다라트로 시작하기
        </button>
      </div>
    );
  }

  // ─── 만다라트 그리드 뷰 ───
  return (
    <div style={{ padding: "0 12px 40px" }}>
      {/* 블록 범례 + 패키지 변경 버튼 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          padding: "0 4px",
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(blockMoonMap).map(([bi, { moon, label }]) => (
            <div
              key={bi}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 10,
                color: theme.textMuted,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: moon.color,
                  opacity: 0.7,
                }}
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleReset}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: `1px solid ${theme.border}`,
            background: "transparent",
            color: theme.textMuted,
            fontSize: 11,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = theme.borderHover;
            (e.currentTarget as HTMLButtonElement).style.color = theme.textSecondary;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = theme.border;
            (e.currentTarget as HTMLButtonElement).style.color = theme.textMuted;
          }}
        >
          패키지 변경
        </button>
      </div>

      {/* 9×9 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 1fr)",
          gap: 2,
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        {cells.map((cell, ci) => {
          const bi = gbi(ci);
          const isCenter = ci === 40;
          const isBlockCenter = blockCenters.includes(ci) && ci !== 40;
          const moonInfo = blockMoonMap[bi];
          const moonColor = bi === 4 ? theme.accent : moonInfo?.moon.color ?? theme.textMuted;

          // 블록 구분선 계산
          const col = ci % 9;
          const row = Math.floor(ci / 9);
          const rightSep = col === 2 || col === 5;
          const bottomSep = row === 2 || row === 5;

          return (
            <div
              key={ci}
              onClick={() => setSel(ci)}
              style={{
                position: "relative",
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                cursor: "pointer",
                transition: "all 0.2s ease",
                // 블록 구분선
                marginRight: rightSep ? 4 : 0,
                marginBottom: bottomSep ? 4 : 0,
                // 중앙 셀
                ...(isCenter
                  ? {
                      background: `linear-gradient(135deg, ${theme.accent}30, ${theme.accentSecondary}20)`,
                      border: `1px solid ${theme.accent}50`,
                    }
                  : isBlockCenter
                    ? {
                        background: `${moonColor}15`,
                        border: `1px solid ${moonColor}30`,
                      }
                    : {
                        background: theme.bgCard,
                        border: `1px solid ${theme.border}`,
                      }),
              }}
              onMouseEnter={(e) => {
                if (!isCenter && !isBlockCenter) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = theme.borderHover;
                  (e.currentTarget as HTMLDivElement).style.background = theme.bgCardHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isCenter && !isBlockCenter) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = theme.border;
                  (e.currentTarget as HTMLDivElement).style.background = theme.bgCard;
                }
              }}
            >
              {/* 선택된 셀 → 인라인 편집 인풋 */}
              {sel === ci ? (
                <input
                  ref={inputRef}
                  value={cell}
                  onChange={(e) => handleCellChange(ci, e.target.value)}
                  onBlur={() => setSel(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") setSel(null);
                  }}
                  style={{
                    width: "90%",
                    height: "90%",
                    border: "none",
                    background: "transparent",
                    color: theme.text,
                    fontSize: 9,
                    textAlign: "center",
                    outline: "none",
                    padding: 2,
                  }}
                />
              ) : (
                <>
                  {/* 중앙 셀(40): P·L 그라데이션 아이콘 */}
                  {isCenter && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 8,
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      >
                        P·L
                      </div>
                      {cell && (
                        <span
                          style={{
                            fontSize: 8,
                            color: theme.text,
                            fontWeight: 600,
                            textAlign: "center",
                            lineHeight: 1.2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "95%",
                          }}
                        >
                          {cell}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 블록 중앙 셀: Moon 도트 아이콘 */}
                  {isBlockCenter && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: moonColor,
                          opacity: 0.7,
                        }}
                      />
                      {cell && (
                        <span
                          style={{
                            fontSize: 8,
                            color: moonColor,
                            fontWeight: 600,
                            textAlign: "center",
                            lineHeight: 1.2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "95%",
                          }}
                        >
                          {cell}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 일반 셀 */}
                  {!isCenter && !isBlockCenter && (
                    <span
                      style={{
                        fontSize: 8,
                        color: cell ? theme.textSecondary : theme.textFaint,
                        textAlign: "center",
                        lineHeight: 1.2,
                        padding: "2px 3px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        wordBreak: "break-all",
                      }}
                    >
                      {cell || "·"}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
