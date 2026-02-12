import { useState } from 'react';

interface ValentinePromptProps {
  onAccept: () => void;
}

const CUTE_MESSAGES = [
  'Are you sure? 🥺',
  'Pretty please? 💕',
  'Think again! 💭',
  'But I love you! 💗',
  'One more chance? 🌸',
  'Don\'t break my heart! 💔',
  'You know you want to! ✨',
  'The Yes button is growing! 👀',
  'Just say yes! 💝',
  'I made this for you! 🎀',
];

export default function ValentinePrompt({ onAccept }: ValentinePromptProps) {
  const [noClickCount, setNoClickCount] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);
  const [currentMessage, setCurrentMessage] = useState('');
  const [wiggle, setWiggle] = useState(false);

  const handleNoClick = () => {
    if (noClickCount >= 10) return;

    const newCount = noClickCount + 1;
    setNoClickCount(newCount);
    setYesScale(1 + newCount * 0.1);
    setNoScale(1 - newCount * 0.1);
    setCurrentMessage(CUTE_MESSAGES[newCount - 1] || CUTE_MESSAGES[CUTE_MESSAGES.length - 1]);

    // Trigger wiggle animation
    setWiggle(true);
    setTimeout(() => setWiggle(false), 300);
  };

  const noButtonVisible = noClickCount < 10;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-valentine-50 via-blush to-valentine-100 bg-hearts-pattern">
      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20 floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              fontSize: `${20 + Math.random() * 30}px`,
            }}
            role="img"
            aria-label="Decorative heart"
          >
            💕
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-8 max-w-2xl">
        {/* Title */}
        <h1 className="pixel-text text-4xl md:text-5xl text-valentine-700 mb-12 animate-pulse-soft">
          Will you be my Valentine?
        </h1>

        {/* Cute message that appears when No is clicked */}
        {currentMessage && (
          <div className="mb-6 animate-slide-up">
            <p className="text-2xl font-cute text-valentine-600 font-bold">
              {currentMessage}
            </p>
          </div>
        )}

        {/* Buttons container */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {/* Yes button */}
          <button
            onClick={onAccept}
            className="btn-primary animate-heartbeat"
            style={{
              transform: `scale(${yesScale})`,
              transition: 'transform 300ms ease',
            }}
            aria-label="Accept Valentine's Day proposal"
          >
            Yes! 💖
          </button>

          {/* No button */}
          <button
            onClick={handleNoClick}
            disabled={!noButtonVisible}
            className={`px-6 py-3 bg-white/70 backdrop-blur-sm text-valentine-500 font-cute font-semibold rounded-2xl border-2 border-valentine-200 shadow-sm hover:bg-white/90 disabled:opacity-0 disabled:pointer-events-none disabled:scale-0 transition-all duration-500 ${
              wiggle ? 'animate-wiggle' : ''
            }`}
            style={{
              transform: `scale(${noScale})`,
              transitionProperty: 'opacity, transform, pointer-events, visibility',
              transitionDuration: '500ms',
              transitionTimingFunction: 'ease',
            }}
            aria-label="Decline Valentine's Day proposal"
          >
            No 😔
          </button>
        </div>

        {/* Progress hint */}
        {noClickCount > 0 && noButtonVisible && (
          <div className="mt-8 animate-fade-in">
            <p className="text-sm text-valentine-400 font-cute">
              {noClickCount}/10 clicks... the "No" button is fading away 👻
            </p>
          </div>
        )}

        {/* After No disappears */}
        {!noButtonVisible && (
          <div className="mt-8 animate-bounce-soft">
            <p className="text-2xl text-valentine-600 font-cute font-bold">
              I guess there's only one option left! 😊✨
            </p>
          </div>
        )}
      </div>

      {/* Warm glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-valentine-300/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-valentine-400/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}
