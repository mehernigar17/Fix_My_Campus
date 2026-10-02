// Router: Centralized route definitions for the application
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../views/pages/LoginPage';
import RegisterPage from '../views/pages/RegisterPage';
import StudentHomePage from '../views/student/StudentHomePage';
import AdminHomePage from '../views/admin/AdminHomePage';
import {
  NotFoundPage,
} from '../views/pages/PlaceholderPages';
import { RequireAuth, RedirectIfAuthenticated } from './guards';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <RedirectIfAuthenticated>
        <LoginPage />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: '/register',
    element: (
      <RedirectIfAuthenticated>
        <RegisterPage />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: '/forgot-password',
    element: <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', color: '#1a4a3a' }}>Forgot Password — coming soon</div>,
  },
  // Each student route gets its own key so switching between the campus board
  // and "My Reports" resets the page's filters, modals and results.
  {
    path: '/student/dashboard',
    element: (
      <RequireAuth key="student-dashboard" role="student">
        <StudentHomePage />
      </RequireAuth>
    ),
  },
  {
    path: '/student/explore',
    element: (
      <RequireAuth key="student-explore" role="student">
        <StudentHomePage />
      </RequireAuth>
    ),
  },
  {
    path: '/student/my-reports',
    element: (
      <RequireAuth key="student-my-reports" role="student">
        <StudentHomePage />
      </RequireAuth>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <RequireAuth role="admin">
        <AdminDashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;