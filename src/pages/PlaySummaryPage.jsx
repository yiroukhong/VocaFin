import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Play, Pause, SkipBack, SkipForward, RefreshCw } from 'lucide-react'
import VoiceRings from '@/components/VoiceRings'

export default function PlaySummaryPage() {
  const navigate = useNavigate()
  const { type } = useParams()
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)

  const title = type === 'weekly' ? 'Weekly' : 'Monthly'

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { setIsPlaying(false); return 100 }
          return p + (100 / (5000 / 100))
        })
      }, 100)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying])

  function handleSkipBack()    { setProgress(0); setIsPlaying(false) }
  function handleReplay()      { setProgress(0); setIsPlaying(false) }
  function handleSkipForward() { setProgress(100); setIsPlaying(false) }

  return (
    <div className="screen-container bg-bg-base">
      <main
        aria-label={`Playing ${title} Summary`}
        className="flex-1 flex flex-col items-center justify-center gap-8 px-screen"
      >
        {/* Title */}
        <h1 className="text-display font-extrabold text-center leading-snug">
          Playing<br />{title}<br />Summary
        </h1>

        {/* Rings with play/pause toggle */}
        <VoiceRings size="lg">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-20 h-20 rounded-icon bg-cyan flex items-center justify-center"
          >
            {isPlaying
              ? <Pause size={36} className="text-bg-base" fill="currentColor" />
              : <Play  size={36} className="text-bg-base" fill="currentColor" />
            }
          </button>
        </VoiceRings>

        {/* Progress bar */}
        <div className="w-full h-2 bg-white/20 rounded-pill overflow-hidden">
          <div
            className="h-full bg-cyan rounded-pill transition-all duration-100"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Playback progress"
          />
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-8">
          <button onClick={handleSkipBack}    aria-label="Skip back">    <SkipBack    size={50} className="text-white" /></button>
          <button onClick={handleReplay}      aria-label="Replay">       <RefreshCw   size={50} className="text-white" /></button>
          <button onClick={handleSkipForward} aria-label="Skip forward"> <SkipForward size={50} className="text-white" /></button>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="btn-outline"
          aria-label="Go back"
        >
          Back
        </button>
      </main>
    </div>
  )
}
