// Props:
//   children — icon rendered in the centre circle
//   size     — 'md' (logging) | 'lg' (play summary)
export default function VoiceRings({ children, size = 'md' }) {
  const dims = size === 'lg'
    ? { outer: 280, mid: 210, inner: 140 }
    : { outer: 240, mid: 180, inner: 120 }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: dims.outer, height: dims.outer }}
    >
      {/* Outermost ring */}
      <span
        className="absolute rounded-icon border-2 border-cyan animate-ring-3"
        style={{ width: dims.outer, height: dims.outer }}
      />
      {/* Middle ring */}
      <span
        className="absolute rounded-icon border-2 border-cyan animate-ring-2"
        style={{ width: dims.mid, height: dims.mid }}
      />
      {/* Inner ring */}
      <span
        className="absolute rounded-icon border-2 border-cyan animate-ring-1"
        style={{ width: dims.inner, height: dims.inner }}
      />
      {/* Centre content */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}
