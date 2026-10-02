// Router Guards: authentication gates for protected routes
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../services/authService';

const homeFor = (user) =>
  user?.role === 'admin' ? '/admin/dashboard' : '/student/explore';

/** Gate for protected routes — bounces to /login without a stored JWT. */
export function RequireAuth({ children, role }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const user = getCurrentUser();
  if (role && user?.role !== role) {
    return <Navigate to={homeFor(user)} replace />;
  }

  return children;
}

/** Keeps signed-in users away from the login / register screens. */
export function RedirectIfAuthenticated({ children }) {
  if (!isAuthenticated()) return children;

  return <Navigate to={homeFor(getCurrentUser())} replace />;
}