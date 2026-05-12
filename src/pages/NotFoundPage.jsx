import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main aria-label="Page not found" className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">404 — Page Not Found</h1>
      <p className="text-surface mb-6">The page you are looking for does not exist.</p>
      <Link to="/" className="text-accent underline">Return to Home</Link>
    </main>
  )
}
