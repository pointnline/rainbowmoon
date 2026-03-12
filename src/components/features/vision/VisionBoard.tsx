"use client";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import type { VisionItem } from "@/types";
import { VISION_PACKAGES } from "@/constants/vision-packages";
import { generateVision, VISION_FALLBACK } from "@/lib/ai";

export function VisionBoard() {
  const { theme, moons } = useTheme();
  const [items, setItems] = useState<VisionItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; url: string; thumb: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [newText, setNewText] = useState("");
  const [aiGoal, setAiGoal] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const categories = [
    { label: "성공", query: "success business" },
    { label: "여행", query: "travel adventure" },
    { label: "건강", query: "fitness health" },
    { label: "자연", query: "nature landscape" },
    { label: "학습", query: "study education" },
    { label: "럭셔리", query: "luxury lifestyle" },
    { label: "창작", query: "creative design art" },
    { label: "도시", query: "city architecture" },
  ];

  const doSearch = (query: string) => {
    if (!query.trim()) return;
    setSearching(true);
    const results = Array.from({ length: 9 }).map((_, i) => ({
      id: `${Date.now()}_${i}`,
      url: `https://picsum.photos/seed/${query.replace(/\s+/g, '')}_${i}/400/300`,
      thumb: `https://picsum.photos/seed/${query.replace(/\s+/g, '')}_${i}/200/150`,
    }));
    setTimeout(() => { setSearchResults(results); setSearching(false); }, 500);
  };

  const addItem = (imageUrl: string | null, text?: string) => {
    setItems(prev => [...prev, {
      id: Date.now() + Math.random(), text: text || newText, image: imageUrl || null,
      color: moons[Math.floor(Math.random() * 7)].color,
    }]);
    setNewText(""); setSearchResults([]); setSearchQuery(""); setShowAdd(false);
  };

  const removeItem = (id: number) => setItems(items.filter(it => it.id !== id));

  const applyPackage = (pkg: typeof VISION_PACKAGES[number]) => {
    const newItems: VisionItem[] = pkg.visions.map((v, i) => ({
      id: Date.now() + i,
      text: v.text,
      image: `https://picsum.photos/seed/${v.query.replace(/\s+/g, '')}_0/400/300`,
      color: moons[i % 7].color,
    }));
    setItems(newItems);
  };

  const handleAIGenerate = async () => {
    if (!aiGoal.trim()) return;
    setAiLoading(true);
    try {
      const parsed = await generateVision(aiGoal);
      if (parsed.visions && parsed.visions.length > 0) {
        const newItems: VisionItem[] = parsed.visions.map((v, i) => ({
          id: Date.now() + i,
          text: v.text,
          image: `https://picsum.photos/seed/${v.query.replace(/\s+/g, '')}_0/400/300`,
          color: moons[i % 7].color,
        }));
        setItems(newItems);
      }
    } catch (err) {
      console.error("AI vision error:", err);
      const fallback = VISION_FALLBACK(aiGoal);
      const newItems: VisionItem[] = fallback.visions.map((v, i) => ({
        id: Date.now() + i, text: v.text,
        image: `https://picsum.photos/seed/${v.query.replace(/\s+/g, '')}_0/400/300`,
        color: moons[i % 7].color,
      }));
      setItems(newItems);
    }
    setAiLoading(false);
  };

  const hasItems = items.length > 0;

  return (
    <div style={{ padding: "48px 56px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: moons[6].color }} />
          <span style={{ fontSize: 11, color: moons[6].color, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>Violet Moon · Vision</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: theme.text, margin: 0 }}>Vision Board</h1>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: theme.textMuted, marginTop: 6, fontStyle: "italic" }}>비전(점)과 실행라인(선)을 연결하다</p>
          </div>
          {hasItems && (
            <button onClick={() => setShowAdd(!showAdd)} style={{
              background: showAdd ? `${moons[6].color}20` : `${moons[6].color}10`,
              border: `1px solid ${moons[6].color}${showAdd ? "50" : "30"}`,
              color: moons[6].color, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              padding: "10px 24px", borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
            }}>{showAdd ? "닫기" : "+ 비전 추가"}</button>
          )}
        </div>
      </div>

      {/* Empty State: AI + Packages */}
      {!hasItems && !showAdd && (
        <div>
          {/* AI Custom */}
          <div style={{
            background: `linear-gradient(135deg, ${moons[6].color}06, ${moons[5].color}04)`,
            border: `1px solid ${moons[6].color}20`,
            borderRadius: 24, padding: "32px 36px", marginBottom: 28,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${moons[6].color}35, ${moons[5].color}35, transparent)` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: `linear-gradient(135deg, ${moons[6].color}20, ${moons[5].color}12)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>✦</div>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: theme.text, margin: 0 }}>AI 비전 추천</h3>
                <p style={{ fontSize: 12, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>당신의 꿈을 입력하면 AI가 비전보드를 채워드립니다</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{
                flex: 1, display: "flex", alignItems: "center",
                background: theme.inputBg, border: `1px solid ${theme.border}`,
                borderRadius: 14, padding: "0 16px",
              }}>
                <input value={aiGoal} onChange={e => setAiGoal(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleAIGenerate(); }}
                  placeholder="예: 30대에 경제적 자유 달성, 세계 일주, 디자이너로 독립..."
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: theme.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif", padding: "13px 0",
                  }} />
              </div>
              <button onClick={handleAIGenerate} disabled={aiLoading || !aiGoal.trim()} style={{
                background: `linear-gradient(135deg, ${moons[6].color}30, ${moons[5].color}20)`,
                border: `1px solid ${moons[6].color}45`,
                color: theme.text, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                padding: "0 26px", borderRadius: 14, cursor: "pointer",
                fontWeight: 500, opacity: aiLoading || !aiGoal.trim() ? 0.5 : 1,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                {aiLoading ? (
                  <><div style={{ width: 16, height: 16, border: `2px solid ${theme.textFaint}`, borderTop: `2px solid ${moons[6].color}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />생성 중...</>
                ) : "AI 생성"}
              </button>
            </div>
          </div>

          {/* Packages */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: theme.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>추천 비전 패키지</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
            {VISION_PACKAGES.map((pkg, i) => (
              <button key={pkg.id} onClick={() => applyPackage(pkg)} style={{
                background: theme.bgCard, border: `1px solid ${theme.border}`,
                borderRadius: 20, padding: "24px 22px", cursor: "pointer",
                textAlign: "left", transition: "all 0.3s",
                position: "relative", overflow: "hidden",
                animation: `fadeSlideUp 0.4s ease ${0.05 + i * 0.05}s both`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = moons[i % 7].color + "40"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${moons[i % 7].color}35, transparent)` }} />
                <span style={{ fontSize: 24, display: "block", marginBottom: 12 }}>{pkg.icon}</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 500, color: theme.text, display: "block", marginBottom: 4 }}>{pkg.label}</span>
                <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, display: "block", marginBottom: 14 }}>{pkg.desc}</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {pkg.visions.slice(0, 3).map((v, vi) => (
                    <span key={vi} style={{
                      fontSize: 9, color: theme.textFaint, fontFamily: "'DM Sans', sans-serif",
                      background: theme.bgCardHover, borderRadius: 5, padding: "2px 7px",
                    }}>{v.text.slice(0, 12)}…</span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Start blank */}
          <button onClick={() => setShowAdd(true)} style={{
            background: "transparent", border: `1px dashed ${theme.textUltraFaint}`,
            color: theme.textFaint, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            padding: "16px 24px", borderRadius: 16, cursor: "pointer", width: "100%",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = theme.textMuted; e.currentTarget.style.color = theme.textMuted; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = theme.textUltraFaint; e.currentTarget.style.color = theme.textFaint; }}
          >직접 비전 추가하기</button>
        </div>
      )}

      {/* Add Panel */}
      {showAdd && (
        <div style={{
          background: theme.bgCard, border: `1px solid ${theme.border}`,
          borderRadius: 20, padding: "28px 32px", marginBottom: 28,
          animation: "fadeSlideUp 0.3s ease both",
        }}>
          <input value={newText} onChange={e => setNewText(e.target.value)}
            placeholder="비전을 한 줄로 적어보세요..."
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              color: theme.text, fontSize: 18, fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500, marginBottom: 20, padding: 0,
            }} />
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center",
              background: theme.inputBg, border: `1px solid ${theme.border}`,
              borderRadius: 12, padding: "0 14px",
            }}>
              <span style={{ color: theme.textFaint, fontSize: 13, marginRight: 8 }}>⌕</span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") doSearch(searchQuery); }}
                placeholder="이미지 검색..."
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: theme.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: "11px 0",
                }} />
            </div>
            <button onClick={() => doSearch(searchQuery)} style={{
              background: `${theme.accent}20`, border: `1px solid ${theme.accent}35`,
              color: theme.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              padding: "0 20px", borderRadius: 12, cursor: "pointer",
            }}>검색</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {categories.map(cat => (
              <button key={cat.label} onClick={() => { setSearchQuery(cat.query); doSearch(cat.query); }}
                style={{
                  background: theme.bgCardHover, border: `1px solid ${theme.border}`,
                  borderRadius: 16, padding: "5px 14px", cursor: "pointer",
                  fontSize: 11, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = theme.text; e.currentTarget.style.borderColor = theme.borderHover; }}
                onMouseLeave={e => { e.currentTarget.style.color = theme.textMuted; e.currentTarget.style.borderColor = theme.border; }}
              >{cat.label}</button>
            ))}
          </div>
          {searching && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ width: 24, height: 24, border: `2px solid ${theme.textUltraFaint}`, borderTop: `2px solid ${theme.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
            </div>
          )}
          {!searching && searchResults.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
              {searchResults.map(r => (
                <button key={r.id} onClick={() => addItem(r.url)} style={{
                  background: "none", border: "2px solid transparent", borderRadius: 12,
                  overflow: "hidden", cursor: "pointer", padding: 0, aspectRatio: "4/3", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = moons[6].color + "60"; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <img src={r.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: 10 }} />
                </button>
              ))}
            </div>
          )}
          <button onClick={() => addItem(null)} style={{
            background: "transparent", border: `1px dashed ${theme.textUltraFaint}`,
            color: theme.textFaint, fontSize: 12, fontFamily: "'DM Sans', sans-serif",
            padding: "10px 20px", borderRadius: 10, cursor: "pointer", width: "100%",
          }}>이미지 없이 텍스트만 추가</button>
        </div>
      )}

      {/* Vision Grid */}
      {hasItems && (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 14,
          }}>
            {items.map((it, i) => (
              <div key={it.id} style={{
                background: theme.bgCard, border: `1px solid ${theme.border}`,
                borderRadius: 18, overflow: "hidden", transition: "all 0.3s",
                animation: `fadeSlideUp 0.3s ease ${i * 0.04}s both`,
                position: "relative",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = it.color + "35"; e.currentTarget.style.transform = "translateY(-3px)"; (e.currentTarget.querySelector('.del-btn') as HTMLElement).style.opacity = "1"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "translateY(0)"; (e.currentTarget.querySelector('.del-btn') as HTMLElement).style.opacity = "0"; }}
              >
                {it.image && (
                  <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
                    <img src={it.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                )}
                <div style={{ padding: it.image ? "14px 18px 16px" : "24px 20px" }}>
                  <div style={{ display: "flex", alignItems: "start", gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: it.color, marginTop: 6, flexShrink: 0 }} />
                    <input value={it.text} placeholder="비전을 입력..."
                      onChange={e => setItems(items.map(x => x.id === it.id ? { ...x, text: e.target.value } : x))}
                      style={{
                        background: "transparent", border: "none", outline: "none",
                        color: theme.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                        width: "100%", lineHeight: 1.5,
                      }} />
                  </div>
                </div>
                <button className="del-btn" onClick={() => removeItem(it.id)} style={{
                  position: "absolute", top: 8, right: 8, width: 24, height: 24, borderRadius: "50%",
                  background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
                  border: "none", color: "rgba(255,255,255,0.7)", fontSize: 11,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.2s",
                }}>✕</button>
                {!it.image && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${it.color}40, transparent)` }} />
                )}
              </div>
            ))}
          </div>

          {/* Reset button */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button onClick={() => setItems([])} style={{
              background: "transparent", border: "none",
              color: theme.textFaint, fontSize: 12, fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer", padding: "8px 16px", transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = theme.textMuted}
            onMouseLeave={e => e.currentTarget.style.color = theme.textFaint}
            >패키지 다시 선택하기</button>
          </div>
        </>
      )}
    </div>
  );
}
