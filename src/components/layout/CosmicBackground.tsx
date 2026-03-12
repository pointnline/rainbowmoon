"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// 시드 기반 유사 난수 생성 — SSR/CSR 간 hydration 불일치 방지
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

interface Star {
  width: number;
  height: number;
  opacity: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
}

// 별 위치/크기를 인덱스 기반으로 결정적(deterministic)으로 생성
function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => {
    const r1 = seededRandom(i * 3 + 1);
    const r2 = seededRandom(i * 3 + 2);
    const r3 = seededRandom(i * 3 + 3);
    const r4 = seededRandom(i * 3 + 4);
    const size = i % 3 === 0 ? 2 : 1;
    return {
      width: size,
      height: size,
      opacity: 0.15 + r3 * 0.35,
      left: `${r1 * 100}%`,
      top: `${r2 * 100}%`,
      duration: 2 + r3 * 4,
      delay: r4 * 3,
    };
  });
}

const stars = generateStars(40);

export function CosmicBackground() {
  const { isDark } = useTheme();

  // 라이트 모드 — 미묘한 그라데이션 배경만 표시
  if (!isDark) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(91,77,199,0.04) 0%, transparent 50%), " +
              "radial-gradient(ellipse at 70% 70%, rgba(214,137,16,0.03) 0%, transparent 50%), " +
              "#FAF8F5",
          }}
        />
      </div>
    );
  }

  // 다크 모드 — 우주 배경 + 반짝이는 별
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(108,92,231,0.06) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 80% 20%, rgba(76,143,175,0.04) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 50% 80%, rgba(232,69,60,0.03) 0%, transparent 50%), " +
            "#0a0a0f",
        }}
      />
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: star.width,
            height: star.height,
            borderRadius: "50%",
            background: `rgba(255,255,255,${star.opacity})`,
            left: star.left,
            top: star.top,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
