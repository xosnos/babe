import type { AppAction, ApplicationState, TimerState } from '../types'
import { WORKING_HOURS } from '../types'

const CUTE_MESSAGES = [
  'Are you sure? 🥺',
  'Pretty please? 💕',
  'Think again! 💭',
  'But I love you! 💗',
  'One more chance? 🌸',
  "Don't break my heart! 💔",
  'You know you want to! ✨',
  'The Yes button is growing! 👀',
  'Just say yes! 💝',
  'I made this for you! 🎀',
]

function reduceTimer(timer: TimerState, action: AppAction): TimerState {
  switch (action.type) {
    case 'POMODORO_START':
    case 'FOOD_START':
      if (timer.remainingTime <= 0) {
        return timer
      }
      return { ...timer, isRunning: true, isPaused: false }
    case 'POMODORO_PAUSE':
    case 'FOOD_PAUSE':
      return { ...timer, isRunning: false, isPaused: true }
    case 'POMODORO_RESUME':
    case 'FOOD_RESUME':
      if (timer.remainingTime <= 0) {
        return timer
      }
      return { ...timer, isRunning: true, isPaused: false }
    case 'POMODORO_RESET':
    case 'FOOD_RESET':
      return { ...timer, remainingTime: timer.duration, isRunning: false, isPaused: false }
    case 'POMODORO_TICK':
    case 'FOOD_TICK': {
      if (!timer.isRunning || timer.remainingTime <= 0) {
        return timer
      }
      const nextRemaining = Math.max(0, timer.remainingTime - 1)
      return {
        ...timer,
        remainingTime: nextRemaining,
        isRunning: nextRemaining > 0,
        isPaused: false,
      }
    }
    case 'POMODORO_SET_DURATION':
    case 'FOOD_SET_DURATION': {
      const seconds = Math.max(0, action.payload)
      return { ...timer, duration: seconds, remainingTime: seconds, isRunning: false, isPaused: false }
    }
    default:
      return timer
  }
}

function isWithinWorkingHours(now: Date): boolean {
  const minutes = now.getHours() * 60 + now.getMinutes()
  const start = WORKING_HOURS.start.hour * 60 + WORKING_HOURS.start.minute
  const end = WORKING_HOURS.end.hour * 60 + WORKING_HOURS.end.minute
  return minutes >= start && minutes < end
}

export function appReducer(state: ApplicationState, action: AppAction): ApplicationState {
  switch (action.type) {
    case 'NO_BUTTON_CLICKED': {
      const noButtonClickCount = Math.min(10, state.valentinePrompt.noButtonClickCount + 1)
      return {
        ...state,
        valentinePrompt: {
          ...state.valentinePrompt,
          noButtonClickCount,
          yesButtonScale: 1 + noButtonClickCount * 0.1,
          noButtonScale: Math.max(0, 1 - noButtonClickCount * 0.1),
          noButtonVisible: noButtonClickCount < 10,
          currentMessage: CUTE_MESSAGES[Math.min(noButtonClickCount - 1, CUTE_MESSAGES.length - 1)],
          wiggle: true,
        },
      }
    }
    case 'YES_BUTTON_CLICKED':
      return {
        ...state,
        valentineAccepted: true,
        phase: 'success-animation',
        valentinePrompt: { ...state.valentinePrompt, showSuccessAnimation: true },
      }
    case 'SET_PHASE':
      return {
        ...state,
        phase: action.payload,
      }
    case 'ANIMATION_COMPLETE':
      return {
        ...state,
        phase: 'dashboard',
        valentinePrompt: { ...state.valentinePrompt, showSuccessAnimation: false, wiggle: false },
      }
    case 'SET_VALENTINE_MESSAGE':
      return {
        ...state,
        valentinePrompt: { ...state.valentinePrompt, currentMessage: action.payload },
      }
    case 'SET_WIGGLE':
      return {
        ...state,
        valentinePrompt: { ...state.valentinePrompt, wiggle: action.payload },
      }
    case 'RESET_TO_VALENTINE':
      return {
        ...state,
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
      }
    case 'POMODORO_START':
    case 'POMODORO_PAUSE':
    case 'POMODORO_RESUME':
    case 'POMODORO_RESET':
    case 'POMODORO_TICK':
    case 'POMODORO_SET_DURATION':
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          pomodoroTimer: reduceTimer(state.dashboard.pomodoroTimer, action),
        },
      }
    case 'POMODORO_SET_PRESET':
      return {
        ...state,
        dashboard: { ...state.dashboard, pomodoroSelectedPreset: action.payload },
      }
    case 'FOOD_START':
    case 'FOOD_PAUSE':
    case 'FOOD_RESUME':
    case 'FOOD_RESET':
    case 'FOOD_TICK':
    case 'FOOD_SET_DURATION':
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          foodTimer: reduceTimer(state.dashboard.foodTimer, action),
        },
      }
    case 'FOOD_SET_PRESET':
      return {
        ...state,
        dashboard: { ...state.dashboard, foodSelectedPreset: action.payload },
      }
    case 'WELLNESS_SHOW_REMINDER':
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          wellnessReminder: {
            ...state.dashboard.wellnessReminder,
            currentReminder: action.payload,
            isVisible: true,
          },
        },
      }
    case 'WELLNESS_DISMISS_REMINDER':
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          wellnessReminder: {
            ...state.dashboard.wellnessReminder,
            isVisible: false,
            currentReminder: null,
          },
        },
      }
    case 'WELLNESS_SCHEDULE_NEXT':
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          wellnessReminder: {
            ...state.dashboard.wellnessReminder,
            isScheduled: true,
            nextReminderTime: Date.now() + 30 * 60 * 1000,
          },
        },
      }
    case 'WELLNESS_CHECK_HOURS': {
      const inHours = isWithinWorkingHours(new Date())
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          wellnessReminder: {
            ...state.dashboard.wellnessReminder,
            isScheduled: inHours ? state.dashboard.wellnessReminder.isScheduled : false,
            isVisible: inHours ? state.dashboard.wellnessReminder.isVisible : false,
          },
        },
      }
    }
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
        // Make sure we deeply merge the dashboard state to avoid wiping out properties
        dashboard: {
          ...state.dashboard,
          ...(action.payload.dashboard || {}),
        }
      }
    case 'INITIALIZE_STATE':
    default:
      return state
  }
}
