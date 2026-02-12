import { useState, useCallback } from 'react'
import { useTimer, formatTime } from '../hooks/useTimer'
import { FOOD_PRESETS } from '../types'
import { InAppToast } from './InAppToast'

const PRESET_LABELS: Record<string, string> = {
  'Soft Boiled Egg': 'Soft & runny',
  'Medium Boiled Egg': 'Just right',
  'Hard Boiled Egg': 'Fully cooked',
  'Ramen Noodles': 'Slurp time!',
}

const FOOD_TOAST = { title: 'Food Timer Complete! 🔔', body: 'Your food is ready!' }

export default function FoodTimer() {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [customMinutes, setCustomMinutes] = useState('')
  const [customSeconds, setCustomSeconds] = useState('')
  const [celebrating, setCelebrating] = useState(false)
  const [toast, setToast] = useState({ visible: false, title: '', body: '' })

  const handleComplete = useCallback(() => {
    const showFallback = () => setToast({ visible: true, ...FOOD_TOAST })

    if (window.electronAPI) {
      window.electronAPI
        .showNotification(FOOD_TOAST.title, FOOD_TOAST.body)
        .then((result) => {
          if (!result?.success) showFallback()
        })
        .catch(() => showFallback())
    } else {
      showFallback()
    }

    setCelebrating(true)
    setTimeout(() => setCelebrating(false), 3000)
  }, [])

  const timer = useTimer(FOOD_PRESETS[0].duration, handleComplete)

  const handlePresetClick = (index: number) => {
    setSelectedPreset(index)
    timer.setDuration(FOOD_PRESETS[index].duration)
    setCustomMinutes('')
    setCustomSeconds('')
  }

  const handleCustomDuration = () => {
    const minutes = parseInt(customMinutes) || 0
    const seconds = parseInt(customSeconds) || 0
    const total = minutes * 60 + seconds

    if (total > 0) {
      timer.setDuration(total)
      setSelectedPreset(null)
    }
  }

  const handleStartPause = () => {
    if (timer.isRunning) {
      timer.pause()
    } else if (timer.isPaused) {
      timer.resume()
    } else {
      timer.start()
    }
  }

  const getTimerState = () => {
    if (celebrating) return { label: 'Bon appétit! 🍽️', color: 'text-mint' }
    if (timer.isRunning) return { label: 'Cooking...', color: 'text-valentine-600' }
    if (timer.isPaused) return { label: 'Paused', color: 'text-valentine-400' }
    if (timer.remainingTime === 0) return { label: 'Ready to eat!', color: 'text-valentine-500' }
    return { label: 'Set your timer', color: 'text-valentine-500' }
  }

  const state = getTimerState()
  const progress = timer.duration > 0 ? ((timer.duration - timer.remainingTime) / timer.duration) * 100 : 0

  return (
    <div className="card relative">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl" role="img" aria-label="Cooking">🍳</span>
        <h2 className="pixel-text text-xl text-valentine-700">Food Timer</h2>
      </div>

      {/* Food Presets */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {FOOD_PRESETS.map((preset, index) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(index)}
            className={`px-4 py-3 rounded-xl font-cute font-semibold text-sm transition-all duration-200 text-left ${
              selectedPreset === index
                ? 'bg-gradient-to-r from-coral to-peach text-white shadow-cute'
                : 'bg-white/40 text-valentine-600 border border-valentine-200/50 hover:bg-white/60'
            }`}
            disabled={timer.isRunning}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{preset.emoji}</span>
              <span>{preset.name}</span>
            </div>
            <div className={`text-xs ${selectedPreset === index ? 'text-white/80' : 'text-valentine-500'}`}>
              {PRESET_LABELS[preset.name]}
            </div>
          </button>
        ))}
      </div>

      {/* Custom Duration */}
      <div className="mb-6">
        <p className="font-cute text-sm text-valentine-600 mb-2">Custom duration:</p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min="0"
            max="99"
            placeholder="00"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            onBlur={handleCustomDuration}
            className="w-16 px-3 py-2 bg-white/60 border border-valentine-200/50 rounded-lg text-center font-mono text-valentine-700 focus:outline-none focus:ring-2 focus:ring-valentine-400"
            disabled={timer.isRunning}
          />
          <span className="font-cute text-valentine-600">min</span>
          <input
            type="number"
            min="0"
            max="59"
            placeholder="00"
            value={customSeconds}
            onChange={(e) => setCustomSeconds(e.target.value)}
            onBlur={handleCustomDuration}
            className="w-16 px-3 py-2 bg-white/60 border border-valentine-200/50 rounded-lg text-center font-mono text-valentine-700 focus:outline-none focus:ring-2 focus:ring-valentine-400"
            disabled={timer.isRunning}
          />
          <span className="font-cute text-valentine-600">sec</span>
        </div>
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
          className="h-full bg-gradient-to-r from-coral to-peach transition-all duration-1000 ease-linear"
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
          onClick={timer.reset}
          className="btn-secondary"
          aria-label="Reset timer"
        >
          🔄 Reset
        </button>
      </div>

      {/* Celebration overlay */}
      {celebrating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-6xl animate-yipe-bounce" role="img" aria-label="Bell notification">
            🔔
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
