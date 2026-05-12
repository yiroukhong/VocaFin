import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// pendingTransaction shape: { id, amount, category, date, note } | null
export const useUiStore = create(
  persist(
    (set) => ({
      isListening: false,
      pendingTransaction: null,

      setListening: (bool) => set({ isListening: bool }),

      setPendingTransaction: (tx) => set({ pendingTransaction: tx }),

      clearPending: () => set({ pendingTransaction: null }),
    }),
    { name: 'vocafin-ui' },
  ),
)
