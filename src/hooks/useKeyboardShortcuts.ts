import { useEffect } from 'react'
import { useDispatchAction } from '../state/AppContext'

/**
 * Hook to handle keyboard shortcuts for timer controls
 * - Space: Start/Pause current timer
 * - R: Reset current timer
 * - P: Focus Pomodoro timer
 * - F: Focus Food timer
 */
export function useKeyboardShortcuts() {
  const { pomodoroStart, pomodoroPause, pomodoroResume, pomodoroReset, foodStart, foodPause, foodReset } =
    useDispatchAction()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      // Ignore shortcuts with modifiers to allow browser defaults
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return
      }

      switch (event.key.toLowerCase()) {
        case ' ':
          // Space: Toggle Pomodoro timer (start if stopped, pause if running)
          event.preventDefault()
          // Check if timer is running to determine action
          const timerElement = document.querySelector('[data-timer="pomodoro"]') as HTMLElement | null
          const isRunning = timerElement?.getAttribute('data-running') === 'true'
          if (isRunning) {
            pomodoroPause()
          } else {
            pomodoroStart()
          }
          break

        case 'r':
          // R: Reset Pomodoro timer
          event.preventDefault()
          pomodoroReset()
          break

        case 'f':
          // F: Focus Food timer section
          event.preventDefault()
          document.querySelector('[data-timer="food"]')?.focus()
          break

        case 'p':
          // P: Focus Pomodoro timer section
          event.preventDefault()
          document.querySelector('[data-timer="pomodoro"]')?.focus()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pomodoroStart, pomodoroPause, pomodoroResume, pomodoroReset, foodStart, foodPause, foodReset])
}

/**
 * Provide keyboard shortcut help text
 */
export const KEYBOARD_SHORTCUTS = [
  { key: 'Space', description: 'Start/Pause Pomodoro timer' },
  { key: 'R', description: 'Reset Pomodoro timer' },
  { key: 'P', description: 'Focus Pomodoro timer' },
  { key: 'F', description: 'Focus Food timer' },
  { key: 'Tab', description: 'Navigate between interactive elements' },
  { key: 'Enter/Space', description: 'Activate focused button' },
]
