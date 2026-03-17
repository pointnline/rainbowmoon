"use client";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { VisionItem } from "@/types";
import { VISION_PACKAGES } from "@/constants/vision-packages";
import { generateVision, VISION_FALLBACK } from "@/lib/ai";

export function VisionBoard() {
  const { theme, moons, isDark } = useTheme();
  const [items, setItems] = useLocalStorage<VisionItem[]>("rm_vision_items", []);
  const [showAdd, setShowAdd] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; url: string; thumb: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [newText, setNewText] = useState("");
  const [aiGoal, setAiGoal] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

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
      url: `https://picsum.photos/seed/${query.replace(/\s+/g, "")}_${i}/800/600`,
      thumb: `https://picsum.photos/seed/${query.replace(/\s+/g, "")}_${i}/200/150`,
    }));
    setTimeout(() => { setSearchResults(results); setSearching(false); }, 500);
  };

  const addItem = (imageUrl: string | null, text?: string) => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text: text || newText,
        image: imageUrl || null,
        color: moons[Math.floor(Math.random() * 7)].color,
      },
    ]);
    setNewText(""); setSearchResults([]); setSearchQuery(""); setShowAdd(false);
  };

  // 패키지에서 개별 비전 아이템 추가 (기존 보드에 추가)
  const addPackageItem = (text: string, query: string, colorIdx: number) => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text,
        image: `https://picsum.photos/seed/${query.replace(/\s+/g, "")}_0/800/600`,
        color: moons[colorIdx % 7].color,
      },
    ]);
  };

  const removeItem = (id: number) => setItems(items.filter((it) => it.id !== id));

  const handleAIGenerate = async () => {
    if (!aiGoal.trim()) return;
    setAiLoading(true);
    try {
      const parsed = await generateVision(aiGoal);
      if (parsed.visions && parsed.visions.length > 0) {
        const newVisions: VisionItem[] = parsed.visions.map((v, i) => ({
          id: Date.now() + i,
          text: v.text,
          image: `https://picsum.photos/seed/${v.query.replace(/\s+/g, "")}_0/800/600`,
          color: moons[i % 7].color,
        }));
        setItems((prev) => [...prev, ...newVisions]);
      }
    } catch {
      const fallback = VISION_FALLBACK(aiGoal);
      const newVisions: VisionItem[] = fallback.visions.map((v, i) => ({
        id: Date.now() + i, text: v.text,
        image: `https://picsum.photos/seed/${v.query.replace(/\s+/g, "")}_0/800/600`,
        color: moons[i % 7].color,
      }));
      setItems((prev) => [...prev, ...newVisions]);
    }
    setAiLoading(false);
    setAiGoal("");
  };

  const hasItems = items.length > 0;
  const rainbow = `conic-gradient(from 0deg, ${moons[0].color}, ${moons[1].color}, ${moons[2].color}, ${moons[3].color}, ${moons[4].color}, ${moons[5].color}, ${moons[6].color}, ${moons[0].color})`;

  // 전시 레이아웃: 첫 아이템은 크게, 나머지는 그리드
  const featuredItem = items[0];
  const galleryItems = items.slice(1);

  return (
    <div style={{ padding: "48px 56px", maxWidth: 1300 }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: moons[6].color }} />
          <span style={{ fontSize: 11, color: moons[6].color, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2, textTransform: "uppercase" }}>Violet Moon · Vision</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: theme.text, margin: 0, letterSpacing: -0.5 }}>Vision Gallery</h1>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: theme.textMuted, marginTop: 6, fontStyle: "italic" }}>당신의 꿈을 박물관처럼 전시하다</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {hasItems && (
              <button onClick={() => { setShowPackages(!showPackages); setShowAdd(false); }} style={{
                background: showPackages ? `${moons[5].color}18` : "transparent",
                border: `1px solid ${showPackages ? moons[5].color + "50" : theme.border}`,
                color: showPackages ? moons[5].color : theme.textMuted,
                fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                padding: "9px 20px", borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
              }}>패키지 둘러보기</button>
            )}
            <button onClick={() => { setShowAdd(!showAdd); setShowPackages(false); }} style={{
              background: showAdd ? `${moons[6].color}20` : `${moons[6].color}10`,
              border: `1px solid ${moons[6].color}${showAdd ? "50" : "30"}`,
              color: moons[6].color, fontSize: 12, fontFamily: "'DM Sans', sans-serif",
              padding: "9px 20px", borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
            }}>{showAdd ? "닫기" : "+ 비전 추가"}</button>
          </div>
        </div>
      </div>

      {/* AI 생성 바 (항상 노출) */}
      <div style={{
        background: isDark ? `linear-gradient(135deg, ${moons[6].color}08, ${moons[5].color}05)` : `linear-gradient(135deg, ${moons[6].color}06, ${moons[5].color}04)`,
        border: `1px solid ${moons[6].color}18`,
        borderRadius: 20, padding: "20px 28px", marginBottom: 28,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12, background: rainbow,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, color: "#fff", flexShrink: 0,
        }}>✦</div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 14, padding: "0 16px" }}>
          <input value={aiGoal} onChange={(e) => setAiGoal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAIGenerate(); }}
            placeholder="꿈을 입력하면 AI가 비전보드를 채워드립니다  (예: 40대에 세계 일주, 작가로 독립...)"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: theme.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: "12px 0" }} />
        </div>
        <button onClick={handleAIGenerate} disabled={aiLoading || !aiGoal.trim()} style={{
          background: `linear-gradient(135deg, ${moons[6].color}35, ${moons[5].color}25)`,
          border: `1px solid ${moons[6].color}45`,
          color: theme.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
          padding: "0 22px", height: 42, borderRadius: 14, cursor: "pointer",
          fontWeight: 500, opacity: aiLoading || !aiGoal.trim() ? 0.5 : 1,
          display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
          transition: "all 0.2s",
        }}>
          {aiLoading ? (
            <><div style={{ width: 14, height: 14, border: `2px solid ${theme.textFaint}`, borderTop: `2px solid ${moons[6].color}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />생성 중...</>
          ) : "AI 생성"}
        </button>
      </div>

      {/* 패키지 패널 */}
      {showPackages && (
        <div style={{
          background: theme.bgCard, border: `1px solid ${theme.border}`,
          borderRadius: 24, padding: "32px 36px", marginBottom: 32,
          animation: "fadeSlideUp 0.3s ease both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 400, color: theme.text, margin: 0 }}>추천 비전 패키지</h3>
            <span style={{ fontSize: 11, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif" }}>— 개별 항목을 내 비전보드에 추가하세요</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {VISION_PACKAGES.map((pkg, pi) => (
              <div key={pkg.id} style={{
                background: theme.bg, border: `1px solid ${theme.border}`,
                borderRadius: 18, padding: "22px 22px 16px", transition: "all 0.25s",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${moons[pi % 7].color}40, transparent)` }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 22 }}>{pkg.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 500, color: theme.text }}>{pkg.label}</div>
                    <div style={{ fontSize: 10, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>{pkg.desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {pkg.visions.map((v, vi) => {
                    const alreadyAdded = items.some((it) => it.text === v.text);
                    return (
                      <div key={vi} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 12px", borderRadius: 10,
                        background: alreadyAdded ? `${moons[(pi + vi) % 7].color}10` : theme.bgCardHover,
                        border: `1px solid ${alreadyAdded ? moons[(pi + vi) % 7].color + "30" : "transparent"}`,
                        gap: 8,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: moons[(pi + vi) % 7].color, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: theme.textSecondary, fontFamily: "'DM Sans', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.text}</span>
                        </div>
                        <button
                          onClick={() => !alreadyAdded && addPackageItem(v.text, v.query, pi + vi)}
                          disabled={alreadyAdded}
                          style={{
                            background: alreadyAdded ? "transparent" : `${moons[(pi + vi) % 7].color}20`,
                            border: `1px solid ${alreadyAdded ? "transparent" : moons[(pi + vi) % 7].color + "40"}`,
                            color: alreadyAdded ? theme.textFaint : moons[(pi + vi) % 7].color,
                            fontSize: 10, fontFamily: "'DM Sans', sans-serif",
                            padding: "4px 10px", borderRadius: 8, cursor: alreadyAdded ? "default" : "pointer",
                            flexShrink: 0, transition: "all 0.2s", fontWeight: 500,
                          }}
                        >{alreadyAdded ? "✓ 추가됨" : "+ ADD"}</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 비전 추가 패널 */}
      {showAdd && (
        <div style={{
          background: theme.bgCard, border: `1px solid ${theme.border}`,
          borderRadius: 20, padding: "28px 32px", marginBottom: 32,
          animation: "fadeSlideUp 0.3s ease both",
        }}>
          <input value={newText} onChange={(e) => setNewText(e.target.value)}
            placeholder="비전을 한 줄로 적어보세요..."
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: theme.text, fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, marginBottom: 20, padding: 0 }} />
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", background: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "0 14px" }}>
              <span style={{ color: theme.textFaint, fontSize: 13, marginRight: 8 }}>⌕</span>
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") doSearch(searchQuery); }}
                placeholder="이미지 검색..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: theme.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: "11px 0" }} />
            </div>
            <button onClick={() => doSearch(searchQuery)} style={{ background: `${theme.accent}20`, border: `1px solid ${theme.accent}35`, color: theme.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: "0 20px", borderRadius: 12, cursor: "pointer" }}>검색</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {categories.map((cat) => (
              <button key={cat.label} onClick={() => { setSearchQuery(cat.query); doSearch(cat.query); }}
                style={{ background: theme.bgCardHover, border: `1px solid ${theme.border}`, borderRadius: 16, padding: "5px 14px", cursor: "pointer", fontSize: 11, color: theme.textMuted, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = theme.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = theme.textMuted; }}
              >{cat.label}</button>
            ))}
          </div>
          {searching && <div style={{ textAlign: "center", padding: "20px 0" }}><div style={{ width: 22, height: 22, border: `2px solid ${theme.textUltraFaint}`, borderTop: `2px solid ${theme.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} /></div>}
          {!searching && searchResults.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
              {searchResults.map((r) => (
                <button key={r.id} onClick={() => addItem(r.url)} style={{ background: "none", border: "2px solid transparent", borderRadius: 10, overflow: "hidden", cursor: "pointer", padding: 0, aspectRatio: "4/3", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = moons[6].color + "60"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; }}
                ><img src={r.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: 8 }} /></button>
              ))}
            </div>
          )}
          <button onClick={() => addItem(null)} style={{ background: "transparent", border: `1px dashed ${theme.textUltraFaint}`, color: theme.textFaint, fontSize: 12, fontFamily: "'DM Sans', sans-serif", padding: "10px 20px", borderRadius: 10, cursor: "pointer", width: "100%" }}>이미지 없이 텍스트만 추가</button>
        </div>
      )}

      {/* 빈 상태 */}
      {!hasItems && !showAdd && !showPackages && (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: rainbow, margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>✦</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: theme.text, marginBottom: 10 }}>당신의 비전 갤러리를 채워보세요</h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: theme.textMuted, fontStyle: "italic", marginBottom: 40 }}>꿈을 시각화하면 현실이 됩니다</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => setShowPackages(true)} style={{
              background: `${moons[5].color}15`, border: `1px solid ${moons[5].color}35`,
              color: moons[5].color, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              padding: "12px 28px", borderRadius: 14, cursor: "pointer", transition: "all 0.2s",
            }}>추천 패키지 보기</button>
            <button onClick={() => setShowAdd(true)} style={{
              background: `${moons[6].color}15`, border: `1px solid ${moons[6].color}35`,
              color: moons[6].color, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              padding: "12px 28px", borderRadius: 14, cursor: "pointer", transition: "all 0.2s",
            }}>직접 추가하기</button>
          </div>
        </div>
      )}

      {/* ── 박물관 갤러리 레이아웃 ── */}
      {hasItems && (
        <div>
          {/* 전시 제목 라인 */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${theme.border}, transparent)` }} />
            <span style={{ fontSize: 10, color: theme.textFaint, fontFamily: "'DM Sans', sans-serif", letterSpacing: 3, textTransform: "uppercase" }}>Gallery · {items.length} Visions</span>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, ${theme.border})` }} />
          </div>

          {/* Feature: 첫 비전 — 대형 전시 */}
          <div style={{
            position: "relative", borderRadius: 28, overflow: "hidden",
            marginBottom: 20, cursor: "pointer",
            boxShadow: isDark ? `0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px ${featuredItem.color}20` : `0 24px 60px rgba(0,0,0,0.15), 0 0 0 1px ${featuredItem.color}20`,
            transition: "transform 0.4s ease, box-shadow 0.4s ease",
          }}
          onClick={() => setExpandedItem(expandedItem === featuredItem.id ? null : featuredItem.id)}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.005)"; e.currentTarget.style.boxShadow = isDark ? `0 32px 100px rgba(0,0,0,0.8), 0 0 0 1px ${featuredItem.color}35` : `0 32px 80px rgba(0,0,0,0.2), 0 0 0 1px ${featuredItem.color}35`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = isDark ? `0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px ${featuredItem.color}20` : `0 24px 60px rgba(0,0,0,0.15), 0 0 0 1px ${featuredItem.color}20`; }}
          >
            {featuredItem.image ? (
              <>
                <img src={featuredItem.image} alt="" style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
                {/* 드라마틱 오버레이 */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)" }} />
                <div style={{ position: "absolute", top: 20, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: featuredItem.color }} />
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 2 }}>VISION No.01</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeItem(featuredItem.id); }} style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", border: "none", borderRadius: "50%", width: 28, height: 28, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 36px 32px" }}>
                  <input value={featuredItem.text} placeholder="비전을 입력..."
                    onChange={(e) => { e.stopPropagation(); setItems(items.map((x) => x.id === featuredItem.id ? { ...x, text: e.target.value } : x)); }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 28, fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, width: "100%", letterSpacing: -0.5, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }} />
                  <div style={{ width: 48, height: 2, background: featuredItem.color, marginTop: 14, borderRadius: 1 }} />
                </div>
              </>
            ) : (
              <div style={{ height: 280, background: `linear-gradient(135deg, ${featuredItem.color}18, ${moons[(items.indexOf(featuredItem) + 1) % 7].color}10)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 48px", position: "relative" }}>
                <div style={{ position: "absolute", top: 20, right: 20 }}>
                  <button onClick={(e) => { e.stopPropagation(); removeItem(featuredItem.id); }} style={{ background: `${theme.bg}80`, backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", width: 28, height: 28, color: theme.textFaint, cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${featuredItem.color}20`, border: `1px solid ${featuredItem.color}40`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: featuredItem.color }} />
                </div>
                <input value={featuredItem.text} placeholder="비전을 입력..."
                  onChange={(e) => { e.stopPropagation(); setItems(items.map((x) => x.id === featuredItem.id ? { ...x, text: e.target.value } : x)); }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ background: "transparent", border: "none", outline: "none", color: theme.text, fontSize: 28, fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, textAlign: "center", width: "100%" }} />
              </div>
            )}
          </div>

          {/* 갤러리 그리드: 나머지 아이템들 */}
          {galleryItems.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
              marginBottom: 32,
            }}>
              {galleryItems.map((it, i) => (
                <div key={it.id} style={{
                  position: "relative", borderRadius: 20, overflow: "hidden",
                  background: theme.bgCard, border: `1px solid ${theme.border}`,
                  transition: "all 0.35s ease",
                  animation: `fadeSlideUp 0.4s ease ${i * 0.06}s both`,
                  boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = it.color + "45";
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = isDark ? `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${it.color}25` : `0 20px 48px rgba(0,0,0,0.14), 0 0 0 1px ${it.color}25`;
                  const delBtn = e.currentTarget.querySelector(".del-btn") as HTMLElement;
                  if (delBtn) delBtn.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.08)";
                  const delBtn = e.currentTarget.querySelector(".del-btn") as HTMLElement;
                  if (delBtn) delBtn.style.opacity = "0";
                }}
                >
                  {it.image && (
                    <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", position: "relative" }}>
                      <img src={it.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                    </div>
                  )}
                  {!it.image && (
                    <div style={{ height: 8, background: `linear-gradient(90deg, ${it.color}, ${moons[(i + 2) % 7].color})` }} />
                  )}
                  <div style={{ padding: it.image ? "16px 20px 20px" : "24px 22px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: it.color, marginTop: 8, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <input value={it.text} placeholder="비전을 입력..."
                          onChange={(e) => setItems(items.map((x) => x.id === it.id ? { ...x, text: e.target.value } : x))}
                          style={{ background: "transparent", border: "none", outline: "none", color: theme.text, fontSize: 15, fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, width: "100%", lineHeight: 1.55 }} />
                        <div style={{ fontSize: 9, color: theme.textFaint, fontFamily: "'DM Sans', sans-serif", marginTop: 8, letterSpacing: 1.5, textTransform: "uppercase" }}>Vision No.{String(i + 2).padStart(2, "0")}</div>
                      </div>
                    </div>
                  </div>
                  <button className="del-btn" onClick={() => removeItem(it.id)} style={{
                    position: "absolute", top: 10, right: 10,
                    width: 26, height: 26, borderRadius: "50%",
                    background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
                    border: "none", color: "rgba(255,255,255,0.7)", fontSize: 10,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity 0.2s",
                  }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* 하단 패키지 둘러보기 / 초기화 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
            <button onClick={() => { setShowPackages(true); setShowAdd(false); }} style={{ background: "transparent", border: `1px dashed ${theme.textUltraFaint}`, color: theme.textFaint, fontSize: 12, fontFamily: "'DM Sans', sans-serif", padding: "10px 20px", borderRadius: 12, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.textMuted; e.currentTarget.style.color = theme.textMuted; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.textUltraFaint; e.currentTarget.style.color = theme.textFaint; }}
            >+ 패키지에서 더 추가</button>
            <button onClick={() => setItems([])} style={{ background: "transparent", border: "none", color: theme.textFaint, fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", padding: "10px 16px", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#E8453C"}
              onMouseLeave={(e) => e.currentTarget.style.color = theme.textFaint}
            >전체 초기화</button>
          </div>
        </div>
      )}
    </div>
  );
}
