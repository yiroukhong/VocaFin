import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_MONTHLY_LIMIT, DEFAULT_CATEGORY_LIMITS } from '@/data/budgetDefaults'

export const useBudgetStore = create(
  persist(
    (set) => ({
      monthlyLimit: DEFAULT_MONTHLY_LIMIT || 500,
      categoryLimits: DEFAULT_CATEGORY_LIMITS || {},

      setMonthlyLimit: (n) => set({ monthlyLimit: n }),

      setCategoryLimit: (category, n) =>
        set((state) => ({
          categoryLimits: { ...state.categoryLimits, [category]: n },
        })),
    }),
    { name: 'vocafin-budget' },
  ),
)