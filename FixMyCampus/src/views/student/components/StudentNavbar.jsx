// View Component: Student Top Navigation Bar
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../services/authService';

export default function StudentNavbar({ currentUser, onOpenReportModal }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isExplore = location.pathname === '/student/explore' || location.pathname === '/student/dashboard' || location.pathname === '/';
  const isMyReports = location.pathname === '/student/my-reports';

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="fmc-navbar">
      <div className="fmc-navbar-container">
        {/* Left: Brand & Navigation */}
        <div className="navbar-left">
          <Link to="/student/explore" className="navbar-brand">
            <div className="navbar-logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="10" width="4" height="11" rx="2" />
                <rect x="10" y="4" width="4" height="17" rx="2" />
                <rect x="17" y="8" width="4" height="13" rx="2" />
              </svg>
            </div>
            <span className="navbar-brand-name">FixMyCampus</span>
          </Link>

          <nav className="navbar-nav">
            <Link
              to="/student/explore"
              className={`nav-tab ${isExplore ? 'active' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Explore</span>
            </Link>

            <Link
              to="/student/my-reports"
              className={`nav-tab ${isMyReports ? 'active' : ''}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>My Reports</span>
            </Link>
          </nav>
        </div>

        {/* Right: Actions & User Pill */}
        <div className="navbar-right">
          <button
            type="button"
            className="btn-report-issue"
            onClick={onOpenReportModal}
          >
            <span className="plus-icon">+</span>
            <span>Report an issue</span>
          </button>

          <button
            type="button"
            className="btn-icon-square"
            aria-label="Notifications"
            title="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notification-dot" />
          </button>

          <div className="user-profile-pill">
            <div className="user-avatar-circle">
              {currentUser?.avatar || 'MS'}
            </div>
            <div className="user-info-text">
              <span className="user-name">{currentUser?.name || 'Maya Sharma'}</span>
              <span className="user-role">{currentUser?.role || 'Student'}</span>
            </div>
            <svg className="chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <button
            type="button"
            className="btn-icon-square"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
