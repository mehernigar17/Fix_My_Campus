// Router: Centralized route definitions for the application
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../views/pages/LoginPage';
import RegisterPage from '../views/pages/RegisterPage';
import StudentHomePage from '../views/student/StudentHomePage';
import AdminHomePage from '../views/admin/AdminHomePage';
import {
  NotFoundPage,
} from '../views/pages/PlaceholderPages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', color: '#1a4a3a' }}>Forgot Password — coming soon</div>,
  },
  {
    path: '/student/dashboard',
    element: <StudentHomePage />,
  },
  {
    path: '/student/explore',
    element: <StudentHomePage />,
  },
  {
    path: '/student/my-reports',
    element: <StudentHomePage />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminHomePage />,
  },
  {
    path: '/admin',
    element: <AdminHomePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
