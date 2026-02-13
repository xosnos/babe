import { useEffect, useMemo } from 'react'
import { useDispatchAction } from '../state/AppContext'

interface SuccessAnimationProps {
  onComplete: () => void;
}

export default function SuccessAnimation({ onComplete }: SuccessAnimationProps) {
  const { animationComplete } = useDispatchAction()

  // Memoize confetti particles
  const confettiParticles = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1.5,
      startX: Math.random() * 100,
      size: 20 + Math.random() * 30,
      emoji: ['💕', '💖', '💗', '💓', '💝', '💘'][Math.floor(Math.random() * 6)],
    }))
  }, [])

  // Memoize sparkle particles
  const sparkleParticles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      size: 8 + Math.random() * 16,
    }))
  }, [])

  useEffect(() => {
    // Dispatch animation complete and call prop callback if provided
    const timer = setTimeout(() => {
      animationComplete()
      onComplete()
    }, 2500)

    // Safety timeout - max 5 seconds per design spec
    const safetyTimer = setTimeout(() => {
      animationComplete()
      onComplete()
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(safetyTimer)
    }
  }, [animationComplete, onComplete])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-valentine-100 via-valentine-200 to-valentine-300 pointer-events-none">
      {/* Heart confetti */}
      <div className="absolute inset-0 overflow-hidden">
        {confettiParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-confetti-fall"
            style={{
              left: `${particle.startX}%`,
              top: '-50px',
              fontSize: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
            role="img"
            aria-label="Confetti heart"
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      {/* Sparkle effects */}
      <div className="absolute inset-0 overflow-hidden">
        {sparkleParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute animate-sparkle"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animationDelay: `${particle.delay}s`,
              }}
            >
              <svg
                width={particle.size}
                height={particle.size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                  fill="#FF69B4"
                  opacity="0.8"
                />
              </svg>
            </div>
          )
        })}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-8">
        {/* YIPE! text */}
        <h1 className="pixel-text text-7xl md:text-8xl text-valentine-700 mb-8 animate-yipe-bounce">
          YIPE!
        </h1>

        {/* Subtitle */}
        <p className="text-3xl font-cute font-bold text-valentine-600 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          I knew you'd say yes! <span role="img" aria-label="Heart">💕</span>
        </p>
      </div>

      {/* Warm pink glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-valentine-400/30 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-valentine-300/25 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-valentine-500/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      {/* Radial gradient overlay for extra warmth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-valentine-200/10 to-valentine-300/20 pointer-events-none" />
    </div>
  );
}
