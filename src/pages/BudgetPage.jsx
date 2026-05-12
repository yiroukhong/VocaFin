import Navbar from '@/components/Navbar'

// TODO: Budget overview — show BudgetBar for each category, remaining vs spent,
// and an option to edit the monthly limit per category.
export default function BudgetPage() {
  return (
    <>
      <Navbar />
      <main aria-label="Budget overview" className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-4">Budget</h1>
        <p className="text-surface">Category budgets will appear here.</p>
      </main>
    </>
  )
}
