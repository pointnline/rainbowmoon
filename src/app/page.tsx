"use client";

import { useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { LoginPage } from "@/components/layout/LoginPage";
import { NavBar } from "@/components/layout/NavBar";
import { CosmicBackground } from "@/components/layout/CosmicBackground";
import { Dashboard } from "@/components/features/dashboard/Dashboard";
import { Mandalart } from "@/components/features/mandalart/Mandalart";
import { Goals } from "@/components/features/goals/Goals";
import { Habits } from "@/components/features/habits/Habits";
import { Journal } from "@/components/features/journal/Journal";
import { VisionBoard } from "@/components/features/vision/VisionBoard";
import type { PageId } from "@/types";

function AppContent() {
  const { user, login } = useAuth();
  const { theme } = useTheme();
  const [page, setPage] = useState<PageId>("dashboard");

  // 미인증 → 로그인 페이지
  if (!user) {
    return <LoginPage onLogin={login} />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard setPage={setPage} />;
      case "mandalart":
        return <Mandalart />;
      case "goals":
        return <Goals />;
      case "habits":
        return <Habits />;
      case "journal":
        return <Journal />;
      case "vision":
        return <VisionBoard />;
      default:
        return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <>
      <style>{`
        body { background: ${theme.bg}; }
        ::selection { background: ${theme.selection}; }
        ::-webkit-scrollbar-thumb { background: ${theme.scrollThumb}; }
        input::placeholder, textarea::placeholder { color: ${theme.textFaint} !important; }
      `}</style>
      <CosmicBackground />
      <div style={{ position: "relative", zIndex: 1, display: "flex", minHeight: "100vh" }}>
        <NavBar page={page} setPage={setPage} />
        <main style={{ marginLeft: 72, flex: 1, minHeight: "100vh", overflowY: "auto" }}>
          {renderPage()}
        </main>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
