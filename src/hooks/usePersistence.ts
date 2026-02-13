import { useEffect } from 'react'
import { useAppStateValue } from '../state/AppContext'

/**
 * Hook to automatically persist application state to SQLite
 * Syncs state whenever it changes
 */
export function usePersistence() {
  const state = useAppStateValue()

  useEffect(() => {
    // Only persist if we have electronAPI available
    if (!window.electronAPI?.saveState) {
      console.warn('electronAPI.saveState not available, skipping persistence')
      return
    }

    // Debounce persistence to avoid excessive database writes
    const debounceTimer = setTimeout(async () => {
      try {
        const persistState = {
          valentineAccepted: state.valentineAccepted,
          phase: state.phase,
          pomodoroTimer: {
            duration: state.dashboard.pomodoroTimer.duration,
            remainingTime: state.dashboard.pomodoroTimer.remainingTime,
          },
          foodTimer: {
            duration: state.dashboard.foodTimer.duration,
            remainingTime: state.dashboard.foodTimer.remainingTime,
          },
          wellnessReminder: {
            nextReminderTime: state.dashboard.wellnessReminder.nextReminderTime,
          },
        }

        const result = await window.electronAPI.saveState(persistState)
        if (!result.success) {
          console.error('Failed to persist state:', result.error)
        }
      } catch (error) {
        console.error('Error persisting state:', error)
      }
    }, 1000) // Debounce for 1 second

    return () => clearTimeout(debounceTimer)
  }, [state])
}

/**
 * Hook to load persisted state on app startup
 */
export function useLoadPersistedState() {
  return async () => {
    if (!window.electronAPI?.loadState) {
      console.warn('electronAPI.loadState not available')
      return null
    }

    try {
      const result = await window.electronAPI.loadState()
      if (result.success && result.data) {
        return result.data
      }
      return null
    } catch (error) {
      console.error('Error loading persisted state:', error)
      return null
    }
  }
}
