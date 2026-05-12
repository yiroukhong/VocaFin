import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ArrowUp, ArrowDown } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function SavedPage() {
  const navigate = useNavigate()
  const touchStart = useRef(null)
  const mouseStart = useRef(null)

  function handleTouchStart(e) {
    touchStart.current = e.touches[0].clientY
  }

  function handleTouchEnd(e) {
    if (touchStart.current === null) return
    const delta = touchStart.current - e.changedTouches[0].clientY
    if (delta > 50) {
      navigate('/log')
    } else if (delta < -50) {
      navigate('/')
    }
    touchStart.current = null
  }

  function handleMouseDown(e) {
    mouseStart.current = e.clientY
  }

  function handleMouseUp(e) {
    if (mouseStart.current === null) return
    const delta = mouseStart.current - e.clientY
    if (delta > 50) {
      navigate('/log')
    } else if (delta < -50) {
      navigate('/')
    }
    mouseStart.current = null
  }

  return (
    <div
      className="screen-container touch-none bg-bg-base pb-16 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <main
        aria-label="Transaction saved — swipe up for new entry, swipe down to go home"
        className="flex-1 flex flex-col items-center justify-center gap-8"
      >
        <h1 className="text-amount font-extrabold text-center">Saved!</h1>

        {/* Success circle */}
        <div
          className="w-[120px] h-[120px] rounded-icon bg-white flex items-center justify-center"
          aria-hidden="true"
        >
          <Check size={48} className="text-bg-base" strokeWidth={3} />
        </div>

        {/* Visual hints */}
        <div className="flex flex-col items-center gap-1 mt-4" aria-hidden="true">
          <ArrowUp size={50} className="text-save-green" />
          <span className="text-h1 text-text-primary">New Entry</span>
          <ArrowDown size={50} className="text-text-muted mt-3" />
          <span className="text-h1 text-text-muted">Home</span>
        </div>

        <p className="text-h2 text-text-muted text-center">
          Swipe up for new entry
        </p>
      </main>

      <Navbar activePage="voice" />
    </div>
  )
}
