import { useTransactions } from '@/hooks/useTransactions'
import { ArrowDown, ArrowUp, Car, Check, File, FolderPlus, RefreshCcw, ShoppingBag, Utensils, Wallet } from 'lucide-react'
import { useCallback, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const readFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => {
    resolve({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      type: file.type || 'Unknown type',
      content: reader.result,
    })
  }
  reader.onerror = () => reject(reader.error)
  reader.readAsDataURL(file)
})

const buildExtractedData = (fileRecords) => fileRecords.flatMap((file, index) => {
  const fallbackName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
  
  // Assign dummy categories and amounts to match your Figma exactly
  if (index === 0) return [{ id: `${file.id}-1`, merchant: 'Nasi Lemak', category: 'Food & Dining', amount: 12.50, time: '8:30 AM' }]
  if (index === 1) return [{ id: `${file.id}-2`, merchant: 'Grab to KL Sentral', category: 'Transport', amount: 24.00, time: '5:15 PM' }]
  return [{ id: `${file.id}-3`, merchant: fallbackName || 'Guardian Pharmacy', category: 'Health', amount: 45.20, time: '1:00 PM' }]
})

// Helper to pick the right icon based on category
const CategoryIcon = ({ category }) => {
  if (category === 'Food & Dining') return <Utensils className="text-black h-6 w-6" />
  if (category === 'Transport') return <Car className="text-white h-6 w-6" />
  return <ShoppingBag className="text-black h-6 w-6" />
}

export default function ExtractPage() {
  const [step, setStep] = useState('idle') // 'idle' | 'uploaded' | 'extracted' | 'saving' | 'saved'
  const [files, setFiles] = useState([])
  const [extractedData, setExtractedData] = useState([])
  const { addTransaction } = useTransactions()
  const navigate = useNavigate()

  const handleFileUpload = useCallback(async (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (!selectedFiles.length) return
    try {
      const fileRecords = await Promise.all(selectedFiles.map(readFile))
      setFiles((prev) => [...prev, ...fileRecords])
      setStep('uploaded')
    } catch (error) {
      console.error(error)
    } finally {
      event.target.value = ''
    }
  }, [])

  const handleRemoveFile = useCallback((fileId) => {
    setFiles((currentFiles) => {
      const nextFiles = currentFiles.filter((file) => file.id !== fileId)
      if (!nextFiles.length) setStep('idle')
      return nextFiles
    })
  }, [])

  const handleExtract = () => {
    setExtractedData(buildExtractedData(files))
    setStep('extracted')
  }

  const handleSaveAll = () => {
    setStep('saving')
    
    // Simulate the saving delay shown in your Figma
    setTimeout(() => {
      extractedData.forEach((tx) => {
        addTransaction({
          amount: tx.amount,
          category: tx.category.split(' ')[0], // Simplify category for the store
          note: tx.merchant,
          date: new Date().toISOString(),
        })
      })
      if (navigator.vibrate) navigator.vibrate([100, 50, 100])
      setStep('saved')
    }, 2000)
  }

  // Keyboard shortcut for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  // --- Long Press Logic ---
  const longPressTimer = useRef(null)

  const handlePointerDown = () => {
    // Start a timer for 800 milliseconds when the user touches/clicks
    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]) // Haptic buzz to confirm!
      navigate('/')
    }, 800)
  }

  const cancelLongPress = () => {
    // If they let go or drag their finger away before 800ms, cancel the timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white select-none">
      
      {/* Top Header matching Figma */}
      <header className="flex items-center gap-3 p-4 border-b border-gray-800 bg-[#0a0a0a]">
        <Wallet className="h-6 w-6 text-[#fca5a5]" strokeWidth={2} />
        <h1 className="text-2xl font-bold tracking-wide">Extract</h1>
      </header>

      <main className="flex-1 flex flex-col p-6 overflow-y-auto" aria-live="polite">
        
        {/* --- STATE 1: IDLE --- */}
        {step === 'idle' && (
          <div className="flex-1 flex flex-col items-center pt-8">
            <label 
              className="w-full max-w-sm border-2 border-white rounded-[2.5rem] flex flex-col items-center justify-center p-12 cursor-pointer active:bg-white/5 transition-colors"
              aria-label="Add any file"
            >
              <span className="text-3xl font-bold mb-8">Add any file</span>
              <div className="bg-white text-black p-6 rounded-3xl mb-4">
                <FolderPlus size={56} strokeWidth={2.5} />
              </div>
              <input type="file" multiple className="sr-only" onChange={handleFileUpload} />
            </label>
            <p className="text-center text-gray-400 text-lg mt-8 leading-relaxed">
              Images, PDF, docx,<br />md, csv
            </p>
          </div>
        )}

        {/* --- STATE 2: UPLOADED --- */}
        {step === 'uploaded' && (
          <div className="flex-1 flex flex-col space-y-4">
            <h2 className="text-2xl font-bold mb-2">{files.length} Uploaded</h2>
            
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="relative flex items-center border border-white rounded-xl overflow-hidden h-16 bg-[#0a0a0a]">
                  <div className="flex items-center gap-4 px-4 w-full">
                    <File className="text-white h-6 w-6 shrink-0" strokeWidth={1.5} />
                    <span className="font-semibold text-lg truncate">{file.name}</span>
                  </div>
                  {/* Red delete zone simulator (Click to delete) */}
                  <button 
                    onClick={() => handleRemoveFile(file.id)} 
                    className="absolute right-0 h-full w-12 bg-[#ff6b6b] flex items-center justify-center active:w-full transition-all duration-300" 
                    aria-label="Delete file"
                  >
                     <span className="text-black font-bold opacity-0 active:opacity-100 transition-opacity">← Delete</span>
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={handleExtract} 
              className="w-full bg-[#1a1a1a] rounded-3xl flex flex-col items-center justify-center py-10 mt-6 active:bg-[#222] transition-colors"
            >
              <ArrowUp size={64} className="text-[#4ade80] mb-4" strokeWidth={2.5} />
              <span className="text-3xl font-bold">Extract</span>
            </button>

            <label className="w-full border-2 border-white rounded-3xl flex flex-col items-center justify-center py-6 mt-4 cursor-pointer active:bg-white/5 transition-colors">
              <span className="text-2xl font-bold mb-3">Add more files</span>
              <div className="bg-white text-black p-3 rounded-2xl">
                <FolderPlus size={32} strokeWidth={2.5} />
              </div>
              <input type="file" multiple className="sr-only" onChange={handleFileUpload} />
            </label>
          </div>
        )}

        {/* --- STATE 3: EXTRACTED CONFIRMATION --- */}
        {step === 'extracted' && (
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-bold mb-1">Extracted:</h2>
            <p className="text-3xl mb-6">{new Date().toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })}</p>

            <div className="space-y-4 flex-1">
              {extractedData.map((tx, idx) => (
                <div key={tx.id} className={`border-2 ${idx === 0 ? 'border-cyan-400' : 'border-gray-600'} rounded-xl p-4 flex items-center gap-4 bg-[#0a0a0a]`}>
                  <div className={`p-3 rounded-full ${idx === 0 ? 'bg-[#fcd34d]' : idx === 1 ? 'bg-[#0ea5e9]' : 'bg-[#fecdd3]'}`}>
                    <CategoryIcon category={tx.category} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-lg truncate">{tx.merchant}</p>
                    <p className="text-xs text-gray-300 truncate">{tx.category} • {tx.time}</p>
                  </div>
                  <p className="font-bold text-xl whitespace-nowrap">-RM {tx.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={handleSaveAll} 
                className="bg-[#1a1a1a] rounded-3xl py-10 flex flex-col items-center active:bg-[#222]"
              >
                <ArrowUp size={64} className="text-[#4ade80] mb-4" strokeWidth={2.5} />
                <span className="text-3xl font-bold">Save</span>
              </button>
              <button 
                onClick={() => { setStep('idle'); setFiles([]); }} 
                className="bg-[#1a1a1a] rounded-3xl py-10 flex flex-col items-center active:bg-[#222]"
              >
                <ArrowDown size={64} className="text-[#ff6b6b] mb-4" strokeWidth={2.5} />
                <span className="text-3xl font-bold">Cancel</span>
              </button>
            </div>
          </div>
        )}

        {/* --- STATE 4: SAVING SPINNER --- */}
        {step === 'saving' && (
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 opacity-10 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-6xl font-bold mb-4">Lunch</p>
              <p className="text-5xl text-gray-400 mb-8">RM 10.00</p>
              <Utensils size={100} />
            </div>
            <div className="z-10 flex flex-col items-center">
              <h2 className="text-5xl font-bold mb-12 tracking-wide">Saving..</h2>
              <RefreshCcw size={100} className="animate-spin text-white" strokeWidth={1} />
            </div>
          </div>
        )}

        {/* --- STATE 5: SAVED SUCCESS --- */}
        {step === 'saved' && (
          <div className="flex-1 flex flex-col items-center justify-center pt-10">
            <h2 className="text-6xl font-bold mb-12">Saved!</h2>
            <div className="bg-white rounded-full p-8 mb-16">
              <Check size={100} className="text-black" strokeWidth={3.5} />
            </div>
            <button 
              onClick={() => { setStep('idle'); setFiles([]); }} 
              className="w-full max-w-sm bg-[#1a1a1a] rounded-3xl py-8 flex flex-col items-center active:bg-[#222] transition-colors"
            >
              <ArrowUp size={48} className="text-[#4ade80] mb-3" strokeWidth={3} />
              <span className="text-2xl font-bold">Export more</span>
            </button>
          </div>
        )}
      </main>

      {/* Persistent Bottom 'Long press to Home' Button */}
      <div className="p-6 pt-2 pb-8">
        <button
          onPointerDown={handlePointerDown}
          onPointerUp={cancelLongPress}
          onPointerLeave={cancelLongPress}
          onContextMenu={(e) => e.preventDefault()} // Prevents the right-click menu popping up on mobile
          className="w-full py-4 border border-gray-600 rounded-lg text-gray-300 font-semibold text-lg active:bg-white/10 active:scale-[0.98] transition-all"
          aria-label="Long press for 1 second to return to Home Dashboard"
        >
          Long press to Home
        </button>
      </div>

    </div>
  )
}