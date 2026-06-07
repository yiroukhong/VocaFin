import { useTransactions } from '@/hooks/useTransactions'
import { useAudioFeedback } from '@/hooks/useAudioFeedback'
import { useGesture } from '@use-gesture/react'
import { Car, ChevronLeft, ChevronRight, Pause, Play, Redo, Repeat, ShoppingBag, Undo, Utensils, Volume2, VolumeX, Wallet } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CategoryIcon = ({ category }) => {
  const catLower = category?.toLowerCase() || ''
  if (catLower.includes('food') || catLower.includes('dining')) return <Utensils className="text-[#5c3a21] h-6 w-6" strokeWidth={2} />
  if (catLower.includes('transport')) return <Car className="text-white h-6 w-6" strokeWidth={2} />
  return <ShoppingBag className="text-[#5c3a21] h-6 w-6" strokeWidth={2} />
}

const getCategoryColor = (category) => {
  const catLower = category?.toLowerCase() || ''
  if (catLower.includes('food') || catLower.includes('dining')) return 'bg-[#fcd34d]'
  if (catLower.includes('transport')) return 'bg-[#0ea5e9]'
  return 'bg-[#fecdd3]'
}

export default function HistoryPage() {
  const { transactions } = useTransactions()
  const navigate = useNavigate()
  const { announceNavigation } = useAudioFeedback()
  
  const [monthOffset, setMonthOffset] = useState(0)
  const [pageLoaded, setPageLoaded] = useState(false)
  
  // Audio Player State
  const [playingId, setPlayingId] = useState(null)
  const [audioMode, setAudioMode] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(5000)
  const [repeatMode, setRepeatMode] = useState(false)
  const repeatModeRef = useRef(false)

  // Announce page load
  useEffect(() => {
    if (!pageLoaded) {
      const announcePage = async () => {
        const announcement = 'Transaction history page. Swipe left or right to navigate between months. Press Space to hear all transactions for the current month.';
        await announceNavigation(announcement);
        setPageLoaded(true);
      };
      announcePage();
    }
  }, [pageLoaded, announceNavigation]);

  const displayDate = useMemo(() => {
    const date = new Date()
    date.setMonth(date.getMonth() + monthOffset)
    return date
  }, [monthOffset])

  const monthName = displayDate.toLocaleString('en-US', { month: 'short' })
  const currentMonth = displayDate.getMonth()
  const currentYear = displayDate.getFullYear()

  const groupedTransactions = useMemo(() => {
    const filtered = transactions.filter((tx) => {
      const txDate = new Date(tx.date)
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
    }).sort((a, b) => new Date(b.date) - new Date(a.date))

    return filtered.reduce((acc, tx) => {
      const dateStr = new Date(tx.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
      if (!acc[dateStr]) acc[dateStr] = []
      acc[dateStr].push(tx)
      return acc
    }, {})
  }, [transactions, currentMonth, currentYear])

  // Handles left/right swipe for months
  const bindSwipe = useGesture({
    onDragEnd: ({ movement: [mx], swipe: [swipeX] }) => {
      if (audioMode) return 
      if (swipeX === -1 || mx < -50) setMonthOffset((prev) => prev + 1) 
      if (swipeX === 1 || mx > 50) setMonthOffset((prev) => prev - 1)  
    }
  })

  // --- AUDIO ENGINE ---
  const handleSpeakDay = (date, txs) => {
    if (playingId === date) {
      window.speechSynthesis.cancel()
      setPlayingId(null)
      return
    }
    window.speechSynthesis.cancel()
    
    const total = txs.reduce((sum, tx) => sum + tx.amount, 0)
    const txDetails = txs.map(tx => `${tx.amount} ringgit on ${tx.note || tx.category}`).join(', ')
    const text = `On ${date}, you spent a total of ${total} ringgit. Transactions include: ${txDetails}.`
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-MY'
    utterance.rate = 0.95
    utterance.onend = () => setPlayingId(null)
    utterance.onerror = () => setPlayingId(null)
    
    window.speechSynthesis.speak(utterance)
    setPlayingId(date)
  }

  // --- FULLSCREEN AUDIO PLAYER LOGIC ---
  const currentTextRef = useRef("") 
  const currentUtteranceRef = useRef(null) 

  const startAudioPlayer = (mode, text, options = {}) => {
    if (currentUtteranceRef.current) {
      currentUtteranceRef.current.onend = null
      currentUtteranceRef.current.onerror = null 
    }

    window.speechSynthesis.cancel()
    if (!options.keepRepeatMode) {
      repeatModeRef.current = false
      setRepeatMode(false)
    }
    setAudioMode(mode)
    setIsPaused(false)
    setProgress(0)
    currentTextRef.current = text

    const utterance = new SpeechSynthesisUtterance(text)
    currentUtteranceRef.current = utterance
    utterance.lang = 'en-MY'
    utterance.rate = 0.95

    const words = text.split(' ').length
    const estSeconds = Math.max(words / 2.5, 3)
    setEstimatedTime(estSeconds * 1000)

    utterance.onend = () => {
      if (repeatModeRef.current) {
        startAudioPlayer(mode, text, { keepRepeatMode: true })
        return
      }
      setAudioMode(null)
    }
    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') return
      setAudioMode(null)
    }

    setTimeout(() => {
      window.speechSynthesis.speak(utterance)
    }, 50)
  }

  const handleHearAll = () => {
    const txs = Object.values(groupedTransactions).flat()
    const total = txs.reduce((sum, tx) => sum + tx.amount, 0)

    if (txs.length === 0) {
      startAudioPlayer('All', `You have no transactions for ${monthName}.`)
      return
    }

    const txDetails = txs
      .map((tx) => `${Number(tx.amount).toFixed(2)} ringgit for ${tx.note || tx.category} on ${new Date(tx.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`)
      .join('. ')

    startAudioPlayer('All', `Hear all expenses for ${monthName}. You spent a total of ${total.toFixed(2)} ringgit across ${txs.length} transactions. ${txDetails}.`)
  }

  const handleHearByWeek = () => {
    const monthTxs = Object.values(groupedTransactions).flat()
    if (monthTxs.length === 0) {
      startAudioPlayer('By Week', `You have no weekly transactions for ${monthName}.`)
      return
    }

    let w1 = 0, w2 = 0, w3 = 0, w4 = 0
    monthTxs.forEach(tx => {
      const day = new Date(tx.date).getDate()
      if (day <= 7) w1 += tx.amount
      else if (day <= 14) w2 += tx.amount
      else if (day <= 21) w3 += tx.amount
      else w4 += tx.amount
    })

    const weeks = [{ name: 'Week 1', total: w1 }, { name: 'Week 2', total: w2 }, { name: 'Week 3', total: w3 }, { name: 'Week 4', total: w4 }]
    const highestWeek = weeks.reduce((max, week) => week.total > max.total ? week : max, weeks[0])

    let speechText = `Hear by week for ${monthName}. `
    if (w1 > 0) speechText += `Week 1, ${w1.toFixed(2)} ringgit. `
    if (w2 > 0) speechText += `Week 2, ${w2.toFixed(2)} ringgit. `
    if (w3 > 0) speechText += `Week 3, ${w3.toFixed(2)} ringgit. `
    if (w4 > 0) speechText += `Week 4, ${w4.toFixed(2)} ringgit. `
    speechText += `Your highest spending was in ${highestWeek.name} at ${highestWeek.total.toFixed(2)} ringgit.`

    startAudioPlayer('By Week', speechText)
  }

  const togglePlayPause = () => {
    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    } else {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }

  const restartPlayer = () => {
    startAudioPlayer(audioMode, currentTextRef.current, { keepRepeatMode: true })
  }

  const toggleRepeatMode = () => {
    setRepeatMode((current) => {
      const next = !current
      repeatModeRef.current = next
      return next
    })
  }

  const closePlayer = () => {
    if (currentUtteranceRef.current) {
      currentUtteranceRef.current.onend = null
      currentUtteranceRef.current.onerror = null
    }
    window.speechSynthesis.cancel()
    repeatModeRef.current = false
    setRepeatMode(false)
    setAudioMode(null)
  }

  useEffect(() => {
    let interval;
    if (audioMode && !isPaused && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => Math.min(p + (100 / (estimatedTime / 100)), 100))
      }, 100)
    }
    return () => clearInterval(interval)
  }, [audioMode, isPaused, progress, estimatedTime])

  useEffect(() => {
    return () => window.speechSynthesis.cancel()
  }, [])

  // ==========================================
  // GLOBAL GESTURE ENGINE (Double Tap, Long Press, 2-Finger Swipe)
  // ==========================================
  const lastTapTime = useRef(0)
  const touchStartY = useRef(0)
  const globalLongPressTimer = useRef(null)
  const isTwoFinger = useRef(false)

  const handleTouchStart = (e) => {
    // Prevent triggering on interactive elements like buttons
    if (e.target.closest('button')) return;

    // 1. Long Press setup (Emergency Cancel to Home)
    globalLongPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      window.speechSynthesis.cancel();
      navigate('/home');
    }, 800);

    // 2. Double Tap setup (Jump to Voice Logger)
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime.current;
    
    if (tapLength > 0 && tapLength < 300) {
      clearTimeout(globalLongPressTimer.current);
      if (navigator.vibrate) navigator.vibrate(50);
      window.speechSynthesis.cancel();
      navigate('/log');
      e.preventDefault();
    }
    lastTapTime.current = currentTime;

    // 3. Swipe setup
    touchStartY.current = e.touches[0].clientY;
    isTwoFinger.current = e.touches.length === 2;
  };

  const handleTouchMove = (e) => {
    clearTimeout(globalLongPressTimer.current);
    if (e.touches.length === 2) {
      isTwoFinger.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    clearTimeout(globalLongPressTimer.current);
    
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;

    // Two-Finger Vertical Swipe Action (Read last 3 transactions)
    if (Math.abs(deltaY) > 50 && isTwoFinger.current) {
      const last3 = transactions.slice(0, 3);
      if (last3.length === 0) {
        startAudioPlayer('Recent', 'No recent transactions found.');
      } else {
        const textToRead = last3.map(t => `${t.note || t.category}, ${t.amount.toFixed(2)} ringgit.`).join(' ');
        startAudioPlayer('Recent', `Reading your last ${last3.length} transactions. ${textToRead}`);
      }
    }
    isTwoFinger.current = false;
  };

  // Dedicated button long presses
  const handlePointerDown = () => {
    globalLongPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50])
      window.speechSynthesis.cancel()
      navigate('/home')
    }, 800)
  }
  const cancelLongPress = () => clearTimeout(globalLongPressTimer.current)

  const handlePlayerPointerDown = () => {
    globalLongPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50])
      closePlayer()
    }, 800)
  }
  const cancelPlayerLongPress = () => clearTimeout(globalLongPressTimer.current)


  // ==========================================
  // RENDER FULLSCREEN PLAYER
  // ==========================================
  if (audioMode) {
    return (
      <div 
        className="flex flex-col h-screen bg-[#0a0a0a] text-white select-none overflow-hidden items-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <main className="flex-1 flex flex-col items-center justify-center w-full px-8">
          
          <h2 className="text-4xl font-bold mb-16 text-center leading-tight tracking-wide">
            Playing<br/>{audioMode}<br/>Expenses
          </h2>
          <p className="sr-only" aria-live="polite">
            {repeatMode ? 'Repeat mode on.' : 'Repeat mode off.'}
          </p>

          <div 
            className="relative flex items-center justify-center mb-16 cursor-pointer active:scale-95 transition-transform" 
            onClick={togglePlayPause}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            <div className={`absolute w-72 h-72 border border-[#22d3ee]/30 rounded-full ${!isPaused ? 'animate-[ping_3s_ease-in-out_infinite]' : ''}`} />
            <div className={`absolute w-56 h-56 border border-[#22d3ee]/50 rounded-full ${!isPaused ? 'animate-pulse' : ''}`} />
            <div className="absolute w-40 h-40 border-2 border-[#22d3ee] rounded-full" />
            
            <div className="relative z-10 w-24 h-24 flex items-center justify-center bg-[#0a0a0a] rounded-full">
              {isPaused 
                ? <Play size={50} className="text-[#22d3ee] ml-2" fill="currentColor" /> 
                : <Pause size={50} className="text-[#22d3ee]" fill="currentColor" />
              }
            </div>
          </div>

          <div className="w-full max-w-[280px] h-5 border-2 border-white p-[2px] mb-12 relative rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#22d3ee] transition-all duration-100 ease-linear rounded-full" 
              style={{ width: `${progress}%` }} 
            />
          </div>

          <div className="flex items-center justify-between w-full max-w-[320px] text-gray-400">
            <button onClick={restartPlayer} className="p-6 active:text-white active:scale-90 transition-all rounded-full" aria-label="Restart summary from the beginning">
              <Undo size={44} strokeWidth={2} />
            </button>
            <button
              onClick={toggleRepeatMode}
              className={`p-6 active:text-white active:scale-90 transition-all rounded-full ${repeatMode ? 'text-[#22d3ee] bg-[#22d3ee]/10 ring-2 ring-[#22d3ee]' : ''}`}
              aria-label={repeatMode ? 'Turn repeat mode off' : 'Turn repeat mode on'}
              aria-pressed={repeatMode}
            >
              <Repeat size={44} strokeWidth={2} />
            </button>
            <button onClick={closePlayer} className="p-6 active:text-white active:scale-90 transition-all rounded-full" aria-label="Exit audio player and return to History">
              <Redo size={44} strokeWidth={2} />
            </button>
          </div>

        </main>

        <div className="p-6 pt-2 pb-8 w-full">
          <button
            onPointerDown={handlePlayerPointerDown}
            onPointerUp={cancelPlayerLongPress}
            onPointerLeave={cancelPlayerLongPress}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full py-4 border border-gray-600 rounded-lg text-gray-300 font-bold text-xl active:bg-white/10 active:scale-[0.98] transition-all"
          >
            Long press to Back
          </button>
        </div>
      </div>
    )
  }

  // ==========================================
  // RENDER NORMAL HISTORY LIST
  // ==========================================
  return (
    <div 
      {...bindSwipe()} 
      className="flex flex-col h-screen bg-[#0a0a0a] text-white select-none overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <header className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0a0a0a] shrink-0">
        <div className="flex items-center gap-3">
          <Wallet className="h-7 w-7 text-[#fdba74]" strokeWidth={2} />
          <h1 className="text-3xl font-bold tracking-wide">History</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <p className="text-gray-500 text-sm hidden sm:block">Swipe or click</p>
          <div className="bg-white text-black flex items-center rounded shadow-sm">
            <button onClick={() => setMonthOffset((prev) => prev - 1)} className="p-2 active:bg-gray-300 rounded-l">
              <ChevronLeft size={28} strokeWidth={3} />
            </button>
            <span className="text-3xl font-bold tracking-wide px-2 min-w-[4ch] text-center">{monthName}</span>
            <button onClick={() => setMonthOffset((prev) => prev + 1)} className="p-2 active:bg-gray-300 rounded-r">
              <ChevronRight size={28} strokeWidth={3} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-8" aria-live="polite">
        
        {Object.entries(groupedTransactions).map(([date, txs]) => (
          <div key={date} className="space-y-3">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-3xl font-medium tracking-wide">{date}</h2>
              <button 
                onClick={() => handleSpeakDay(date, txs)}
                className={`${playingId === date ? 'text-red-400 bg-red-900/20' : 'text-[#38bdf8]'} p-2 rounded-full active:bg-white/10 transition-colors`}
              >
                {playingId === date ? <VolumeX size={36} strokeWidth={2.5} /> : <Volume2 size={36} strokeWidth={2.5} />}
              </button>
            </div>

            <div className="space-y-3">
              {txs.map((tx) => (
                <div key={tx.id} tabIndex="0" className="border border-gray-600 rounded-xl p-3 flex items-center gap-4 bg-[#111] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all">
                  <div className={`p-3 rounded-full ${getCategoryColor(tx.category)}`}>
                    <CategoryIcon category={tx.category} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-lg truncate">{tx.note || tx.category}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {tx.category} • {new Date(tx.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                  <p className="font-mono font-bold text-lg tracking-tight whitespace-nowrap">
                    -RM {tx.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedTransactions).length === 0 && (
          <div className="text-center text-gray-500 pt-12">
            <p className="text-xl">No transactions for {monthName}.</p>
            <p className="text-sm mt-4 p-4 border border-gray-800 rounded-xl inline-block">Click and drag left/right to change months.</p>
          </div>
        )}

        <div className="pt-8 space-y-4">
          <button 
            onClick={handleHearAll}
            className="w-full bg-[#eae0d5] text-[#5c3a21] rounded-xl py-6 flex items-center justify-center gap-4 active:bg-[#d8cbbd] transition-colors"
            aria-label="Hear all expenses for this month"
          >
             <Volume2 size={32} strokeWidth={2.5} />
            <span className="text-3xl font-bold">Hear All</span>
          </button>

          <button 
            onClick={handleHearByWeek}
            className="w-full bg-[#eae0d5] text-[#5c3a21] rounded-xl py-6 flex items-center justify-center gap-4 active:bg-[#d8cbbd] transition-colors"
            aria-label="Hear expenses by week for this month"
          >
            <Volume2 size={32} strokeWidth={2.5} />
            <span className="text-3xl font-bold">Hear By Week</span>
          </button>
        </div>

        <div className="pt-4 pb-8">
          <button
            onPointerDown={handlePointerDown}
            onPointerUp={cancelLongPress}
            onPointerLeave={cancelLongPress}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full py-5 border border-gray-600 bg-[#111] rounded-lg text-gray-300 font-bold text-xl active:bg-white/10 active:scale-[0.98] transition-all"
          >
            Long press to Home
          </button>
        </div>
      </main>
    </div>
  )
}