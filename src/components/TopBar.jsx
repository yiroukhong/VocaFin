// Props: label (string)
export default function TopBar({ label }) {
  return (
    <div className="px-screen pt-2 pb-1">
      <span className="text-caption text-text-muted">{label}</span>
    </div>
  )
}
