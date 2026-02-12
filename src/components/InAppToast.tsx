import { useEffect } from 'react'

const AUTO_DISMISS_MS = 6000

export interface InAppToastProps {
  visible: boolean
  title: string
  body: string
  onDismiss: () => void
}

export function InAppToast({ visible, title, body, onDismiss }: InAppToastProps) {
  useEffect(() => {
    if (!visible) return
    const id = setTimeout(onDismiss, AUTO_DISMISS_MS)
    return () => clearTimeout(id)
  }, [visible, onDismiss])

  if (!visible) return null

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up max-w-md w-[calc(100vw-2rem)]"
      role="alert"
      aria-live="polite"
    >
      <div className="card shadow-cute-lg border-2 border-valentine-200 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-cute font-bold text-valentine-700 mb-0.5">{title}</h3>
          <p className="text-valentine-600 font-cute text-sm leading-relaxed">{body}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 px-3 py-1.5 bg-valentine-100 hover:bg-valentine-200 text-valentine-700 font-cute font-semibold rounded-lg text-sm transition-colors"
          aria-label="Dismiss notification"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
