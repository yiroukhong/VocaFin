import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import LogExpensePage from '@/pages/LogExpensePage'
import ConfirmPage from '@/pages/ConfirmPage'
import BudgetPage from '@/pages/BudgetPage'
import HistoryPage from '@/pages/HistoryPage'
import SummaryPage from '@/pages/SummaryPage'
import NotFoundPage from '@/pages/NotFoundPage'

const router = createBrowserRouter([
  { path: '/',        element: <HomePage /> },
  { path: '/log',     element: <LogExpensePage /> },
  { path: '/confirm', element: <ConfirmPage /> },
  { path: '/budget',  element: <BudgetPage /> },
  { path: '/history', element: <HistoryPage /> },
  { path: '/summary', element: <SummaryPage /> },
  { path: '*',        element: <NotFoundPage /> },
])

export default router
