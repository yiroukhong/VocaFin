import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Transaction shape: { id, amount, category, date, note }
export const useTransactionStore = create(
  persist(
    (set) => ({
      transactions: [],

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),

      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),

      clearAll: () => set({ transactions: [] }),
    }),
    { name: 'vocafin-transactions' },
  ),
)
