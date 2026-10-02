// View Component: Admin Navigation Bar
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../services/authService';

export default function AdminNavbar({ currentUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="admin-navbar">
      <div className="admin-navbar-container">
        {/* Left: Brand Logo & Admin Badge */}
        <div className="admin-navbar-left">
          <Link to="/admin/dashboard" className="admin-brand-link">
            <div className="navbar-logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="10" width="4" height="11" rx="2" />
                <rect x="10" y="4" width="4" height="17" rx="2" />
                <rect x="17" y="8" width="4" height="13" rx="2" />
              </svg>
            </div>
            <span className="navbar-brand-name">FixMyCampus</span>
          </Link>
          <span className="admin-brand-separator">|</span>
          <span className="admin-portal-badge">ADMIN</span>
        </div>

        {/* Right: User Profile & Log out Button */}
        <div className="admin-navbar-right">
          <div className="admin-user-info-pill">
            <div className="admin-avatar-circle">
              {currentUser?.avatar || 'AR'}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{currentUser?.name || 'Arjun Rao'}</span>
              <span className="admin-user-role-title">{currentUser?.roleTitle || 'Campus administrator'}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-admin-logout"
            onClick={handleLogout}
            title="Log out"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-icon">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
