// ─── User ───
export interface User {
  name: string;
  email: string;
  provider: "google" | "email";
  avatar: string | null;
}

// ─── Theme ───
export interface Theme {
  bg: string;
  bgCard: string;
  bgCardHover: string;
  bgNav: string;
  border: string;
  borderHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textFaint: string;
  textUltraFaint: string;
  accent: string;
  accentSecondary: string;
  selection: string;
  scrollThumb: string;
  barDefault: (i: number) => string;
  barWeekend: (i: number) => string;
  inputBg: string;
  checkBg: string;
  checkBorder: string;
  moonBgAlpha: string;
  moonBorderAlpha: string;
  orbitRing: (i: number) => string;
  centerGlow: string;
  heroGradient: string;
  ctaPrimary: string;
  ctaPrimaryBorder: string;
  ctaPrimaryHover: string;
}

export interface MoonColor {
  id: string;
  label: string;
  meaning: string;
  area: string;
  color: string;
}

// ─── Mandalart ───
export interface MandalartTheme {
  name: string;
  items: string[];
}

export interface MandalartPackage {
  id: string;
  icon: string;
  label: string;
  desc: string;
  core: string;
  themes: MandalartTheme[];
}

// ─── Goals ───
export interface Action {
  text: string;
  done: boolean;
}

export interface SubGoal {
  text: string;
  actions: Action[];
}

export interface Goal {
  id: number;
  title: string;
  subgoals: SubGoal[];
}

// ─── Habits ───
export interface Habit {
  id: number;
  name: string;
  color: string;
  checkedDates: Record<string, boolean>;
}

// ─── Journal ───
export interface JournalEntry {
  id: number;
  date: string;
  gratitude: string;
  reflection: string;
  mood: number;
}

// ─── Vision ───
export interface VisionItem {
  id: number;
  text: string;
  image: string | null;
  color: string;
}

export interface VisionPackageVision {
  text: string;
  query: string;
}

export interface VisionPackage {
  id: string;
  icon: string;
  label: string;
  desc: string;
  visions: VisionPackageVision[];
}

// ─── AI ───
export interface AIMandalartResponse {
  core: string;
  themes: MandalartTheme[];
}

export interface AIVisionResponse {
  visions: VisionPackageVision[];
}

// ─── Navigation ───
export type PageId = "dashboard" | "vision" | "mandalart" | "goals" | "habits" | "journal";

export interface NavItem {
  id: PageId;
  label: string;
  phase: number;
}
