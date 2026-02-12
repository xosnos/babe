import { useReducer, useEffect, useCallback, useRef } from 'react'
import type { TimerState, TimerAction } from '../types'

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START':
      if (state.remainingTime <= 0) return state
      return { ...state, isRunning: true, isPaused: false }
    case 'PAUSE':
      if (!state.isRunning) return state
      return { ...state, isRunning: false, isPaused: true }
    case 'RESUME':
      if (!state.isPaused) return state
      return { ...state, isRunning: true, isPaused: false }
    case 'RESET':
      return { ...state, remainingTime: state.duration, isRunning: false, isPaused: false }
    case 'TICK':
      if (!state.isRunning) return state
      const next = state.remainingTime - 1
      if (next <= 0) {
        return { ...state, remainingTime: 0, isRunning: false, isPaused: false }
      }
      return { ...state, remainingTime: next }
    case 'SET_DURATION':
      if (action.payload <= 0) return state
      return {
        ...state,
        duration: action.payload,
        remainingTime: action.payload,
        isRunning: false,
        isPaused: false,
      }
    default:
      return state
  }
}

export function useTimer(initialDuration: number, onComplete?: () => void) {
  const [state, dispatch] = useReducer(timerReducer, {
    duration: initialDuration,
    remainingTime: initialDuration,
    isRunning: false,
    isPaused: false,
  })

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!state.isRunning) return

    const id = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)

    return () => clearInterval(id)
  }, [state.isRunning])

  // Detect completion
  const prevRemaining = useRef(state.remainingTime)
  useEffect(() => {
    if (prevRemaining.current > 0 && state.remainingTime === 0) {
      onCompleteRef.current?.()
    }
    prevRemaining.current = state.remainingTime
  }, [state.remainingTime])

  const start = useCallback(() => dispatch({ type: 'START' }), [])
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), [])
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])
  const setDuration = useCallback(
    (seconds: number) => dispatch({ type: 'SET_DURATION', payload: seconds }),
    [],
  )

  return { ...state, start, pause, resume, reset, setDuration }
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
