import Navbar from '@/components/Navbar'

// TODO: Confirmation state — show parsed transaction details (amount, category,
// date). Confirm (swipe up / button) saves to store and navigates to `/`.
// Cancel returns to `/`.
export default function ConfirmPage() {
  return (
    <>
      <Navbar />
      <main aria-label="Confirm transaction" className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-4">Confirm</h1>
        <p className="text-surface">Review your transaction before saving.</p>
      </main>
    </>
  )
}
