import Navbar from '@/components/Navbar'
import TopBar from '@/components/TopBar'
import CategoryBadge from '@/components/CategoryBadge'
import { MOCK_TRANSACTIONS } from '@/data/mockTransactions'

export default function SummaryPage() {
  const total = MOCK_TRANSACTIONS.reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="screen-container pb-16">
      <TopBar label="Summary" />
      <main aria-label="Monthly spending summary" className="flex-1 px-screen pt-4 flex flex-col gap-4">
        <h1 className="text-h1 font-bold">Summary</h1>
        <p className="text-body text-text-secondary">Total spent this month: RM {total.toFixed(2)}</p>
        <div className="flex flex-wrap gap-2">
          {['food', 'transport', 'health', 'shopping', 'others'].map((id) => (
            <CategoryBadge key={id} category={id} />
          ))}
        </div>
      </main>
      <Navbar activePage="hub" />
    </div>
  )
}
