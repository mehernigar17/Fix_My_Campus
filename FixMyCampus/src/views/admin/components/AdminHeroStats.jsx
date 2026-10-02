// View Component: Admin Operations Overview & 4 Stat Cards
export default function AdminHeroStats({ stats, adminName }) {
  const firstName = adminName ? adminName.split(' ')[0] : 'Arjun';

  return (
    <section className="admin-overview-section">
      {/* Overview Header */}
      <div className="admin-overview-header">
        <div>
          <p className="admin-eyebrow">OPERATIONS OVERVIEW</p>
          <h1 className="admin-main-title">Good morning, {firstName}</h1>
          <p className="admin-subtitle">
            Review priorities, update work, and keep students informed.
          </p>
        </div>

        <div className="live-data-pill">
          <span className="live-green-dot" />
          <span>Live campus data</span>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="admin-stats-grid">
        {/* Card 1: Reports waiting for a review decision */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper violet-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="admin-stat-text-group">
            <span className="admin-stat-top-label">AWAITING REVIEW</span>
            <span className="admin-stat-number">{stats?.pendingCount ?? 0}</span>
            <span className="admin-stat-bottom-sub">Not on the board yet</span>
          </div>
        </div>

        {/* Card 2: Open Issues */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper rose-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="12" y1="9" x2="12.01" y2="9" />
            </svg>
          </div>
          <div className="admin-stat-text-group">
            <span className="admin-stat-top-label">OPEN ISSUES</span>
            <span className="admin-stat-number">{stats?.openCount ?? 0}</span>
            <span className="admin-stat-bottom-sub">Needs review</span>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper amber-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="admin-stat-text-group">
            <span className="admin-stat-top-label">IN PROGRESS</span>
            <span className="admin-stat-number">{stats?.inProgressCount ?? 0}</span>
            <span className="admin-stat-bottom-sub">Being handled</span>
          </div>
        </div>

        {/* Card 4: Resolved */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper mint-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="admin-stat-text-group">
            <span className="admin-stat-top-label">RESOLVED</span>
            <span className="admin-stat-number">{stats?.resolvedCount ?? 0}</span>
            <span className="admin-stat-bottom-sub">This period</span>
          </div>
        </div>

        {/* Card 5: Total Upvotes */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon-wrapper blue-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </div>
          <div className="admin-stat-text-group">
            <span className="admin-stat-top-label">TOTAL UPVOTES</span>
            <span className="admin-stat-number">{stats?.totalUpvotes ?? 0}</span>
            <span className="admin-stat-bottom-sub">Community signals</span>
          </div>
        </div>
      </div>
    </section>
  );
}
