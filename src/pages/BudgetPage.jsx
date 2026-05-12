import Navbar from '@/components/Navbar'
import TopBar from '@/components/TopBar'
import BudgetBar from '@/components/BudgetBar'
import { DEFAULT_CATEGORY_LIMITS } from '@/data/budgetDefaults'

const MOCK_SPENT = {
  food: 95, transport: 45, shopping: 120,
  health: 58, entertainment: 25, utilities: 60, others: 30,
}

export default function BudgetPage() {
  return (
    <div className="screen-container pb-16">
      <TopBar label="Budget" />
      <main aria-label="Budget overview" className="flex-1 px-screen pt-4 flex flex-col gap-4">
        <h1 className="text-h1 font-bold">Budget</h1>
        {Object.entries(DEFAULT_CATEGORY_LIMITS).map(([cat, limit]) => (
          <BudgetBar key={cat} category={cat} spent={MOCK_SPENT[cat] ?? 0} limit={limit} />
        ))}
      </main>
      <Navbar activePage="hub" />
    </div>
  )
}
