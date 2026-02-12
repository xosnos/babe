import { useState } from 'react'
import type { AppPhase } from './types'
import ValentinePrompt from './components/ValentinePrompt'
import SuccessAnimation from './components/SuccessAnimation'
import Dashboard from './components/Dashboard'

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('valentine-prompt')

  return (
    <div className="min-h-screen bg-gradient-to-br from-valentine-50 via-blush to-valentine-100 font-body">
      {phase === 'valentine-prompt' && (
        <ValentinePrompt onAccept={() => setPhase('success-animation')} />
      )}
      {phase === 'success-animation' && (
        <SuccessAnimation onComplete={() => setPhase('dashboard')} />
      )}
      {phase === 'dashboard' && <Dashboard />}
    </div>
  )
}
