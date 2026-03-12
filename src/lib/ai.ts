import type { AIMandalartResponse, AIVisionResponse } from "@/types";

// 서버 API Route를 경유하여 AI 호출 — 클라이언트에 API Key 노출 없음
export async function generateMandalart(
  goal: string
): Promise<AIMandalartResponse> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "mandalart", goal }),
  });

  if (!res.ok) {
    throw new Error(`AI request failed: ${res.status}`);
  }

  return res.json();
}

export async function generateVision(
  goal: string
): Promise<AIVisionResponse> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "vision", goal }),
  });

  if (!res.ok) {
    throw new Error(`AI request failed: ${res.status}`);
  }

  return res.json();
}

// AI 실패 시 폴백 데이터
export const MANDALART_FALLBACK = (goal: string) => ({
  core: goal,
  themes: [
    { name: "실행 계획", items: ["단기 목표 설정", "주간 액션", "우선순위 정리", "데드라인 관리", "진행 상황 체크", "장애물 파악", "리소스 확보", "성과 측정"] },
    { name: "역량 개발", items: ["핵심 스킬 파악", "학습 계획", "실전 연습", "피드백 수집", "전문가 조언", "관련 자격증", "트렌드 파악", "포트폴리오"] },
    { name: "긍정 에너지", items: ["감사 일기", "작은 성공 축하", "긍정 확언", "스트레스 관리", "취미 활동", "자연 속 시간", "웃음 찾기", "음악 감상"] },
    { name: "재정 관리", items: ["예산 수립", "저축 목표", "투자 계획", "수입 다각화", "지출 최적화", "재무 학습", "전문가 상담", "장기 자산 설계"] },
    { name: "시스템 구축", items: ["루틴 설계", "도구 선정", "자동화 도입", "기록 시스템", "리뷰 체계", "우선순위 체계", "집중 환경", "효율화"] },
    { name: "자기 성찰", items: ["주간 회고", "가치관 점검", "강점 활용", "약점 보완", "감정 관리", "명상 실천", "저널링", "철학 공부"] },
    { name: "비전 설계", items: ["장기 목표", "비전보드", "롤모델 연구", "미션 정의", "꿈 목록", "이상적 하루", "비전 시각화", "미래 일기"] },
    { name: "관계·소통", items: ["핵심 인맥 관리", "소통 스킬", "경청 연습", "네트워킹", "멘토 관계", "팀워크", "감사 표현", "갈등 해결"] },
  ],
});

export const VISION_FALLBACK = (goal: string) => ({
  visions: [
    { text: `${goal}을 이룬 나의 모습`, query: "success achievement" },
    { text: "목표를 향해 달려가는 매일", query: "morning routine productive" },
    { text: "성장하는 나를 위한 학습", query: "study learning focus" },
    { text: "건강한 몸과 마음", query: "health fitness energy" },
    { text: "사랑하는 사람들과의 시간", query: "family friends together" },
    { text: "꿈꾸던 공간에서의 하루", query: "dream workspace modern" },
  ],
});
