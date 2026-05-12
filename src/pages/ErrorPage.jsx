import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import TopBar from '@/components/TopBar'
import Navbar from '@/components/Navbar'

export default function ErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="screen-container pb-16">
      <TopBar label="Error page" />

      <main
        aria-label="Voice input error"
        className="flex-1 flex flex-col px-screen pt-8 max-w-sm mx-auto w-full"
      >
        {/* Error icon */}
        <div
          className="w-20 h-20 rounded-icon border-2 border-error-coral flex items-center justify-center"
          aria-hidden="true"
        >
          <AlertCircle size={40} className="text-error-coral" />
        </div>

        <h1 className="text-display font-extrabold mt-6 leading-tight">
          Sorry, I didn&apos;t<br />catch that.
        </h1>

        <p className="text-body text-text-secondary mt-4">
          Please speak clearly or tap to try again.
        </p>

        <button
          onClick={() => navigate('/log')}
          className="btn-beige mt-8"
          aria-label="Try again"
        >
          Try Again
        </button>
      </main>

      <Navbar activePage="voice" />
    </div>
  )
}
