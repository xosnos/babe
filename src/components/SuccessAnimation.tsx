import { useEffect } from 'react';

interface SuccessAnimationProps {
  onComplete: () => void;
}

export default function SuccessAnimation({ onComplete }: SuccessAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-valentine-100 via-valentine-200 to-valentine-300 pointer-events-none">
      {/* Heart confetti */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => {
          const delay = Math.random() * 0.5;
          const duration = 2 + Math.random() * 1.5;
          const startX = Math.random() * 100;
          const size = 20 + Math.random() * 30;
          const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '💘'];
          const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

          return (
            <div
              key={i}
              className="absolute animate-confetti-fall"
              style={{
                left: `${startX}%`,
                top: '-50px',
                fontSize: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
              role="img"
              aria-label="Confetti heart"
            >
              {emoji}
            </div>
          );
        })}
      </div>

      {/* Sparkle effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const delay = Math.random() * 1.5;
          const size = 8 + Math.random() * 16;

          return (
            <div
              key={i}
              className="absolute animate-sparkle"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                animationDelay: `${delay}s`,
              }}
            >
              <svg
                width={size}
                height={size}
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
          );
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
