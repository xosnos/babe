import { describe, it, expect } from 'vitest'
import { appReducer } from '../state/reducers'
import type { ApplicationState } from '../types'
import fc from 'fast-check'

const initialState: ApplicationState = {
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
      duration: 25 * 60,
      remainingTime: 25 * 60,
      isRunning: false,
      isPaused: false,
    },
    foodTimer: {
      duration: 3 * 60,
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

describe('State Reducers', () => {
  it('Property 5: Click count increments correctly and respects max limit', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 20 }), (clicks) => {
        let state = initialState
        for (let i = 0; i < clicks; i++) {
          state = appReducer(state, { type: 'NO_BUTTON_CLICKED' })
        }
        
        expect(state.valentinePrompt.noButtonClickCount).toBe(Math.min(10, clicks))
        expect(state.valentinePrompt.noButtonVisible).toBe(clicks < 10)
      })
    )
  })

  it('Property 4: Button size changes on No button click', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 10 }), (clicks) => {
        let state = initialState
        for (let i = 0; i < clicks; i++) {
          state = appReducer(state, { type: 'NO_BUTTON_CLICKED' })
        }
        
        expect(state.valentinePrompt.yesButtonScale).toBeCloseTo(1 + clicks * 0.1)
        expect(state.valentinePrompt.noButtonScale).toBeCloseTo(Math.max(0, 1 - clicks * 0.1))
      })
    )
  })
})