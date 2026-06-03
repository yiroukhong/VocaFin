import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Eye, Lock, ShieldCheck, Unlock } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function LoginPage() {
  const [authStatus, setAuthStatus] = useState('idle')
  const [announcement, setAnnouncement] = useState('Tap, double tap, or press Enter to log in.')
  const navigate = useNavigate()
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)

  const handleAuth = () => {
    if (authStatus !== 'idle') return

    setAuthStatus('scanning')
    setAnnouncement('Scanning identity. Please wait.')

    setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([100, 50, 100])
      setAuthStatus('success')
      setAnnouncement('Login successful. Opening VocaFin.')

      setTimeout(() => {
        setAuthenticated(true)
        navigate('/')
      }, 1500)
    }, 2200)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleAuth()
    }
  }

  const statusText = {
    idle: 'Tap to log in',
    scanning: 'Scanning identity',
    success: 'Access granted',
  }[authStatus]

  return (
    <main
      className="min-h-screen bg-black text-white p-6 flex flex-col justify-between cursor-pointer select-none"
      onClick={handleAuth}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Mock login screen. Tap or press Enter to authenticate."
    >
      <div aria-live="assertive" role="status" className="sr-only">
        {announcement}
      </div>

      <header className="pt-6 text-center">
        <p className="text-[#7dd3fc] text-sm tracking-[0.35em] uppercase mb-3">Voice-first finance</p>
        <h1 className="text-5xl font-bold tracking-[0.18em] text-[#38bdf8]">VocaFin</h1>
      </header>

      <section className="flex flex-col items-center justify-center" aria-label="Authentication status">
        <div className="relative flex items-center justify-center mb-12">
          <div className={`absolute w-80 h-80 border border-[#38bdf8]/20 rounded-full ${authStatus === 'scanning' ? 'animate-[ping_3s_ease-in-out_infinite]' : ''}`} />
          <div className={`absolute w-64 h-64 border border-[#38bdf8]/40 rounded-full ${authStatus !== 'success' ? 'animate-pulse' : ''}`} />
          <div className="absolute w-44 h-44 border-2 border-[#38bdf8] rounded-full bg-[#0a1628]" />

          <div className="relative z-10 w-28 h-28 rounded-full bg-[#020617] flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.35)]">
            <AnimatePresence mode="wait">
              {authStatus === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <Eye size={68} className="text-[#38bdf8]" strokeWidth={1.8} />
                </motion.div>
              )}
              {authStatus === 'scanning' && (
                <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: [0.45, 1, 0.45] }} exit={{ opacity: 0 }} transition={{ repeat: Infinity, duration: 1.2 }}>
                  <ShieldCheck size={68} className="text-[#7dd3fc]" strokeWidth={1.8} />
                </motion.div>
              )}
              {authStatus === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <Unlock size={68} className="text-[#7dd3fc]" strokeWidth={1.8} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.p
          className="text-3xl font-bold tracking-wide text-center"
          animate={authStatus === 'scanning' ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
          transition={{ repeat: authStatus === 'scanning' ? Infinity : 0, duration: 1.4 }}
        >
          {statusText}
        </motion.p>

        <p className="mt-4 text-center text-[#bfdbfe] text-lg max-w-xs">
          Mock passkey authentication for the demo prototype.
        </p>
      </section>

      <footer className="pb-4">
        <div className="w-full rounded-2xl border border-[#1e40af] bg-[#0f172a] p-4 flex items-center justify-center gap-3 text-[#bfdbfe]">
          {authStatus === 'success' ? <Unlock className="h-7 w-7" aria-hidden="true" /> : <Lock className="h-7 w-7" aria-hidden="true" />}
          <span className="text-lg font-semibold">
            {authStatus === 'success' ? 'Unlocked' : 'Secure demo login'}
          </span>
        </div>
      </footer>
    </main>
  )
}
