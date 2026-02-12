// ── App Phase ────────────────────────────────────────────
export type AppPhase = 'valentine-prompt' | 'success-animation' | 'dashboard';

// ── Valentine Prompt ─────────────────────────────────────
export interface ValentinePromptState {
  noButtonClickCount: number;
  yesButtonScale: number;
  noButtonScale: number;
  noButtonVisible: boolean;
}

// ── Timer ────────────────────────────────────────────────
export interface TimerState {
  duration: number;
  remainingTime: number;
  isRunning: boolean;
  isPaused: boolean;
}

export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'SET_DURATION'; payload: number };

// ── Food Timer ───────────────────────────────────────────
export interface FoodPreset {
  name: string;
  duration: number;
  emoji: string;
}

export const FOOD_PRESETS: FoodPreset[] = [
  { name: 'Soft Boiled Egg', duration: 6 * 60, emoji: '🥚' },
  { name: 'Medium Boiled Egg', duration: 8 * 60, emoji: '🥚' },
  { name: 'Hard Boiled Egg', duration: 10 * 60, emoji: '🥚' },
  { name: 'Ramen Noodles', duration: 3 * 60, emoji: '🍜' },
];

// ── Wellness ─────────────────────────────────────────────
export type ReminderType = 'water' | 'breathing';

export interface WellnessMessage {
  type: ReminderType;
  message: string;
}

export const WELLNESS_MESSAGES: Record<ReminderType, string[]> = {
  water: [
    'Time to hydrate, babe! \u{1F4A7}',
    'Drink some water, Pookie \u{1F964}',
    'Stay hydrated, my love \u{1F499}',
    'Water break! Your body will thank you \u{1F4A6}',
  ],
  breathing: [
    'Take a deep breath \u{1F32C}\u{FE0F}',
    'Breathe in... breathe out... \u{1F9D8}',
    'Pause and breathe, you\'re doing great \u{1F4A8}',
    'Deep breaths for 30 seconds \u{2728}',
  ],
};

export const WORKING_HOURS = {
  start: { hour: 10, minute: 30 },
  end: { hour: 18, minute: 30 },
};

// ── External Links ───────────────────────────────────────
export interface ExternalLink {
  label: string;
  url: string;
  icon: string;
}

// ── Electron API ─────────────────────────────────────────
declare global {
  interface Window {
    electronAPI?: {
      openExternal: (url: string) => Promise<{ success: boolean; error?: string }>;
      showNotification: (title: string, body: string) => Promise<{ success: boolean; error?: string }>;
    };
  }
}
