// useBudget — reads and writes the budget configuration.
// When implemented:
//   - Selects `monthlyLimit` and `categoryLimits` from budgetStore
//   - Exposes updateLimit(category, amount) — pass null category for monthly limit
//   - Provides derived value `remainingBudget` = monthlyLimit - total spent this month
//   - Data is persisted automatically by the store's localStorage middleware
import { useBudgetStore } from '@/store/budgetStore'

export function useBudget() {
  const budget = useBudgetStore((s) => ({
    monthlyLimit: s.monthlyLimit,
    categoryLimits: s.categoryLimits,
  }))
  const updateLimit = useBudgetStore((s) => s.setCategoryLimit)

  return { budget, updateLimit }
}
