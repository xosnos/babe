import { useState, useCallback, useEffect } from 'react'
import { formatTime } from '../hooks/useTimer'
import { usePomodoroTimerState, useDispatchAction } from '../state/AppContext'
import { InAppToast } from './InAppToast'

const PRESETS = [
  { label: '15 min', duration: 15 * 60, emoji: '⚡' },
  { label: '25 min', duration: 25 * 60, emoji: '🍅' },
  { label: '45 min', duration: 45 * 60, emoji: '💪' },
]

const POMODORO_TOAST = { title: 'Pomodoro Complete! 🎉', body: 'Great work! Time for a break.' }

export default function PomodoroTimer() {
  const timer = usePomodoroTimerState()
  const { pomodoroStart, pomodoroPause, pomodoroResume, pomodoroReset, pomodoroTick, pomodoroSetDuration, pomodoroSetPreset } = useDispatchAction()

  const [selectedPreset, setSelectedPreset] = useState(1) // Default to 25 min
  const [celebrating, setCelebrating] = useState(false)
  const [toast, setToast] = useState({ visible: false, title: '', body: '' })

  // Set initial duration from preset on mount
  useEffect(() => {
    pomodoroSetDuration(PRESETS[1].duration)
  }, [])

  // Handle timer tick
  useEffect(() => {
    if (!timer.isRunning) return
    const interval = setInterval(() => {
      pomodoroTick()
    }, 1000)
    return () => clearInterval(interval)
  }, [timer.isRunning, pomodoroTick])

  // Handle completion
  useEffect(() => {
    if (timer.remainingTime === 0 && timer.isRunning) {
      const showFallback = () => setToast({ visible: true, ...POMODORO_TOAST })

      if (window.electronAPI) {
        window.electronAPI
          .showNotification(POMODORO_TOAST.title, POMODORO_TOAST.body)
          .then((result) => {
            if (!result?.success) showFallback()
          })
          .catch(() => showFallback())
      } else {
        showFallback()
      }

      setCelebrating(true)
      setTimeout(() => setCelebrating(false), 3000)
    }
  }, [timer.remainingTime, timer.isRunning])

  const handlePresetClick = (index: number, duration: number) => {
    setSelectedPreset(index)
    pomodoroSetDuration(duration)
  }

  const handleStartPause = () => {
    if (timer.isRunning) {
      pomodoroPause()
    } else if (timer.isPaused) {
      pomodoroResume()
    } else {
      pomodoroStart()
    }
  }

  const getTimerState = () => {
    if (celebrating) return { label: 'Amazing work! 🎉', color: 'text-mint' }
    if (timer.isRunning) return { label: 'Working hard!', color: 'text-valentine-600' }
    if (timer.isPaused) return { label: 'Paused...', color: 'text-valentine-400' }
    if (timer.remainingTime === 0) return { label: 'Ready for more?', color: 'text-valentine-500' }
    return { label: 'Ready to focus?', color: 'text-valentine-500' }
  }

  const state = getTimerState()
  const progress = ((timer.duration - timer.remainingTime) / timer.duration) * 100

  return (
    <div className="card" data-timer="pomodoro" data-running={timer.isRunning}>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl" role="img" aria-label="Tomato">🍅</span>
        <h2 className="pixel-text text-xl text-valentine-700">Pomodoro Timer</h2>
      </div>

      {/* Presets */}
      <div className="flex gap-3 mb-6">
        {PRESETS.map((preset, index) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(index, preset.duration)}
            className={`flex-1 px-3 py-2 rounded-xl font-cute font-semibold text-sm transition-all duration-200 ${
              selectedPreset === index
                ? 'bg-gradient-to-r from-valentine-600 to-valentine-700 text-white shadow-cute'
                : 'bg-white/40 text-valentine-600 border border-valentine-200/50 hover:bg-white/60'
            }`}
            disabled={timer.isRunning}
          >
            <span className="mr-1" role="img" aria-label={`${preset.label} preset`}>{preset.emoji}</span>
            {preset.label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className={`timer-display mb-3 ${celebrating ? 'animate-bounce-soft' : ''} ${timer.isRunning ? 'animate-pulse-soft' : ''}`}>
          {formatTime(timer.remainingTime)}
        </div>
        <p className={`font-cute font-semibold ${state.color} transition-colors duration-300`}>
          {state.label}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-valentine-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-valentine-400 to-valentine-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleStartPause}
          className="btn-primary flex-1"
          disabled={timer.remainingTime === 0}
          aria-label={timer.isRunning ? 'Pause timer' : timer.isPaused ? 'Resume timer' : 'Start timer'}
        >
          {timer.isRunning ? '⏸️ Pause' : timer.isPaused ? '▶️ Resume' : '▶️ Start'}
        </button>
        <button
          onClick={pomodoroReset}
          className="btn-secondary"
          aria-label="Reset timer"
        >
          🔄 Reset
        </button>
      </div>

      {/* Celebration overlay */}
      {celebrating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-6xl animate-yipe-bounce" role="img" aria-label="Celebration">
            🎉
          </div>
        </div>
      )}

      <InAppToast
        visible={toast.visible}
        title={toast.title}
        body={toast.body}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  )
}
