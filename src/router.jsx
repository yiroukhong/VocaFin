import { createBrowserRouter } from 'react-router-dom'
import HomePage        from '@/pages/HomePage'
import LogExpensePage  from '@/pages/LogExpensePage'
import ConfirmPage     from '@/pages/ConfirmPage'
import SavingPage      from '@/pages/SavingPage'
import SavedPage       from '@/pages/SavedPage'
import ErrorPage       from '@/pages/ErrorPage'
import HistoryPage     from '@/pages/HistoryPage'
import PlaySummaryPage from '@/pages/PlaySummaryPage'
import NotFoundPage    from '@/pages/NotFoundPage'

const router = createBrowserRouter([
  { path: '/',              element: <HomePage />        },
  { path: '/log',           element: <LogExpensePage />  },
  { path: '/confirm',       element: <ConfirmPage />     },
  { path: '/saving',        element: <SavingPage />      },
  { path: '/saved',         element: <SavedPage />       },
  { path: '/error',         element: <ErrorPage />       },
  { path: '/history',       element: <HistoryPage />     },
  { path: '/summary/:type', element: <PlaySummaryPage /> },
  { path: '*',              element: <NotFoundPage />    },
])

export default router
