import Navbar from '@/components/Navbar'
import { useUiStore } from '@/store/uiStore'
import { useTransactions } from '@/hooks/useTransactions'
import { useAudioFeedback } from '@/hooks/useAudioFeedback'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'

export default function ConfirmPage() {
  const pendingTransaction = useUiStore((s) => s.pendingTransaction)
  const clearPending = useUiStore((s) => s.clearPending)
  const { addTransaction } = useTransactions()
  const navigate = useNavigate()
  const { announceClick, announceSuccess } = useAudioFeedback()
  const [touchStart, setTouchStart] = useState(null)
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => {
    if (!pendingTransaction) {
      navigate('/home')
    }
  }, [pendingTransaction, navigate])

  // Announce page load
  useEffect(() => {
    if (!pageLoaded && pendingTransaction) {
      const announcePage = async () => {
        const announcement = `Confirm transaction. Amount: ${pendingTransaction.amount.toFixed(2)} ringgit for ${pendingTransaction.category}. Press Enter to confirm or Escape to cancel.`;
        await announceClick(announcement);
        setPageLoaded(true);
      };
      announcePage();
    }
  }, [pageLoaded, pendingTransaction, announceClick]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Enter') handleConfirm()
      if (event.key === 'Escape') handleCancel()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const handleConfirm = async () => {
    if (pendingTransaction) {
      addTransaction({
        ...pendingTransaction,
        date: new Date().toISOString(),
      })
      clearPending()
      // Mock haptic feedback as mentioned in report
      if (navigator.vibrate) navigator.vibrate([100, 50, 100])
      await announceSuccess(`Transaction confirmed. ${pendingTransaction.amount.toFixed(2)} ringgit saved for ${pendingTransaction.category}.`);
      setTimeout(() => navigate('/home'), 500)
    }
  }

  const handleCancel = async () => {
    clearPending()
    await announceClick('Transaction cancelled. Returning to home.');
    setTimeout(() => navigate('/home'), 100)
  }

  // Swipe gesture detection
  const onTouchStart = (e) => setTouchStart(e.targetTouches[0].clientY)
  const onTouchEnd = (e) => {
    if (!touchStart) return
    const touchEnd = e.changedTouches[0].clientY
    const distance = touchStart - touchEnd
    if (distance > 50) handleConfirm() // Swipe Up
    if (distance < -50) handleCancel() // Swipe Down
  }

  if (!pendingTransaction) return null

  return (
    <>
      <Navbar />
      <main 
        aria-label="Confirm transaction" 
        className="flex flex-col items-center justify-center min-h-screen p-6 bg-black text-white"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="text-center space-y-8 w-full max-w-md">
          <h1 className="text-4xl font-bold text-teal-400">Confirm</h1>
          <div aria-live="assertive" role="status" className="sr-only">
            Confirm RM {pendingTransaction.amount.toFixed(2)} for {pendingTransaction.category}. Press Enter to confirm or Escape to cancel.
          </div>
          
          <div aria-live="polite" className="bg-gray-900 p-8 rounded-3xl border-2 border-gray-700 space-y-4">
            <div>
              <p className="text-gray-400 text-lg">Amount</p>
              <p className="text-5xl font-bold">RM {pendingTransaction.amount.toFixed(2)}</p>
            </div>
            <div className="pt-4 border-t border-gray-800">
              <p className="text-gray-400 text-lg">Category</p>
              <p className="text-3xl font-semibold">{pendingTransaction.category}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4 pt-8">
            <button 
              onClick={handleConfirm}
              className="px-8 py-5 bg-teal-600 text-white rounded-full text-2xl font-bold w-full flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-teal-300"
              aria-label="Confirm transaction. You can also swipe up."
            >
              <Check className="h-7 w-7" aria-hidden="true" />
              Confirm (Swipe Up)
            </button>
            <button 
              onClick={handleCancel}
              className="px-8 py-5 bg-gray-800 text-gray-300 rounded-full text-xl font-bold w-full flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-teal-300"
              aria-label="Cancel transaction. You can also swipe down."
            >
              <X className="h-6 w-6" aria-hidden="true" />
              Cancel (Swipe Down)
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
