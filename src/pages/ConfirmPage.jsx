import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp, ArrowDown, Utensils } from 'lucide-react'
import TopBar from '@/components/TopBar'
import { useUiStore } from '@/store/uiStore'
import { useTransactionStore } from '@/store/transactionStore'

const DEFAULT_TX = { name: 'Lunch', amount: 10.00, category: 'Food' }

export default function ConfirmPage() {
  const navigate = useNavigate()
  const pending = useUiStore((s) => s.pendingTransaction) ?? DEFAULT_TX
  const clearPending = useUiStore((s) => s.clearPending)
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const touchStart = useRef(null)
  const mouseStart = useRef(null)

  function handleTouchStart(e) {
    touchStart.current = e.touches[0].clientY
  }

  function handleTouchEnd(e) {
    if (touchStart.current === null) return
    const delta = touchStart.current - e.changedTouches[0].clientY
    if (delta > 50) {
      addTransaction({
        id: Date.now().toString(),
        name: pending.name,
        amount: pending.amount,
        category: pending.category,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
      clearPending()
      navigate('/saving')
    } else if (delta < -50) {
      clearPending()
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
      addTransaction({
        id: Date.now().toString(),
        name: pending.name,
        amount: pending.amount,
        category: pending.category,
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
      clearPending()
      navigate('/saving')
    } else if (delta < -50) {
      clearPending()
      navigate('/')
    }
    mouseStart.current = null
  }

  return (
    <div
      className="screen-container touch-none flex flex-col bg-bg-base select-none"
      aria-label="Confirm transaction — swipe up to save, swipe down to cancel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <TopBar label="Log confirmation" />

      {/* Top — swipe up zone, green arrow */}
      <div className="flex-1 flex items-center justify-center" aria-hidden="true">
        <ArrowUp size={96} strokeWidth={1.5} className="text-save-green" />
      </div>

      {/* Centre — confirmation card */}
      <div className="card mx-4 p-6 text-center">
        <h2 className="text-h2 font-bold mb-3">{pending.name}</h2>
        <p className="text-body text-cyan">RM</p>
        <p className="text-amount font-black text-cyan leading-none mb-3">
          {Number(pending.amount).toFixed(2)}
        </p>
        <div className="flex items-center justify-center gap-2 text-caption text-text-muted">
          <Utensils size={14} />
          <span>Category: {pending.category}</span>
        </div>
      </div>

      {/* Bottom — swipe down zone, red arrow */}
      <div className="flex-1 flex items-center justify-center" aria-hidden="true">
        <ArrowDown size={96} strokeWidth={1.5} className="text-cancel-red" />
      </div>
    </div>
  )
}
