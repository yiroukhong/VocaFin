import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LogExpensePage from './pages/LogExpensePage';
import ConfirmPage from './pages/ConfirmPage';
import HistoryPage from './pages/HistoryPage';
import SummaryPage from './pages/SummaryPage';
import BudgetPage from './pages/BudgetPage';
import NotFoundPage from './pages/NotFoundPage';
import ExtractPage from './pages/ExtractPage';
import LoginPage from './pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <Outlet />,
    errorElement: <NotFoundPage />,
    children: [
      // If someone hits '/', redirect them to '/login'
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'home', element: <HomePage /> }, // Moved from index to 'home'
      { path: 'log', element: <LogExpensePage /> },
      { path: 'confirm', element: <ConfirmPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'summary', element: <SummaryPage /> },
      { path: 'budget', element: <BudgetPage /> },
      { path: 'extract', element: <ExtractPage /> },
    ],
  },
]);