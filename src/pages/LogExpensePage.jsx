import Navbar from '@/components/Navbar'

// TODO: Active listening state — show pulsing microphone icon, transcript text
// as the user speaks, and a cancel button that returns to `/`.
export default function LogExpensePage() {
  return (
    <>
      <Navbar />
      <main aria-label="Log expense — listening" className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-4">Log Expense</h1>
        <p className="text-surface">Listening for your expense...</p>
      </main>
    </>
  )
}
