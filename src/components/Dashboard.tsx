import { useState, useEffect } from 'react'
import PomodoroTimer from './PomodoroTimer'
import FoodTimer from './FoodTimer'
import { WellnessReminder } from './WellnessReminder'
import { ExternalLinks } from './ExternalLinks'

export default function Dashboard() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  return (
    <div className={`min-h-screen overflow-y-auto p-4 sm:p-6 md:p-8 pb-16 bg-hearts-pattern transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
      {/* Dedicated drag region for Electron window */}
      <div className="drag-region fixed top-0 left-0 right-0 h-8 z-40 pointer-events-auto" />

      {/* Floating hearts background */}
      <div className="fixed top-4 left-4 text-4xl floating-heart opacity-20 pointer-events-none z-0" role="img" aria-label="Decorative heart">
        💕
      </div>
      <div className="fixed top-8 right-8 text-3xl floating-heart opacity-20 pointer-events-none z-0" style={{ animationDelay: '1s' }} role="img" aria-label="Decorative heart">
        💖
      </div>
      <div className="fixed bottom-12 left-12 text-3xl floating-heart opacity-20 pointer-events-none z-0" style={{ animationDelay: '2s' }} role="img" aria-label="Decorative heart">
        💗
      </div>
      <div className="fixed bottom-8 right-16 text-4xl floating-heart opacity-20 pointer-events-none z-0" style={{ animationDelay: '1.5s' }} role="img" aria-label="Decorative heart">
        💝
      </div>

      {/* Wellness Reminder (fixed overlay) */}
      <WellnessReminder />

      <div className="relative z-10 max-w-5xl mx-auto animate-fade-in">
        {/* Header */}
        <header className="text-center mb-8 pt-4">
          <h1 className="pixel-text text-2xl md:text-3xl text-valentine-700 mb-3 flex items-center justify-center gap-3">
            Babe
            <span className="text-2xl animate-heartbeat" role="img" aria-label="Heart">💖</span>
          </h1>
          <p className="font-cute text-valentine-500 text-lg">
            Have a lovely day, babe! <span role="img" aria-label="Sparkles">✨</span>
          </p>
        </header>

        {/* Decorative divider */}
        <div className="flex items-center justify-center mb-8 gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-valentine-300" />
          <span className="text-valentine-400 text-xl" role="img" aria-label="Heart divider">♥</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-valentine-300" />
        </div>

        {/* Timers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <PomodoroTimer />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <FoodTimer />
          </div>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center mb-8 gap-3">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-valentine-300" />
          <span className="text-valentine-400 text-sm">♡</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-valentine-300" />
        </div>

        {/* External Links */}
        <div className="animate-slide-up card" style={{ animationDelay: '0.3s' }}>
          <ExternalLinks />
        </div>
      </div>
    </div>
  )
}
