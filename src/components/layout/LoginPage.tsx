"use client";

import { useState } from "react";
import { GoogleIcon } from "@/components/ui/GoogleIcon";
import { MOON_COLORS } from "@/constants/themes";
import type { User } from "@/types";

// ─── 결정론적 난수 생성 (hydration mismatch 방지) ───
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Mode = "landing" | "login" | "signup";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<Mode>("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const moonColors = MOON_COLORS.dark;

  // ─── Fake Auth Handlers ───
  const handleGoogleLogin = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      onLogin({
        name: "Jay",
        email: "jay@pointnline.com",
        provider: "google",
        avatar: null,
      });
      setLoading(false);
    }, 1500);
  };

  const handleEmailLogin = () => {
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      onLogin({
        name: email.split("@")[0],
        email,
        provider: "email",
        avatar: null,
      });
      setLoading(false);
    }, 1200);
  };

  const handleSignup = () => {
    if (!name || !email || !password) {
      setError("모든 필드를 입력해주세요");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      onLogin({
        name,
        email,
        provider: "email",
        avatar: null,
      });
      setLoading(false);
    }, 1200);
  };

  // ─── Landing Page ───
  if (mode === "landing") {
    return (
      <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#0a0a0f" }}>
        {/* Deep space nebula background */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(108,92,231,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, rgba(72,61,139,0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 90% 70%, rgba(108,92,231,0.05) 0%, transparent 40%),
              radial-gradient(ellipse at 10% 90%, rgba(168,85,247,0.05) 0%, transparent 40%)
            `,
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: `
              radial-gradient(ellipse at 60% 40%, rgba(75,0,130,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 30% 70%, rgba(138,43,226,0.06) 0%, transparent 50%)
            `,
          }}
        />

        {/* 200 deterministic stars */}
        {Array.from({ length: 200 }).map((_, i) => {
          const left = pseudoRandom(i) * 100;
          const top = pseudoRandom(i + 200) * 100;
          const size = pseudoRandom(i + 400) * 2 + 0.5;
          const opacity = pseudoRandom(i + 600) * 0.6 + 0.1;
          const duration = pseudoRandom(i + 800) * 3 + 2;
          return (
            <div
              key={i}
              style={{
                position: "fixed",
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: "50%",
                background: "#fff",
                opacity,
                animation: `twinkle ${duration}s ease-in-out infinite`,
                animationDelay: `${pseudoRandom(i + 1000) * 5}s`,
              }}
            />
          );
        })}

        {/* Main content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          {/* Left side - Branding */}
          <div style={{ flex: 1, maxWidth: "560px", paddingRight: "80px" }}>
            {/* P·L branding */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6C5CE7, #A855F7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                P·L
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                }}
              >
                Point & Line
              </span>
            </div>

            {/* Heading with gradient text */}
            <h1
              style={{
                fontSize: "52px",
                fontWeight: 200,
                lineHeight: 1.2,
                marginBottom: "24px",
                letterSpacing: "-1px",
              }}
            >
              <span
                style={{
                  background: "linear-gradient(135deg, #fff 0%, rgba(168,85,247,0.8) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Create a<br />Good Life
              </span>
            </h1>

            {/* Philosophy quote */}
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.4)",
                fontWeight: 300,
                marginBottom: "40px",
                maxWidth: "400px",
              }}
            >
              점(선택)에서 시작해 선(실행)으로 이어가고,
              <br />
              면(결과)을 만들어 원(순환)으로 완성하세요.
            </p>

            {/* Philosophy dots */}
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {["점 · Point", "선 · Line", "면 · Plane", "원 · Circle"].map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: `rgba(168,85,247,${0.3 + i * 0.2})`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "1px",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Auth card */}
          <div
            style={{
              width: "420px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "24px",
              padding: "48px 40px",
              backdropFilter: "blur(20px)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 300,
                  color: "#fff",
                  marginBottom: "8px",
                }}
              >
                시작하기
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
                당신의 인생 설계를 시작하세요
              </p>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 400,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "12px",
                opacity: loading ? 0.6 : 1,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <GoogleIcon size={18} />
              {loading ? "연결 중..." : "Google로 시작하기"}
            </button>

            {/* Email Login */}
            <button
              onClick={() => setMode("login")}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "transparent",
                color: "rgba(255,255,255,0.5)",
                fontSize: "14px",
                fontWeight: 400,
                cursor: "pointer",
                marginBottom: "12px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              이메일로 로그인
            </button>

            {/* Signup */}
            <button
              onClick={() => setMode("signup")}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, rgba(108,92,231,0.25), rgba(168,85,247,0.15))",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 400,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(108,92,231,0.4), rgba(168,85,247,0.25))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(108,92,231,0.25), rgba(168,85,247,0.15))";
              }}
            >
              새 계정 만들기
            </button>

            {/* Divider */}
            <div
              style={{
                margin: "32px 0 24px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            />

            {/* 7 Moon dots */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              {moonColors.map((moon) => (
                <div
                  key={moon.id}
                  title={`${moon.label} — ${moon.meaning}`}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: moon.color,
                    opacity: 0.6,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "scale(1.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0.6";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Twinkle animation */}
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  // ─── Login / Signup Form ───
  const isSignup = mode === "signup";

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#0a0a0f" }}>
      {/* Nebula background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(108,92,231,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(72,61,139,0.08) 0%, transparent 50%)
          `,
        }}
      />

      {/* 120 deterministic stars */}
      {Array.from({ length: 120 }).map((_, i) => {
        const left = pseudoRandom(i + 50) * 100;
        const top = pseudoRandom(i + 250) * 100;
        const size = pseudoRandom(i + 450) * 2 + 0.5;
        const opacity = pseudoRandom(i + 650) * 0.6 + 0.1;
        const duration = pseudoRandom(i + 850) * 3 + 2;
        return (
          <div
            key={i}
            style={{
              position: "fixed",
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              background: "#fff",
              opacity,
              animation: `twinkle ${duration}s ease-in-out infinite`,
              animationDelay: `${pseudoRandom(i + 1050) * 5}s`,
            }}
          />
        );
      })}

      {/* Form container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "420px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "24px",
            padding: "48px 40px",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Back button */}
          <button
            onClick={() => {
              setMode("landing");
              setError("");
              setEmail("");
              setPassword("");
              setName("");
            }}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              fontSize: "14px",
              cursor: "pointer",
              padding: "0",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.4)";
            }}
          >
            ← 돌아가기
          </button>

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 300,
                color: "#fff",
                marginBottom: "8px",
              }}
            >
              {isSignup ? "계정 만들기" : "로그인"}
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
              {isSignup ? "Point & Line에 오신 것을 환영합니다" : "다시 오신 것을 환영합니다"}
            </p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 400,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "24px",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <GoogleIcon size={18} />
            {loading ? "연결 중..." : "Google로 계속하기"}
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>또는</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Name field (signup only) */}
          {isSignup && (
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                marginBottom: "12px",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(108,92,231,0.5)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            />
          )}

          {/* Email field */}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              marginBottom: "12px",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(108,92,231,0.5)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          />

          {/* Password field */}
          <input
            type="password"
            placeholder={isSignup ? "비밀번호 (6자 이상)" : "비밀번호"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              marginBottom: "20px",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(108,92,231,0.5)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                isSignup ? handleSignup() : handleEmailLogin();
              }
            }}
          />

          {/* Error display */}
          {error && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(232,69,60,0.1)",
                border: "1px solid rgba(232,69,60,0.2)",
                color: "#E8453C",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={isSignup ? handleSignup : handleEmailLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, rgba(108,92,231,0.4), rgba(168,85,247,0.3))",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "all 0.2s ease",
              marginBottom: "20px",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(108,92,231,0.6), rgba(168,85,247,0.45))";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(108,92,231,0.4), rgba(168,85,247,0.3))";
            }}
          >
            {loading ? "처리 중..." : isSignup ? "가입하기" : "로그인"}
          </button>

          {/* Toggle login/signup */}
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
              {isSignup ? "이미 계정이 있으신가요?" : "계정이 없으신가요?"}
            </span>
            <button
              onClick={() => {
                setMode(isSignup ? "login" : "signup");
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#A855F7",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                padding: "0",
                marginLeft: "6px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#c084fc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#A855F7";
              }}
            >
              {isSignup ? "로그인" : "가입하기"}
            </button>
          </div>
        </div>
      </div>

      {/* Twinkle animation */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
