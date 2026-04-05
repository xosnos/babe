import { useEffect, useState } from 'react'
import type { AppPhase, ApplicationState } from './types'
import ValentinePrompt from './components/ValentinePrompt'
import SuccessAnimation from './components/SuccessAnimation'
import Dashboard from './components/Dashboard'
import { useAppState, useAppPhase, useDispatchAction } from './state/AppContext'
import { usePersistence, useLoadPersistedState } from './hooks/usePersistence'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

export default function App() {
  const { dispatch } = useAppState()
  const currentPhase = useAppPhase()
  const loadPersistedState = useLoadPersistedState()
  const [isLoading, setIsLoading] = useState(true)

  // Initialize hooks
  usePersistence()
  useKeyboardShortcuts()

  useEffect(() => {
    const init = async () => {
      try {
        const persistedState = await loadPersistedState()
        if (persistedState) {
          dispatch({ type: 'LOAD_STATE', payload: persistedState as Partial<ApplicationState> })
        }
      } catch (err) {
        console.error('Failed to load state:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    init()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-valentine-50 via-blush to-valentine-100 flex items-center justify-center font-body">
        <div className="text-2xl animate-pulse-soft text-valentine-600 font-cute">Loading... 💕</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-valentine-50 via-blush to-valentine-100 font-body">
      {currentPhase === 'valentine-prompt' && (
        <ValentinePrompt onAccept={() => dispatch({ type: 'SET_PHASE', payload: 'success-animation' })} />
      )}
      {currentPhase === 'success-animation' && (
        <SuccessAnimation onComplete={() => dispatch({ type: 'SET_PHASE', payload: 'dashboard' })} />
      )}
      {currentPhase === 'dashboard' && <Dashboard />}
    </div>
  )
}
