import { useWellnessReminder } from '../hooks/useWellnessReminder'
import { WORKING_HOURS } from '../types'

function isWithinWorkingHours(date: Date): boolean {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const currentMinutes = hours * 60 + minutes
  const startMinutes = WORKING_HOURS.start.hour * 60 + WORKING_HOURS.start.minute
  const endMinutes = WORKING_HOURS.end.hour * 60 + WORKING_HOURS.end.minute
  return currentMinutes >= startMinutes && currentMinutes < endMinutes
}

export function WellnessReminder() {
  const { currentReminder, isVisible, dismiss } = useWellnessReminder()
  const isWorkingHours = isWithinWorkingHours(new Date())

  return (
    <>
      {/* Status Indicator - Always visible */}
      <div className="fixed bottom-4 right-4 z-40 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-valentine-200/50 shadow-sm">
          <span className="text-xs text-valentine-600 font-cute font-medium">
            {isWorkingHours ? 'Reminders active' : 'Rest time'}
          </span>
          <div className={`text-xs ${isWorkingHours ? 'animate-pulse-soft' : ''}`}>
            {isWorkingHours ? '💕' : '🌙'}
          </div>
        </div>
      </div>

      {/* Reminder Notification - responsive width on small screens */}
      {currentReminder && (
        <div
          className={`fixed top-4 left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 transition-all duration-500 ease-out max-w-md sm:mx-auto ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-8 pointer-events-none'
          }`}
        >
          <div
            className={`card w-full shadow-cute-lg border-2 ${
              currentReminder.type === 'water'
                ? 'border-blue-200 bg-gradient-to-br from-blue-50/90 to-white/90'
                : 'border-lavender bg-gradient-to-br from-lavender/30 to-white/90'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 text-4xl animate-bounce-soft">
                {currentReminder.type === 'water' ? '💧' : '🌬️'}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-cute font-bold text-lg text-valentine-700 mb-1">
                  {currentReminder.type === 'water' ? 'Hydration Time!' : 'Breathing Break'}
                </h3>
                <p className="text-valentine-600 font-cute text-sm leading-relaxed">
                  {currentReminder.message}
                </p>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={dismiss}
                className="flex-shrink-0 self-end sm:self-auto w-fit px-4 py-2 bg-gradient-to-r from-valentine-400 to-valentine-500 text-white font-cute font-bold rounded-xl shadow-cute hover:shadow-cute-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ease-out text-sm"
              >
                Got it! 💖
              </button>
            </div>

            {/* Decorative element */}
            <div className="absolute -top-2 -right-2 text-2xl animate-heartbeat">
              ✨
            </div>
          </div>
        </div>
      )}
    </>
  )
}
