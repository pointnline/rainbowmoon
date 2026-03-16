import { NextRequest, NextResponse } from "next/server";

// 보안: API Key는 서버 사이드에서만 접근
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { type } = body;

    // ─── Mandalart / Vision ───
    if (type === "mandalart" || type === "vision") {
      const { goal } = body;
      if (!goal || typeof goal !== "string" || goal.length > 500) {
        return NextResponse.json({ error: "Invalid goal parameter" }, { status: 400 });
      }

      let prompt: string;
      if (type === "mandalart") {
        prompt = `만다라트(Mandalart) 81칸을 채워줘. 핵심 목표: "${goal}"

8개 하위 테마와 각 테마별 8개 실행항목을 JSON으로 만들어줘.
테마는 이 순서의 영역에 맞게: 열정/실행, 창조/아이디어, 긍정/감사, 성장/재정, 집중/시스템, 통찰/철학, 비전/영성, 소통/관계

JSON만 출력. 다른 텍스트 없이:
{"core":"핵심목표","themes":[{"name":"테마명","items":["항목1","항목2","항목3","항목4","항목5","항목6","항목7","항목8"]},...]}`;
      } else {
        prompt = `비전보드를 만들려고 해. 나의 꿈/목표: "${goal}"

이 목표에 맞는 비전보드 항목 6개를 만들어줘. 각 항목은 시각적으로 상상 가능한 구체적인 장면이어야 해.

JSON만 출력 (다른 텍스트 없이):
{"visions":[{"text":"비전 문장","query":"english image search keywords 3words"}]}`;
      }

      const response = await callClaude(ANTHROPIC_API_KEY, {
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Anthropic API error:", err);
        return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
      }

      const data = await response.json();
      const text = data.content.map((i: { text?: string }) => i.text || "").join("\n");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      return NextResponse.json(parsed);
    }

    // ─── Chat (Moon AI) ───
    if (type === "chat") {
      const { messages, context } = body;
      if (!Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
      }

      // 사용자 데이터 기반 시스템 프롬프트 구성
      let system =
        "너는 RainbowMoon의 AI 파트너야. 따뜻하고 격려적인 톤으로 한국어로 대화해. " +
        "이모지를 적절히 사용하고 2~4문장으로 간결하게 답해줘. " +
        "부동산금융, 자기계발, AI/기술에 관심이 많은 바쁜 직장인에게 실질적인 조언을 해줘.";

      if (context) {
        const lines: string[] = [];
        if (context.mandalartCenter) lines.push(`핵심 목표: "${context.mandalartCenter}"`);
        if (Array.isArray(context.goals) && context.goals.length > 0) {
          const gs = (context.goals as { title: string; progress: string }[])
            .filter((g) => g.title)
            .map((g) => `"${g.title}"(${g.progress})`);
          if (gs.length) lines.push(`목표: ${gs.join(", ")}`);
        }
        if (Array.isArray(context.habits) && context.habits.length > 0) {
          const hs = (context.habits as { name: string; streak: number }[])
            .filter((h) => h.name)
            .map((h) => `${h.name}(연속 ${h.streak}일)`);
          if (hs.length) lines.push(`습관: ${hs.join(", ")}`);
        }
        if (Array.isArray(context.recentJournal) && context.recentJournal.length > 0) {
          const jr = context.recentJournal as { gratitude?: string; reflection?: string }[];
          lines.push(`최근 일기 ${jr.length}개 — 마지막 성찰: "${jr[0]?.reflection?.slice(0, 40) || ""}..."`);
        }
        if (context.visionCount) lines.push(`비전보드 ${context.visionCount}개`);
        if (lines.length > 0) {
          system += `\n\n[사용자 현황]\n${lines.join("\n")}\n\n위 데이터를 참고해서 개인화된 조언을 해줘.`;
        }
      }

      const response = await callClaude(ANTHROPIC_API_KEY, {
        max_tokens: 600,
        system,
        messages: (messages as { role: string; content: string }[]).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Anthropic API error:", err);
        return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
      }

      const data = await response.json();
      const message = data.content.map((i: { text?: string }) => i.text || "").join("");
      return NextResponse.json({ message });
    }

    return NextResponse.json(
      { error: "Invalid type. Use 'mandalart', 'vision', or 'chat'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json({ error: "Failed to generate AI content" }, { status: 500 });
  }
}

// Claude API 호출 헬퍼
function callClaude(apiKey: string, body: Record<string, unknown>) {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", ...body }),
  });
}
