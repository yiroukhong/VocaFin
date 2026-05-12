import { useNavigate } from 'react-router-dom'
import TopBar from '@/components/TopBar'
import Navbar from '@/components/Navbar'
import TransactionCard from '@/components/TransactionCard'
import AudioButton from '@/components/AudioButton'
import { MOCK_TRANSACTIONS } from '@/data/mockTransactions'

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
}

function groupByDate(txs) {
  return txs.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = []
    acc[tx.date].push(tx)
    return acc
  }, {})
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const grouped = groupByDate(MOCK_TRANSACTIONS)
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="screen-container pb-16">
      <TopBar label="History" />

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

      <h2 className="text-h2 font-bold px-screen pt-4 pb-2">May</h2>

      {/* Transaction list */}
      <div className="flex-1 overflow-y-auto px-screen">
        {sortedDates.map((date) => (
          <div key={date}>
            <p className="text-caption text-text-muted py-2">{formatDateLabel(date)}</p>
            {grouped[date].map((tx) => (
              <TransactionCard key={tx.id} {...tx} />
            ))}
          </div>
        ))}
      </div>

      {/* Audio buttons */}
      <div className="px-screen flex flex-col gap-3 py-4">
        <AudioButton label="Weekly Expenses" onPress={() => navigate('/summary/weekly')}  />
        <AudioButton label="May Expenses"    onPress={() => navigate('/summary/monthly')} />
      </div>

      <Navbar activePage="history" />
    </div>
  )
}
