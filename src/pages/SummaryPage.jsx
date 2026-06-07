import { useBudget } from '@/hooks/useBudget'
import { useTransactions } from '@/hooks/useTransactions'
import { useAudioFeedback } from '@/hooks/useAudioFeedback'
import { getCategoryTotals } from '@/utils/financeAccessibility'
import { Pause, Play, Redo, Repeat, Undo, Volume2, VolumeX, Wallet } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SummaryPage() {
  const { remainingBudget, totalSpentThisMonth } = useBudget()
  const { transactions } = useTransactions()
  const navigate = useNavigate()
  const { announceNavigation } = useAudioFeedback()

  const [audioMode, setAudioMode] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(5000)
  const [repeatMode, setRepeatMode] = useState(false)
  const [isReadingCategories, setIsReadingCategories] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)

  const currentTextRef = useRef('')
  const currentUtteranceRef = useRef(null)
  const repeatModeRef = useRef(false)
  const longPressTimer = useRef(null)
  const playerLongPressTimer = useRef(null)

  const categoryTotals = useMemo(() => getCategoryTotals(transactions), [transactions])
  const topCategories = useMemo(() => (
    Object.entries(categoryTotals).sort(([, a], [, b]) => b - a).slice(0, 3)
  ), [categoryTotals])

  const now = new Date()
  const monthName = now.toLocaleString('en-US', { month: 'short' })

  // Announce page load
  useEffect(() => {
    if (!pageLoaded) {
      const announcePage = async () => {
        const budgetInfo = `Budget summary. Total spent this month: ${totalSpentThisMonth.toFixed(2)} ringgit. Remaining budget: ${remainingBudget.toFixed(2)} ringgit.`;
        const navigationHelp = 'Press W for weekly summary, M for monthly summary, or C for top categories.';
        await announceNavigation(`${budgetInfo} ${navigationHelp}`);
        setPageLoaded(true);
      };
      announcePage();
    }
  }, [pageLoaded, totalSpentThisMonth, remainingBudget, announceNavigation]);

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
    utterance.onerror = (event) => {
      if (event.error === 'canceled' || event.error === 'interrupted') return
      setAudioMode(null)
    }

    setTimeout(() => {
      window.speechSynthesis.speak(utterance)
    }, 50)
  }

  const handleHearWeekly = () => {
    if (transactions.length === 0) {
      startAudioPlayer('Weekly', `You have no transactions for ${monthName}.`)
      return
    }

    let w1 = 0
    let w2 = 0
    let w3 = 0
    let w4 = 0

    transactions.forEach((tx) => {
      const txDate = new Date(tx.date)
      if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return

      const day = txDate.getDate()
      if (day <= 7) w1 += tx.amount
      else if (day <= 14) w2 += tx.amount
      else if (day <= 21) w3 += tx.amount
      else w4 += tx.amount
    })

    const weeks = [{ name: 'Week 1', total: w1 }, { name: 'Week 2', total: w2 }, { name: 'Week 3', total: w3 }, { name: 'Week 4', total: w4 }]
    const highestWeek = weeks.reduce((max, week) => (week.total > max.total ? week : max), weeks[0])

    let speechText = `Weekly summary for ${monthName}. `
    if (w1 > 0) speechText += `Week 1, ${w1.toFixed(2)} ringgit. `
    if (w2 > 0) speechText += `Week 2, ${w2.toFixed(2)} ringgit. `
    if (w3 > 0) speechText += `Week 3, ${w3.toFixed(2)} ringgit. `
    if (w4 > 0) speechText += `Week 4, ${w4.toFixed(2)} ringgit. `

    if (highestWeek.total === 0) {
      speechText += `You have no spending recorded this month.`
    } else {
      speechText += `Your highest spending was in ${highestWeek.name} at ${highestWeek.total.toFixed(2)} ringgit.`
    }

    startAudioPlayer('Weekly', speechText)
  }

  const handleHearMonthly = () => {
    const monthTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.date)
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()
    })
    const total = monthTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    const remainingText = remainingBudget < 0
      ? `You are over budget by ${Math.abs(remainingBudget).toFixed(2)} ringgit.`
      : `Your remaining budget is ${remainingBudget.toFixed(2)} ringgit.`

    startAudioPlayer('Monthly', `For the month of ${monthName}, you have spent a total of ${total.toFixed(2)} ringgit across ${monthTransactions.length} transactions. ${remainingText}`)
  }

  const handleHearTopCategories = () => {
    if (isReadingCategories) {
      window.speechSynthesis.cancel()
      setIsReadingCategories(false)
      return
    }

    if (topCategories.length === 0) {
      const utterance = new SpeechSynthesisUtterance('You have no category spending yet.')
      utterance.lang = 'en-MY'
      utterance.rate = 0.95
      utterance.onend = () => setIsReadingCategories(false)
      utterance.onerror = () => setIsReadingCategories(false)
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
      setIsReadingCategories(true)
      return
    }

    const categoryText = topCategories
      .map(([category, amount], index) => `Number ${index + 1}, ${category}, ${amount.toFixed(2)} ringgit`)
      .join('. ')

    const utterance = new SpeechSynthesisUtterance(`Top categories. ${categoryText}.`)
    utterance.lang = 'en-MY'
    utterance.rate = 0.95
    utterance.onend = () => setIsReadingCategories(false)
    utterance.onerror = () => setIsReadingCategories(false)

    window.speechSynthesis.cancel()
    setAudioMode(null)
    setIsReadingCategories(true)
    window.speechSynthesis.speak(utterance)
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

  // ==========================================
  // GLOBAL GESTURE ENGINE (Double Tap, Long Press, 2-Finger Swipe)
  // ==========================================
  const lastTapTime = useRef(0)
  const touchStartY = useRef(0)
  const globalLongPressTimer = useRef(null)
  const isTwoFinger = useRef(false)

  const handleTouchStart = (e) => {
    // Prevent triggering on interactive elements like buttons
    if (e.target.closest('button') || e.target.closest('input')) return;

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
      window.speechSynthesis.cancel();
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

  // Dedicated bottom button long presses
  const handlePointerDown = () => {
    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50])
      window.speechSynthesis.cancel()
      navigate('/home')
    }, 800)
  }

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handlePlayerPointerDown = () => {
    playerLongPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50])
      closePlayer()
    }, 800)
  }

  const cancelPlayerLongPress = () => {
    if (playerLongPressTimer.current) {
      clearTimeout(playerLongPressTimer.current)
      playerLongPressTimer.current = null
    }
  }

  useEffect(() => {
    let interval
    if (audioMode && !isPaused && progress < 100) {
      interval = setInterval(() => {
        setProgress((currentProgress) => Math.min(currentProgress + (100 / (estimatedTime / 100)), 100))
      }, 100)
    }
    return () => clearInterval(interval)
  }, [audioMode, estimatedTime, isPaused, progress])

  useEffect(() => {
    return () => window.speechSynthesis?.cancel()
  }, [])

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
            Playing<br />{audioMode}<br />Expenses
          </h2>
          <p className="sr-only" aria-live="polite">
            {repeatMode ? 'Repeat mode on.' : 'Repeat mode off.'}
          </p>

          <button
            type="button"
            className="relative flex items-center justify-center mb-16 cursor-pointer active:scale-95 transition-transform"
            onClick={togglePlayPause}
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            <div className={`absolute w-72 h-72 border border-[#22d3ee]/30 rounded-full ${!isPaused ? 'animate-[ping_3s_ease-in-out_infinite]' : ''}`} />
            <div className={`absolute w-56 h-56 border border-[#22d3ee]/50 rounded-full ${!isPaused ? 'animate-pulse' : ''}`} />
            <div className="absolute w-40 h-40 border-2 border-[#22d3ee] rounded-full" />

            <div className="relative z-10 w-24 h-24 flex items-center justify-center bg-[#0a0a0a] rounded-full">
              {isPaused
                ? <Play size={50} className="text-[#22d3ee] ml-2" fill="currentColor" />
                : <Pause size={50} className="text-[#22d3ee]" fill="currentColor" />}
            </div>
          </button>

          <div className="w-full max-w-[280px] h-5 border-2 border-white p-[2px] mb-12 relative rounded-full overflow-hidden" role="progressbar" aria-label={`${audioMode} summary progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)}>
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
            <button onClick={closePlayer} className="p-6 active:text-white active:scale-90 transition-all rounded-full" aria-label="Exit audio player and return to Summary">
              <Redo size={44} strokeWidth={2} />
            </button>
          </div>
        </main>

        <div className="p-6 pt-2 pb-8 w-full">
          <button
            onPointerDown={handlePlayerPointerDown}
            onPointerUp={cancelPlayerLongPress}
            onPointerLeave={cancelPlayerLongPress}
            onContextMenu={(event) => event.preventDefault()}
            className="w-full py-4 border border-gray-600 rounded-lg text-gray-300 font-bold text-xl active:bg-white/10 active:scale-[0.98] transition-all"
          >
            Long press to Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <main 
      className="min-h-screen bg-[#12100e] text-[#eae0d5] p-6 pb-24"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <header className="flex items-center gap-3 mb-8">
        <Wallet className="h-8 w-8 text-[#d6b491]" />
        <h1 className="text-4xl font-bold tracking-tight">Summary</h1>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Monthly Overview</h2>
        <p className="text-gray-400 mb-4">Current month summary</p>

        <div className="border-2 border-[#3d3832] p-6 mb-4">
          <p className="text-xl mb-1">Spent</p>
          <p className="text-5xl font-bold">RM {totalSpentThisMonth.toFixed(2)}</p>
        </div>

        <div className="border-2 border-[#22d3ee] p-6">
          <p className="text-xl mb-1">{remainingBudget < 0 ? 'Over Budget' : 'Remaining'}</p>
          <p className="text-5xl font-bold text-[#22d3ee]">RM {Math.abs(remainingBudget).toFixed(2)}</p>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Top Categories</h2>
          <button
            onClick={handleHearTopCategories}
            className={`${isReadingCategories ? 'text-red-400 bg-red-900/20' : 'text-[#22d3ee]'} p-2 rounded-full active:bg-white/10 active:scale-95 transition-all`}
            aria-label={isReadingCategories ? 'Stop reading top categories' : 'Read top categories aloud'}
          >
            {isReadingCategories ? <VolumeX className="h-8 w-8" strokeWidth={2.5} /> : <Volume2 className="h-8 w-8" strokeWidth={2.5} />}
          </button>
        </div>

        <div className="space-y-4 text-2xl font-bold">
          {topCategories.map(([cat, amt]) => (
            <div key={cat} className="flex justify-between border-b border-[#3d3832] pb-4">
              <span>{cat}</span>
              <span>RM {amt.toFixed(2)}</span>
            </div>
          ))}
          {topCategories.length === 0 && <p className="text-gray-400 text-xl">No spending data yet.</p>}
        </div>
      </section>

      <div className="space-y-4 mb-8">
        <button onClick={handleHearWeekly} className="w-full bg-[#eae0d5] text-[#5c3a21] rounded-xl py-6 flex items-center justify-center gap-4 active:bg-[#d8cbbd] transition-colors" aria-label="Hear weekly summary">
          <Volume2 size={32} strokeWidth={2.5} />
          <span className="text-3xl font-bold">Weekly Summary</span>
        </button>
        <button onClick={handleHearMonthly} className="w-full bg-[#eae0d5] text-[#5c3a21] rounded-xl py-6 flex items-center justify-center gap-4 active:bg-[#d8cbbd] transition-colors" aria-label="Hear monthly summary">
          <Volume2 size={32} strokeWidth={2.5} />
          <span className="text-3xl font-bold">Monthly Summary</span>
        </button>
      </div>

      <button
        onPointerDown={handlePointerDown}
        onPointerUp={cancelLongPress}
        onPointerLeave={cancelLongPress}
        onContextMenu={(event) => event.preventDefault()}
        className="w-full py-5 border border-gray-600 bg-[#111] rounded-lg text-gray-300 font-bold text-xl active:bg-white/10 active:scale-[0.98] transition-all"
      >
        Long press to Home
      </button>
    </main>
  )
}