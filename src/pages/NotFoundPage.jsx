import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="screen-container bg-bg-base">
      <main
        aria-label="Page not found"
        className="flex-1 flex flex-col items-center justify-center px-screen gap-6"
      >
        <h1 className="text-display font-extrabold text-center">404</h1>
        <p className="text-body text-text-secondary text-center">Page not found.</p>
        <button
          onClick={() => navigate('/')}
          className="btn-outline"
        >
          Return to Home
        </button>
      </main>
    </div>
  )
}
