import { useBudgetStore } from '@/store/budgetStore'
import { useTransactionStore } from '@/store/transactionStore'

export function useBudget() {
  const budget = useBudgetStore((s) => ({
    monthlyLimit: s.monthlyLimit,
    categoryLimits: s.categoryLimits,
  }))
  const updateCategoryLimit = useBudgetStore((s) => s.setCategoryLimit)
  const updateMonthlyLimit = useBudgetStore((s) => s.setMonthlyLimit)
  const transactions = useTransactionStore((s) => s.transactions)

  const updateLimit = (category, amount) => {
    if (category === null) {
      updateMonthlyLimit(amount)
    } else {
      updateCategoryLimit(category, amount)
    }
  }

  // Calculate total spent this month for the remainingBudget derivation
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const totalSpentThisMonth = transactions
    .filter(tx => {
      const txDate = new Date(tx.date)
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
    })
    .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0)

  const remainingBudget = budget.monthlyLimit - totalSpentThisMonth

  return { budget, updateLimit, remainingBudget, totalSpentThisMonth }
}