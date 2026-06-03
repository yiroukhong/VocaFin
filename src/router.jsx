import { createBrowserRouter, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LogExpensePage from './pages/LogExpensePage';
import ConfirmPage from './pages/ConfirmPage';
import HistoryPage from './pages/HistoryPage';
import SummaryPage from './pages/SummaryPage';
import BudgetPage from './pages/BudgetPage';
import NotFoundPage from './pages/NotFoundPage';
import ExtractPage from './pages/ExtractPage';
import LoginPage from './pages/LoginPage'; // 1. Import Login Page

export const router = createBrowserRouter([
  {
    path: '/login', // 2. Add login route OUTSIDE the main layout so it doesn't show the navbar
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Outlet />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'log', element: <LogExpensePage /> },
      { path: 'confirm', element: <ConfirmPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'summary', element: <SummaryPage /> },
      { path: 'budget', element: <BudgetPage /> },
      { path: 'extract', element: <ExtractPage /> },
    ],
  },
]);