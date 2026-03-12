import { NextRequest, NextResponse } from "next/server";

// 보안: API Key는 서버 사이드에서만 접근 — 클라이언트 노출 없음
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { type, goal } = await request.json();

    if (!goal || typeof goal !== "string" || goal.length > 500) {
      return NextResponse.json(
        { error: "Invalid goal parameter" },
        { status: 400 }
      );
    }

    let prompt: string;

    if (type === "mandalart") {
      prompt = `만다라트(Mandalart) 81칸을 채워줘. 핵심 목표: "${goal}"

8개 하위 테마와 각 테마별 8개 실행항목을 JSON으로 만들어줘.
테마는 이 순서의 영역에 맞게: 열정/실행, 창조/아이디어, 긍정/감사, 성장/재정, 집중/시스템, 통찰/철학, 비전/영성, 소통/관계

JSON만 출력. 다른 텍스트 없이:
{"core":"핵심목표","themes":[{"name":"테마명","items":["항목1","항목2","항목3","항목4","항목5","항목6","항목7","항목8"]},...]}`;
    } else if (type === "vision") {
      prompt = `비전보드를 만들려고 해. 나의 꿈/목표: "${goal}"

이 목표에 맞는 비전보드 항목 6개를 만들어줘. 각 항목은 시각적으로 상상 가능한 구체적인 장면이어야 해.

JSON만 출력 (다른 텍스트 없이):
{"visions":[{"text":"비전 문장","query":"english image search keywords 3words"}]}`;
    } else {
      return NextResponse.json(
        { error: "Invalid type. Use 'mandalart' or 'vision'" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", errorText);
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data.content
      .map((item: { text?: string }) => item.text || "")
      .join("\n");
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI content" },
      { status: 500 }
    );
  }
}
