import { Volume2 } from 'lucide-react'

// Props: label (string), onPress (fn)
export default function AudioButton({ label, onPress }) {
  return (
    <button
      onClick={onPress}
      className="btn-beige flex items-center gap-3 px-5"
      aria-label={`Play ${label}`}
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-icon bg-bg-base/20 shrink-0">
        <Volume2 size={18} className="text-bg-base" />
      </span>
      <span className="flex-1 text-left font-bold text-bg-base">{label}</span>
    </button>
  )
}
