import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic } from 'lucide-react'
import TopBar from '@/components/TopBar'
import VoiceRings from '@/components/VoiceRings'

export default function LogExpensePage() {
  const navigate = useNavigate()
  const autoTimer = useRef(null)
  const holdTimer = useRef(null)

  useEffect(() => {
    autoTimer.current = setTimeout(() => navigate('/confirm'), 3000)
    return () => {
      clearTimeout(autoTimer.current)
      clearTimeout(holdTimer.current)
    }
  }, [navigate])

  function handlePointerDown() {
    holdTimer.current = setTimeout(() => {
      clearTimeout(autoTimer.current)
      navigate('/')
    }, 800)
  }

  function cancelHold() {
    clearTimeout(holdTimer.current)
  }

  return (
    <div
      className="screen-container bg-bg-base select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
    >
      <TopBar label="Logging 1" />

      <main
        aria-label="Log expense — listening"
        className="flex-1 flex flex-col items-center justify-center px-screen"
      >
        <VoiceRings size="md">
          <Mic size={32} className="text-white" />
        </VoiceRings>

        <h1 className="text-h1 font-bold text-center mt-8">Log ..</h1>
      </main>

      <div className="px-screen pb-8">
        <div className="w-full border border-white/20 rounded-btn py-3 px-6 text-center">
          <span className="text-caption text-text-muted">Long press to Cancel</span>
        </div>
      </div>
    </div>
  )
}
