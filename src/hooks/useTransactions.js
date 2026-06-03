import { useTransactionStore } from '@/store/transactionStore'

export function useTransactions() {
  const transactions = useTransactionStore((s) => s.transactions)
  const addStoreTransaction = useTransactionStore((s) => s.addTransaction)
  const clearTransactions = useTransactionStore((s) => s.clearAll)

  const addTransaction = (tx) => {
    // Generate UUID and timestamps automatically before dispatching to the store
    const newTx = {
      ...tx,
      id: tx.id || crypto.randomUUID(),
      date: tx.date || new Date().toISOString()
    }
    addStoreTransaction(newTx)
  }

  return { transactions, addTransaction, clearTransactions }
}