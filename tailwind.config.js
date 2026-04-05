/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        valentine: {
          50: '#FFF0F3',
          100: '#FFE0E6',
          200: '#FFC2D1',
          300: '#FFB6C1',
          400: '#FF8FAB',
          500: '#FF69B4',
          600: '#FF1493',
          700: '#DB1493',
          800: '#B80F6B',
          900: '#8B0A50',
        },
        cream: '#FFF8F0',
        coral: '#FF7F7F',
        blush: '#FFE4E9',
        lavender: '#E6E6FA',
        mint: '#98FF98',
        peach: '#FFDAB9',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        cute: ['Quicksand', 'Nunito', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
        'wiggle': 'wiggle 0.3s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'confetti-fall': 'confettiFall 3s ease-in forwards',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'yipe-bounce': 'yipeBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        sparkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(0.8)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-100%) rotate(0deg)', opacity: 1 },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        },
        yipeBounce: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: 0 },
          '50%': { transform: 'scale(1.3) rotate(5deg)', opacity: 1 },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
        },
      },
      boxShadow: {
        'cute': '0 4px 14px 0 rgba(255, 105, 180, 0.25)',
        'cute-lg': '0 8px 25px 0 rgba(255, 105, 180, 0.3)',
        'glow': '0 0 20px rgba(255, 105, 180, 0.4)',
      },
    },
  },
  plugins: [],
}
