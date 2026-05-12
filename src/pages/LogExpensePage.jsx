import { useNavigate } from 'react-router-dom'
import { Mic } from 'lucide-react'
import TopBar from '@/components/TopBar'
import VoiceRings from '@/components/VoiceRings'

export default function LogExpensePage() {
  const navigate = useNavigate()

  return (
    <div className="screen-container bg-bg-base">
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
        <button
          onClick={() => navigate('/')}
          aria-label="Long press to cancel"
          className="w-full border border-white/20 rounded-btn py-3 px-6"
        >
          <span className="text-caption text-text-muted">Long press to Cancel</span>
        </button>
      </div>
    </div>
  )
}
