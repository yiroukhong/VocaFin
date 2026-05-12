import Navbar from '@/components/Navbar'

// TODO: Idle state — large double-tap / click area that triggers voice input.
// Display current remaining budget. Navigates to `/log` on activation.
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main aria-label="Home — voice expense logger" className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-4">VocaFin</h1>
        <p className="text-surface">Tap to log an expense</p>
      </main>
    </>
  )
}
