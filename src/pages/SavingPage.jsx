import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Utensils } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useUiStore } from '@/store/uiStore'

export default function SavingPage() {
  const navigate = useNavigate()
  const pending = useUiStore((s) => s.pendingTransaction)

  useEffect(() => {
    const t = setTimeout(() => navigate('/saved'), 1500)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="screen-container bg-bg-base pb-16">
      <main
        aria-label="Saving transaction"
        aria-live="polite"
        className="flex-1 flex flex-col items-center justify-center gap-8"
      >
        <h1 className="text-h1 font-bold text-center">Saving..</h1>

        {/* Spinner */}
        <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
          {/* Static outer ring */}
          <span className="absolute inset-0 rounded-icon border-2 border-white/20" />
          {/* Animated arc */}
          <span className="absolute inset-0 rounded-icon border-2 border-transparent border-t-cyan animate-spin-slow" />
          {/* Faded inner content */}
          <div className="flex flex-col items-center opacity-30">
            <Utensils size={20} className="text-text-muted mb-1" />
            {pending && (
              <span className="text-caption text-text-muted">RM {Number(pending.amount).toFixed(2)}</span>
            )}
          </div>
        </div>
      </main>

      <Navbar activePage="voice" />
    </div>
  )
}
