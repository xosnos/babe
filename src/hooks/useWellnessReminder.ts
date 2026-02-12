import { useState, useEffect, useCallback, useRef } from 'react'
import type { WellnessMessage, ReminderType } from '../types'
import { WELLNESS_MESSAGES, WORKING_HOURS } from '../types'

function isWithinWorkingHours(date: Date): boolean {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const currentMinutes = hours * 60 + minutes
  const startMinutes = WORKING_HOURS.start.hour * 60 + WORKING_HOURS.start.minute
  const endMinutes = WORKING_HOURS.end.hour * 60 + WORKING_HOURS.end.minute
  return currentMinutes >= startMinutes && currentMinutes < endMinutes
}

function getRandomInterval(): number {
  // 15-45 minutes in milliseconds
  return (15 + Math.random() * 30) * 60 * 1000
}

function getRandomReminder(): WellnessMessage {
  const type: ReminderType = Math.random() < 0.5 ? 'water' : 'breathing'
  const messages = WELLNESS_MESSAGES[type]
  const message = messages[Math.floor(Math.random() * messages.length)]
  return { type, message }
}

export function useWellnessReminder() {
  const [currentReminder, setCurrentReminder] = useState<WellnessMessage | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => setCurrentReminder(null), 300)
  }, [])

  const scheduleNext = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (!isWithinWorkingHours(new Date())) {
      return
    }

    const interval = getRandomInterval()
    timeoutRef.current = setTimeout(() => {
      if (isWithinWorkingHours(new Date())) {
        const reminder = getRandomReminder()
        setCurrentReminder(reminder)
        setIsVisible(true)

        // Try native notification
        if (window.electronAPI) {
          window.electronAPI.showNotification(
            reminder.type === 'water' ? 'Hydration Reminder' : 'Breathing Reminder',
            reminder.message,
          )
        }
      }
      scheduleNext()
    }, interval)
  }, [])

  useEffect(() => {
    scheduleNext()

    // Check working hours every minute
    const checkInterval = setInterval(() => {
      if (isWithinWorkingHours(new Date())) {
        if (!timeoutRef.current) {
          scheduleNext()
        }
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
    }, 60 * 1000)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      clearInterval(checkInterval)
    }
  }, [scheduleNext])

  return { currentReminder, isVisible, dismiss }
}
