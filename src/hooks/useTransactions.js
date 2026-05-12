// useTransactions — reads and writes the global transaction list.
// When implemented:
//   - Selects `transactions` from transactionStore
//   - Exposes addTransaction(tx) which generates a uuid and dispatches to the store
//   - Exposes clearTransactions() for resetting all data during development
//   - Data is persisted automatically by the store's localStorage middleware
import { useTransactionStore } from '@/store/transactionStore'

export function useTransactions() {
  const transactions = useTransactionStore((s) => s.transactions)
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const clearTransactions = useTransactionStore((s) => s.clearAll)

  return { transactions, addTransaction, clearTransactions }
}
