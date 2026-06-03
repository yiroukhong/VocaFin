import { useTransactions } from '@/hooks/useTransactions'
import { useVoiceInput } from '@/hooks/useVoiceInput'
import { parseSpokenExpense, speakText } from '@/utils/financeAccessibility'
import { ArrowDown, ArrowUp, Car, Check, Mic, RefreshCcw, ShoppingBag, Utensils, Wallet } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CategoryIcon = ({ category }) => {
  const catLower = category?.toLowerCase() || ''
  if (catLower.includes('food') || catLower.includes('dining')) return <Utensils className="text-black h-6 w-6" strokeWidth={2} />
  if (catLower.includes('transport')) return <Car className="text-white h-6 w-6" strokeWidth={2} />
  return <ShoppingBag className="text-black h-6 w-6" strokeWidth={2} />
}

export default function LogExpensePage() {
  const navigate = useNavigate()
  const { addTransaction } = useTransactions()
  
  // Stages: 'idle' -> 'listening' -> 'processing' -> 'error' -> 'confirm' -> 'saving' -> 'saved'
  const [stage, setStage] = useState('idle') 
  const [draftExpense, setDraftExpense] = useState(null)
  
  // Voice Hook
  const { transcript, error: micError, startListening, stopListening } = useVoiceInput((finalText) => {
    console.log('🎙️ [VOICE DEBUG] Raw text heard:', `"${finalText}"`)

    if (!finalText || !finalText.trim()) {
      setStage('error')
      speakText("Sorry, I didn't catch that. Please try again.")
      return
    }

    const parsed = parseSpokenExpense(finalText)

    if (parsed.needsAmount || parsed.needsCategory || parsed.amount === 0) {
      setStage('error')
      speakText("Sorry, I didn't catch that. Please try again.")
      return
    }

    setDraftExpense(parsed)
    setStage('confirm')
    speakText(`Confirming. ${parsed.amount.toFixed(2)} ringgit for ${parsed.category}.`)
  })

  const beginListening = useCallback(() => {
    setStage('listening')
    setDraftExpense(null)
    startListening()
    if (navigator.vibrate) navigator.vibrate(60)
  }, [startListening])

  const finishListening = useCallback(() => {
    setStage('processing')
    stopListening()
    if (navigator.vibrate) navigator.vibrate([30, 50, 30])
  }, [stopListening])

  const handleScreenTap = () => {
    if (stage === 'idle' || stage === 'error') {
      beginListening()
    } else if (stage === 'listening') {
      finishListening()
    }
  }

  // --- UPDATED SAVE FUNCTION ---
  const handleSave = useCallback(() => {
    if (!draftExpense) return
    setStage('saving')
    
    setTimeout(() => {
      addTransaction({
        amount: draftExpense.amount,
        category: draftExpense.category,
        note: draftExpense.note,
        date: new Date().toISOString(),
      })
      if (navigator.vibrate) navigator.vibrate([100, 50, 100])
      
      // Instead of navigating home, show the Saved screen!
      setStage('saved')
      speakText("Expense saved successfully.")
    }, 1500)
  }, [addTransaction, draftExpense])

  const handleCancel = useCallback(() => {
    stopListening()
    window.speechSynthesis?.cancel()
    navigate('/home')
  }, [navigate, stopListening])

  useEffect(() => {
    if (micError) {
      console.error('❌ [VOICE DEBUG] System Microphone Error:', micError)
      setStage('error')
    }
  }, [micError])

  useEffect(() => {
    return () => {
      stopListening()
      window.speechSynthesis?.cancel()
    }
  }, [stopListening])

  // --- Long Press Logic ---
  const longPressTimer = useRef(null)

  const handlePointerDown = () => {
    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50])
      handleCancel()
    }, 800)
  }

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const bottomText = (stage === 'listening' || stage === 'processing') ? 'Long press to Cancel' : 'Long press to Home'

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white select-none overflow-hidden">
      
      <header className="flex items-center gap-3 p-4 border-b border-gray-800 bg-[#0a0a0a] shrink-0 z-20">
        <Wallet className="h-6 w-6 text-[#fdba74]" strokeWidth={2} />
        <h1 className="text-2xl font-bold tracking-wide">Voice</h1>
      </header>

      <main className="flex-1 flex flex-col w-full relative" aria-live="polite">
        
        {stage === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center w-full cursor-pointer active:bg-white/5 transition-colors" onClick={handleScreenTap}>
            <div className="relative flex items-center justify-center mb-24">
              <div className="absolute w-40 h-40 border-2 border-gray-600 rounded-full" />
              <div className="relative z-10 w-24 h-24 flex items-center justify-center">
                <Mic size={56} className="text-gray-400" strokeWidth={2} />
              </div>
            </div>
            <div className="text-center px-8 h-24">
              <p className="text-3xl font-mono font-bold leading-relaxed tracking-wide text-gray-400">Tap to speak</p>
            </div>
          </div>
        )}

        {stage === 'listening' && (
          <div className="flex-1 flex flex-col items-center justify-center w-full cursor-pointer active:bg-white/5 transition-colors" onClick={handleScreenTap}>
            <div className="relative flex items-center justify-center mb-24">
              <div className="absolute w-72 h-72 border border-[#22d3ee]/30 rounded-full animate-[ping_3s_ease-in-out_infinite]" />
              <div className="absolute w-56 h-56 border border-[#22d3ee]/50 rounded-full animate-pulse" />
              <div className="absolute w-40 h-40 border-2 border-[#22d3ee] rounded-full" />
              <div className="relative z-10 w-24 h-24 flex items-center justify-center">
                <Mic size={56} className="text-[#22d3ee]" strokeWidth={2} />
              </div>
            </div>
            <div className="text-center px-8 h-24">
              <p className="text-3xl font-mono font-bold leading-relaxed tracking-wide text-gray-200">
                {transcript || 'Log ..'}
              </p>
              <p className="text-gray-500 mt-4 animate-pulse">Tap to stop</p>
            </div>
          </div>
        )}

        {stage === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="relative flex items-center justify-center mb-24 h-40 w-40">
              <RefreshCcw size={56} className="text-[#22d3ee] animate-spin" strokeWidth={2} />
            </div>
            <div className="text-center px-8 h-24">
              <p className="text-3xl font-mono font-bold tracking-wide text-[#22d3ee]">Processing..</p>
            </div>
          </div>
        )}

        {stage === 'error' && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center text-[#ffb3a7] cursor-pointer active:bg-white/5 transition-colors w-full" onClick={handleScreenTap}>
            <div className="w-24 h-24 border-4 border-[#ffb3a7] rounded-full flex items-center justify-center mb-8">
              <span className="text-5xl font-bold">!</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">Microphone<br/>Unavailable</h2>
            <p className="text-lg mb-8 text-[#ffb3a7]/80">
              {micError === 'network' 
                ? "Network error. Speech recognition requires an active internet connection." 
                : "Please speak clearly or tap to try again."}
            </p>

            <div className="w-full max-w-sm mb-6" onClick={(e) => e.stopPropagation()}>
              <p className="text-white text-sm mb-2 font-bold uppercase tracking-widest opacity-50">Manual Fallback</p>
              <input
                type="text"
                autoFocus
                placeholder="Type here (e.g., 15 for lunch)"
                className="w-full bg-[#1a1a1a] text-white p-4 rounded-2xl text-center text-xl border-2 border-gray-700 focus:border-[#22d3ee] outline-none transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const parsed = parseSpokenExpense(e.target.value);
                    if (!parsed.needsAmount && !parsed.needsCategory) {
                      setDraftExpense(parsed);
                      setStage('confirm');
                    } else {
                      speakText("Please include both an amount and a category.");
                    }
                  }
                }}
              />
            </div>
            <p className="text-gray-400 font-bold tracking-widest uppercase mt-4 animate-pulse">Or tap anywhere to retry voice</p>
          </div>
        )}

        {stage === 'confirm' && draftExpense && (
          <div className="flex-1 flex flex-col items-center justify-center w-full px-6">
            <div className="bg-[#1a1a1a] rounded-3xl p-8 w-full flex flex-col items-center mb-6">
              <h2 className="text-3xl font-bold mb-4">{draftExpense.note || 'Expense'}</h2>
              <p className="text-5xl font-bold text-[#fdba74] mb-8">RM {draftExpense.amount.toFixed(2)}</p>
              <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-2xl w-full justify-center">
                <div className="bg-[#2a2a2a] p-2 rounded-lg">
                  <CategoryIcon category={draftExpense.category} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-gray-400 text-sm font-semibold">Category:</span>
                  <span className="text-xl font-bold">{draftExpense.category}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <button onClick={handleSave} className="bg-[#1a1a1a] rounded-3xl py-10 flex flex-col items-center active:bg-[#222] transition-colors">
                <ArrowUp className="text-[#4ade80] mb-4" size={56} strokeWidth={2.5} />
                <span className="text-3xl font-bold">Save</span>
              </button>
              <button onClick={handleCancel} className="bg-[#1a1a1a] rounded-3xl py-10 flex flex-col items-center active:bg-[#222] transition-colors">
                <ArrowDown className="text-[#ff6b6b] mb-4" size={56} strokeWidth={2.5} />
                <span className="text-3xl font-bold">Cancel</span>
              </button>
            </div>
          </div>
        )}

        {stage === 'saving' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-[#0a0a0a]">
            <div className="absolute inset-0 opacity-10 flex flex-col items-center justify-center pointer-events-none px-6">
               <h2 className="text-4xl font-bold mb-4">{draftExpense?.note || 'Expense'}</h2>
               <p className="text-5xl font-bold mb-8 text-[#fdba74]">RM {draftExpense?.amount?.toFixed(2)}</p>
               <CategoryIcon category={draftExpense?.category} />
            </div>
            <div className="z-10 flex flex-col items-center">
              <h2 className="text-5xl font-bold mb-12 tracking-wide">Saving..</h2>
              <RefreshCcw size={100} className="animate-spin text-white" strokeWidth={1} />
            </div>
          </div>
        )}

        {/* --- NEW: STATE 7: SAVED --- */}
        {stage === 'saved' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-[#0a0a0a]">
            {/* The background stays faded, just like Figma */}
            <div className="absolute inset-0 opacity-10 flex flex-col items-center justify-center pointer-events-none px-6">
               <h2 className="text-4xl font-bold mb-4">{draftExpense?.note || 'Expense'}</h2>
               <p className="text-5xl font-bold mb-8 text-[#fdba74]">RM {draftExpense?.amount?.toFixed(2)}</p>
               <CategoryIcon category={draftExpense?.category} />
            </div>
            
            <div className="z-10 flex flex-col items-center w-full px-8">
              <h2 className="text-5xl font-bold mb-10 tracking-wide">Saved!</h2>
              <div className="bg-white rounded-full p-6 mb-16 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                <Check size={80} className="text-black" strokeWidth={4} />
              </div>
              
              <button 
                onClick={() => {
                  setStage('idle')
                  setDraftExpense(null)
                }} 
                className="w-full max-w-[280px] bg-[#1a1a1a] border border-gray-800 rounded-3xl py-8 flex flex-col items-center active:bg-[#222] transition-colors"
              >
                <ArrowUp size={48} className="text-[#4ade80] mb-3" strokeWidth={3} />
                <span className="text-2xl font-bold text-gray-200">New Entry</span>
              </button>
            </div>
          </div>
        )}

      </main>

      <div className="p-6 pt-2 pb-8 z-20 bg-[#0a0a0a]">
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={cancelLongPress}
          onPointerLeave={cancelLongPress}
          onContextMenu={(e) => e.preventDefault()}
          className="w-full py-4 border border-gray-600 rounded-lg text-gray-300 font-semibold text-lg active:bg-white/10 active:scale-[0.98] transition-all"
        >
          {bottomText}
        </button>
      </div>

    </div>
  )
}
