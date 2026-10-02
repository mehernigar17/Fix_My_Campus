// View Component: Student Hero Stats and Community Board
export default function StudentHeroStats({ stats }) {
  return (
    <section className="hero-community-section">
      <div className="hero-community-grid">
        {/* Left Column: Heading */}
        <div className="hero-text-content">
          <p className="hero-board-tag">CAMPUS COMMUNITY BOARD</p>
          <h1 className="hero-title">
            Small reports.<br />
            Better campus.
          </h1>
          <p className="hero-subtitle">
            Spot something that needs attention? Report it, rally support, and follow every fix from open to resolved.
          </p>
        </div>

        {/* Right Column: 3 Metric Cards */}
        <div className="hero-stats-panel">
          {/* Main Top Card */}
          <div className="stat-card-main">
            <div className="stat-card-main-left">
              <div className="stat-icon-spin-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-spinner-icon">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div className="stat-main-numbers">
                <span className="stat-main-val">{stats?.resolvedCount ?? 142}</span>
                <span className="stat-main-lbl">issues resolved</span>
              </div>
            </div>
            <div className="stat-main-badge">
              {stats?.resolvedThisMonth || '+18 this month'}
            </div>
          </div>

          {/* Sub Cards */}
          <div className="stat-cards-subgrid">
            {/* In Progress */}
            <div className="stat-card-sub">
              <div className="stat-sub-icon-box peach-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="stat-sub-numbers">
                <span className="stat-sub-val">{stats?.inProgressCount ?? 24}</span>
                <span className="stat-sub-lbl">in progress</span>
              </div>
            </div>

            {/* Avg Resolution */}
            <div className="stat-card-sub">
              <div className="stat-sub-icon-box mint-bg">
                <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className="stat-sub-numbers">
                <span className="stat-sub-val">{stats?.avgResolutionTime ?? '3.2 days'}</span>
                <span className="stat-sub-lbl">avg. resolution</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
