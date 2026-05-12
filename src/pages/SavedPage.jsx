import { useNavigate } from 'react-router-dom'
import { Check, ArrowUp } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function SavedPage() {
  const navigate = useNavigate()

  return (
    <div className="screen-container bg-bg-base pb-16">
      <main
        aria-label="Transaction saved successfully"
        className="flex-1 flex flex-col items-center justify-center gap-8"
      >
        <h1 className="text-display font-extrabold text-center">Saved!</h1>

        {/* Success circle */}
        <div
          className="w-[120px] h-[120px] rounded-icon bg-white flex items-center justify-center"
          aria-hidden="true"
        >
          <Check size={48} className="text-bg-base" strokeWidth={3} />
        </div>

        {/* New Entry */}
        <button
          onClick={() => navigate('/log')}
          aria-label="Log a new entry"
          className="flex flex-col items-center gap-2 mt-4"
        >
          <ArrowUp size={28} className="text-save-green" />
          <span className="text-h2 text-text-primary">New Entry</span>
        </button>
      </main>

      <Navbar activePage="voice" />
    </div>
  )
}
