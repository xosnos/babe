import { createContext, useContext, useReducer, useMemo, ReactNode } from 'react'
import type { ApplicationState, AppAction } from '../types'
import { appReducer } from './reducers'

// ──────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ──────────────────────────────────────────────────────────

interface AppContextType {
  state: ApplicationState
  dispatch: (action: AppAction) => void
}

// ──────────────────────────────────────────────────────────
// CONTEXT CREATION
// ──────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined)

// ──────────────────────────────────────────────────────────
// INITIAL STATE
// ──────────────────────────────────────────────────────────

export function getInitialState(): ApplicationState {
  return {
    phase: 'valentine-prompt',
    valentineAccepted: false,
    valentinePrompt: {
      noButtonClickCount: 0,
      yesButtonScale: 1,
      noButtonScale: 1,
      noButtonVisible: true,
      showSuccessAnimation: false,
      currentMessage: '',
      wiggle: false,
    },
    dashboard: {
      pomodoroTimer: {
        duration: 25 * 60, // 25 minutes default
        remainingTime: 25 * 60,
        isRunning: false,
        isPaused: false,
      },
      foodTimer: {
        duration: 3 * 60, // 3 minutes default
        remainingTime: 3 * 60,
        isRunning: false,
        isPaused: false,
      },
      wellnessReminder: {
        currentReminder: null,
        nextReminderTime: null,
        isVisible: false,
        isScheduled: false,
      },
    },
  }
}

// ──────────────────────────────────────────────────────────
// PROVIDER COMPONENT
// ──────────────────────────────────────────────────────────

interface AppProviderProps {
  children: ReactNode
  initialState?: Partial<ApplicationState>
}

export function AppProvider({ children, initialState }: AppProviderProps) {
  const defaultState = getInitialState()
  const mergedState = initialState ? { ...defaultState, ...initialState } : defaultState

  const [state, dispatch] = useReducer(appReducer, mergedState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// ──────────────────────────────────────────────────────────
// CUSTOM HOOKS
// ──────────────────────────────────────────────────────────

/**
 * Hook to access the app state and dispatch function
 * Must be used within an AppProvider
 */
export function useAppState(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider')
  }
  return context
}

/**
 * Hook to access only the state
 */
export function useAppStateValue(): ApplicationState {
  return useAppState().state
}

/**
 * Hook to access only the dispatch function
 */
export function useAppDispatch(): (action: AppAction) => void {
  return useAppState().dispatch
}

/**
 * Hook to access valentine prompt state
 */
export function useValentinePromptState() {
  const { state } = useAppState()
  return state.valentinePrompt
}

/**
 * Hook to access dashboard state
 */
export function useDashboardState() {
  const { state } = useAppState()
  return state.dashboard
}

/**
 * Hook to access pomodoro timer state
 */
export function usePomodoroTimerState() {
  const { state } = useAppState()
  return state.dashboard.pomodoroTimer
}

/**
 * Hook to access food timer state
 */
export function useFoodTimerState() {
  const { state } = useAppState()
  return state.dashboard.foodTimer
}

/**
 * Hook to access wellness reminder state
 */
export function useWellnessReminderState() {
  const { state } = useAppState()
  return state.dashboard.wellnessReminder
}

/**
 * Hook to access current phase
 */
export function useAppPhase() {
  const { state } = useAppState()
  return state.phase
}

/**
 * Hook to check if valentine was accepted
 */
export function useValentineAccepted() {
  const { state } = useAppState()
  return state.valentineAccepted
}

// ──────────────────────────────────────────────────────────
// DISPATCH HELPERS (Optional, for cleaner usage)
// ──────────────────────────────────────────────────────────

/**
 * Helper to dispatch an action
 */
export function useDispatchAction() {
  const { dispatch } = useAppState()

  return useMemo(() => ({
    // Valentine Prompt Actions
    noButtonClicked: () => dispatch({ type: 'NO_BUTTON_CLICKED' }),
    yesButtonClicked: () => dispatch({ type: 'YES_BUTTON_CLICKED' }),
    animationComplete: () => dispatch({ type: 'ANIMATION_COMPLETE' }),
    setValentineMessage: (message: string) =>
      dispatch({ type: 'SET_VALENTINE_MESSAGE', payload: message }),
    setWiggle: (wiggle: boolean) => dispatch({ type: 'SET_WIGGLE', payload: wiggle }),

    // Pomodoro Timer Actions
    pomodoroStart: () => dispatch({ type: 'POMODORO_START' }),
    pomodoroPause: () => dispatch({ type: 'POMODORO_PAUSE' }),
    pomodoroResume: () => dispatch({ type: 'POMODORO_RESUME' }),
    pomodoroReset: () => dispatch({ type: 'POMODORO_RESET' }),
    pomodoroTick: () => dispatch({ type: 'POMODORO_TICK' }),
    pomodoroSetDuration: (seconds: number) =>
      dispatch({ type: 'POMODORO_SET_DURATION', payload: seconds }),
    pomodoroSetPreset: (preset: string) =>
      dispatch({ type: 'POMODORO_SET_PRESET', payload: preset }),

    // Food Timer Actions
    foodStart: () => dispatch({ type: 'FOOD_START' }),
    foodPause: () => dispatch({ type: 'FOOD_PAUSE' }),
    foodResume: () => dispatch({ type: 'FOOD_RESUME' }),
    foodReset: () => dispatch({ type: 'FOOD_RESET' }),
    foodTick: () => dispatch({ type: 'FOOD_TICK' }),
    foodSetDuration: (seconds: number) =>
      dispatch({ type: 'FOOD_SET_DURATION', payload: seconds }),
    foodSetPreset: (preset: string) =>
      dispatch({ type: 'FOOD_SET_PRESET', payload: preset }),

    // Wellness Reminder Actions
    wellnessShowReminder: (reminder: any) =>
      dispatch({ type: 'WELLNESS_SHOW_REMINDER', payload: reminder }),
    wellnessDismissReminder: () => dispatch({ type: 'WELLNESS_DISMISS_REMINDER' }),
    wellnessScheduleNext: () => dispatch({ type: 'WELLNESS_SCHEDULE_NEXT' }),
    wellnessCheckHours: () => dispatch({ type: 'WELLNESS_CHECK_HOURS' }),
  }), [dispatch])
}
