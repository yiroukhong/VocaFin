import Navbar from '@/components/Navbar'
import { useBudget } from '@/hooks/useBudget'
import { useTransactions } from '@/hooks/useTransactions'
import { getCategoryTotals, getTopCategory, getPeriodSpent, speakText } from '@/utils/financeAccessibility'
import { Volume2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function BudgetPage() {
  const { budget, updateLimit, remainingBudget, totalSpentThisMonth } = useBudget()
  const { transactions } = useTransactions()
  const [monthlyLimitInput, setMonthlyLimitInput] = useState(String(budget.monthlyLimit))
  const [announcement, setAnnouncement] = useState('Budget overview ready.')

  const categoryTotals = useMemo(() => getCategoryTotals(transactions), [transactions])
  const weeklySpent = getPeriodSpent(transactions, 7)
  const [topCategory, topAmount] = getTopCategory(transactions)
  const percentUsed = budget.monthlyLimit > 0 ? Math.min((totalSpentThisMonth / budget.monthlyLimit) * 100, 100) : 0
  const budgetSummary = remainingBudget < 0
    ? `You spent RM ${totalSpentThisMonth.toFixed(2)} this month and are over budget by RM ${Math.abs(remainingBudget).toFixed(2)}. Your top category is ${topCategory} at RM ${topAmount.toFixed(2)}.`
    : `You spent RM ${totalSpentThisMonth.toFixed(2)} this month. Remaining budget is RM ${remainingBudget.toFixed(2)}. This week's spending is RM ${weeklySpent.toFixed(2)}. Your top category is ${topCategory} at RM ${topAmount.toFixed(2)}.`

  const saveMonthlyLimit = (event) => {
    event.preventDefault()
    const nextLimit = Number.parseFloat(monthlyLimitInput)
    if (!Number.isFinite(nextLimit) || nextLimit <= 0) {
      setAnnouncement('Enter a valid monthly budget greater than zero.')
      return
    }

    updateLimit(null, nextLimit)
    setAnnouncement(`Monthly budget updated to RM ${nextLimit.toFixed(2)}.`)
  }

  const readBudgetSummary = useCallback(() => {
    setAnnouncement(budgetSummary)
    speakText(budgetSummary)
  }, [budgetSummary])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey && event.key.toLowerCase() === 'b') readBudgetSummary()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [readBudgetSummary])

  return (
    <>
      <Navbar />
      <main aria-label="Budget overview" className="flex flex-col min-h-screen p-6 pb-32 bg-black text-white">
        <div aria-live="assertive" role="status" className="sr-only">
          {announcement}
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center text-teal-400">Budget</h1>

        <div className="w-full max-w-lg mx-auto space-y-6">
          <section className="bg-gray-900 p-6 rounded-2xl border border-gray-800" aria-labelledby="monthly-budget-title">
            <h2 id="monthly-budget-title" className="text-2xl font-bold mb-4">Monthly Budget</h2>
            <form onSubmit={saveMonthlyLimit} className="flex gap-3 mb-5">
              <label className="sr-only" htmlFor="monthly-limit">Monthly budget limit in ringgit</label>
              <input
                id="monthly-limit"
                type="number"
                min="1"
                step="1"
                value={monthlyLimitInput}
                onChange={(event) => setMonthlyLimitInput(event.target.value)}
                className="min-w-0 flex-1 p-4 bg-black border border-gray-700 rounded-xl text-xl focus:outline-none focus:ring-4 focus:ring-teal-300"
              />
              <button className="px-5 py-4 bg-teal-600 rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-teal-300" aria-label="Save monthly budget">
                Save
              </button>
            </form>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <p className="text-gray-400">Spent</p>
                <p className="text-3xl font-bold">RM {totalSpentThisMonth.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-400">{remainingBudget < 0 ? 'Over Budget' : 'Remaining'}</p>
                <p className={`text-3xl font-bold ${remainingBudget < 0 ? 'text-red-400' : 'text-teal-300'}`}>RM {Math.abs(remainingBudget).toFixed(2)}</p>
              </div>
            </div>

            <div
              role="progressbar"
              aria-label={`Monthly budget used ${percentUsed.toFixed(0)} percent`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Number(percentUsed.toFixed(0))}
              className="w-full bg-gray-700 rounded-full h-5 overflow-hidden"
            >
              <div className={`h-full ${remainingBudget < 0 ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: `${percentUsed}%` }} />
            </div>
          </section>

          <button onClick={readBudgetSummary} className="w-full py-5 bg-gray-800 rounded-full text-xl font-bold flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-teal-300" aria-label="Read budget summary aloud">
            <Volume2 className="h-6 w-6" aria-hidden="true" />
            Read Budget Summary
          </button>

          <section className="bg-gray-900 p-6 rounded-2xl border border-gray-800" aria-labelledby="budget-summary-title">
            <h2 id="budget-summary-title" className="text-2xl font-bold mb-3">Accessible Summary</h2>
            <p className="text-lg leading-relaxed text-gray-200">{budgetSummary}</p>
          </section>

          <section aria-labelledby="category-budget-title">
            <h2 id="category-budget-title" className="text-2xl font-bold mb-4">Category Spending</h2>
            <div className="space-y-3" role="list">
              {Object.entries(categoryTotals).map(([category, spent]) => (
                <div key={category} role="listitem" tabIndex="0" className="bg-gray-900 p-4 rounded-xl border border-gray-800 focus:outline-none focus:ring-4 focus:ring-teal-300" aria-label={`${category} spending RM ${spent.toFixed(2)}`}>
                  <div className="flex justify-between gap-4">
                    <p className="text-lg font-semibold">{category}</p>
                    <p className="text-xl font-bold">RM {spent.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              {Object.keys(categoryTotals).length === 0 && <p className="text-gray-400">No category spending yet.</p>}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
