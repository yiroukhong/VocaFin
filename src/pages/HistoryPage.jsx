import Navbar from '@/components/Navbar'

// TODO: Scrollable list of TransactionCards grouped by date, newest first.
// Pull transactions from useTransactions hook.
export default function HistoryPage() {
  return (
    <>
      <Navbar />
      <main aria-label="Transaction history" className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-4">History</h1>
        <p className="text-surface">Your past transactions will appear here.</p>
      </main>
    </>
  )
}
