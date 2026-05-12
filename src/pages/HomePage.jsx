import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import TopBar from '@/components/TopBar'
import AudioButton from '@/components/AudioButton'

const TOP_CATEGORIES = [
  { label: 'Food',      amount: 95.00 },
  { label: 'Transport', amount: 45.00 },
  { label: 'Coffee',    amount: 40.00 },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="screen-container pb-16">
      <TopBar label="Home" />

      {/* VocaFin header */}
      <div className="px-screen pt-2 pb-4 flex items-center gap-3">
        <span
          className="w-9 h-9 rounded-btn flex items-center justify-center text-bg-base font-black text-lg"
          style={{ background: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)' }}
          aria-hidden="true"
        >
          V
        </span>
        <span className="text-h1 font-bold">VocaFin</span>
      </div>

      {/* Weekly Summary card */}
      <div className="card mx-4 mb-3">
        <p className="text-h2 font-bold mb-1">Weekly Summary</p>
        <p className="text-caption text-text-muted mb-3">Resets in 3 days</p>

        {/* Spent block */}
        <div className="bg-bg-card rounded-card p-3 mb-2">
          <p className="text-caption text-text-muted">Spent</p>
          <p className="text-body text-text-primary">RM</p>
          <p className="text-amount font-black text-text-primary leading-none">180.00</p>
        </div>

        {/* Remaining block */}
        <div className="bg-bg-card border-2 border-cyan rounded-card p-3">
          <p className="text-caption text-cyan">Remaining</p>
          <p className="text-body text-cyan">RM</p>
          <p className="text-amount font-black text-cyan leading-none">220.00</p>
        </div>
      </div>

      {/* Top Categories */}
      <div className="px-screen mb-4">
        <p className="text-h2 font-bold mb-2">Top Categories</p>
        {TOP_CATEGORIES.map(({ label, amount }, i) => (
          <div
            key={label}
            className={`flex justify-between items-center py-3
              ${i < TOP_CATEGORIES.length - 1 ? 'border-b border-white/5' : ''}`}
          >
            <span className="text-body">{label}</span>
            <span className="text-amount-sm font-bold">RM {amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Audio buttons */}
      <div className="px-screen flex flex-col gap-3 mb-4">
        <AudioButton label="Weekly Summary"  onPress={() => navigate('/summary/weekly')}  />
        <AudioButton label="Monthly Summary" onPress={() => navigate('/summary/monthly')} />
      </div>

      <Navbar activePage="hub" />
    </div>
  )
}
