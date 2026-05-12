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

  function handleSave() {
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
  }

  function handleCancel() {
    clearPending()
    navigate('/')
  }

  return (
    <div className="screen-container bg-bg-base">
      <TopBar label="Log confirmation" />

      <main
        aria-label="Confirm transaction"
        className="flex-1 flex flex-col items-center justify-center px-4 gap-6"
      >
        {/* Transaction card */}
        <div className="card w-full text-center">
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

        {/* Action buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={handleSave}
            aria-label="Save transaction"
            className="flex-1 bg-save-green rounded-btn py-4 flex flex-col items-center gap-1"
          >
            <ArrowUp size={28} className="text-white" />
            <span className="text-caption text-white">Save</span>
          </button>
          <button
            onClick={handleCancel}
            aria-label="Cancel transaction"
            className="flex-1 bg-cancel-red rounded-btn py-4 flex flex-col items-center gap-1"
          >
            <ArrowDown size={28} className="text-white" />
            <span className="text-caption text-white">Cancel</span>
          </button>
        </div>
      </main>
    </div>
  )
}
