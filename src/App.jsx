import { RouterProvider } from 'react-router-dom'
import router from '@/router.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-bg-base">
      <RouterProvider router={router} />
    </div>
  )
}
