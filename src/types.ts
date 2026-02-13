// ──────────────────────────────────────────────────────────
// CENTRALIZED STATE MANAGEMENT TYPES
// ──────────────────────────────────────────────────────────

// ── App Phase ────────────────────────────────────────────
export type AppPhase = 'valentine-prompt' | 'success-animation' | 'dashboard';

// ── Valentine Prompt State ───────────────────────────────
export interface ValentinePromptState {
  noButtonClickCount: number;
  yesButtonScale: number;
  noButtonScale: number;
  noButtonVisible: boolean;
  showSuccessAnimation: boolean;
  currentMessage: string;
  wiggle: boolean;
}

// ── Timer State (Shared by Pomodoro & Food) ──────────────
export interface TimerState {
  duration: number;
  remainingTime: number;
  isRunning: boolean;
  isPaused: boolean;
  startTime?: number; // Timestamp when timer started
}

export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'SET_DURATION'; payload: number };

// ── Food Timer Specific ───────────────────────────────────
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

// ── Wellness Reminder State ───────────────────────────────
export type ReminderType = 'water' | 'breathing';

export interface WellnessMessage {
  type: ReminderType;
  message: string;
}

export interface WellnessReminderState {
  currentReminder: WellnessMessage | null;
  nextReminderTime: number | null; // Unix timestamp
  isVisible: boolean;
  isScheduled: boolean;
}

export const WELLNESS_MESSAGES: Record<ReminderType, string[]> = {
  water: [
    'Time to hydrate, babe! 💧',
    'Drink some water, Pookie 🥤',
    'Stay hydrated, my love 💙',
    'Water break! Your body will thank you 💦',
  ],
  breathing: [
    'Take a deep breath 🌬️',
    'Breathe in... breathe out... 🧘',
    'Pause and breathe, you\'re doing great 💨',
    'Deep breaths for 30 seconds ✨',
  ],
};

export const WORKING_HOURS = {
  start: { hour: 10, minute: 30 },
  end: { hour: 18, minute: 30 },
};

// ── Dashboard State ───────────────────────────────────────
export interface DashboardState {
  pomodoroTimer: TimerState;
  pomodoroSelectedPreset?: string;
  foodTimer: TimerState;
  foodSelectedPreset?: string;
  wellnessReminder: WellnessReminderState;
}

// ── Root Application State ────────────────────────────────
export interface ApplicationState {
  phase: AppPhase;
  valentineAccepted: boolean;
  valentinePrompt: ValentinePromptState;
  dashboard: DashboardState;
}

// ── Persisted State (SQLite) ─────────────────────────────
export interface PersistedState {
  valentineAccepted: boolean;
  pomodoroDuration: number;
  lastFoodPreset: string | null;
}

// ── All Action Types ─────────────────────────────────────
export type AppAction =
  // Valentine Prompt Actions
  | { type: 'NO_BUTTON_CLICKED' }
  | { type: 'YES_BUTTON_CLICKED' }
  | { type: 'ANIMATION_COMPLETE' }
  | { type: 'SET_VALENTINE_MESSAGE'; payload: string }
  | { type: 'SET_WIGGLE'; payload: boolean }
  // Phase Transitions
  | { type: 'TRANSITION_TO_DASHBOARD' }
  | { type: 'RESET_TO_VALENTINE' }
  // Pomodoro Timer Actions
  | { type: 'POMODORO_START' }
  | { type: 'POMODORO_PAUSE' }
  | { type: 'POMODORO_RESUME' }
  | { type: 'POMODORO_RESET' }
  | { type: 'POMODORO_TICK' }
  | { type: 'POMODORO_SET_DURATION'; payload: number }
  | { type: 'POMODORO_SET_PRESET'; payload: string }
  // Food Timer Actions
  | { type: 'FOOD_START' }
  | { type: 'FOOD_PAUSE' }
  | { type: 'FOOD_RESUME' }
  | { type: 'FOOD_RESET' }
  | { type: 'FOOD_TICK' }
  | { type: 'FOOD_SET_DURATION'; payload: number }
  | { type: 'FOOD_SET_PRESET'; payload: string }
  // Wellness Reminder Actions
  | { type: 'WELLNESS_SHOW_REMINDER'; payload: WellnessMessage }
  | { type: 'WELLNESS_DISMISS_REMINDER' }
  | { type: 'WELLNESS_SCHEDULE_NEXT' }
  | { type: 'WELLNESS_CHECK_HOURS' }
  // Persistence Actions
  | { type: 'LOAD_PERSISTED_STATE'; payload: Partial<PersistedState> }
  // Batch/Reset Actions
  | { type: 'INITIALIZE_STATE' };

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
      saveState: (state: Partial<ApplicationState>) => Promise<{ success: boolean; error?: string }>;
      loadState: () => Promise<{ success: boolean; data?: Partial<ApplicationState>; error?: string }>;
    };
  }
}
