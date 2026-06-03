import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main aria-label="Page not found" className="flex flex-col items-center justify-center min-h-screen p-6 bg-black text-white text-center">
      <h1 className="text-5xl font-bold mb-4 text-teal-400">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-gray-400 mb-8 text-lg">The page you are looking for does not exist or has been moved.</p>
      <Link 
        to="/" 
        className="px-8 py-4 bg-gray-800 text-white rounded-full text-xl font-bold active:bg-gray-700 transition-colors"
      >
        Return to Home
      </Link>
    </main>
  )
}