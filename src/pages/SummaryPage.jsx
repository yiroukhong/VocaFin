import Navbar from '@/components/Navbar'

// TODO: Monthly summary — total spent, breakdown by category using CategoryBadge,
// and a plain-text description of the spending pattern (accessible by screen reader).
export default function SummaryPage() {
  return (
    <>
      <Navbar />
      <main aria-label="Monthly spending summary" className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-4">Summary</h1>
        <p className="text-surface">Monthly spending breakdown will appear here.</p>
      </main>
    </>
  )
}
