// View Component: Admin Issue Management Table with Live Status Controls & Delete Actions
export default function AdminIssuesTable({
  issues,
  searchQuery,
  onSearchChange,
  onStatusChange,
  onDeleteClick,
}) {
  const getCategoryClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'electrical':
        return 'admin-cat-electrical';
      case 'water':
        return 'admin-cat-water';
      case 'internet':
        return 'admin-cat-internet';
      case 'cleanliness':
        return 'admin-cat-cleanliness';
      case 'furniture':
        return 'admin-cat-furniture';
      default:
        return 'admin-cat-other';
    }
  };

  const getStatusPillClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'status-pill-resolved';
      case 'in progress':
        return 'status-pill-progress';
      case 'open':
        return 'status-pill-open';
      default:
        return 'status-pill-open';
    }
  };

  return (
    <div className="admin-table-card">
      {/* Header Row */}
      <div className="admin-table-header-row">
        <div>
          <h2 className="admin-table-title">Issue management</h2>
          <p className="admin-table-subtitle">
            Update status or remove inappropriate reports.
          </p>
        </div>

        {/* Search Input */}
        <div className="admin-table-search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
      </div>

      {/* Issues Table */}
      <div className="admin-table-responsive-wrap">
        <table className="admin-issues-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>ISSUE</th>
              <th style={{ width: '18%' }}>CATEGORY</th>
              <th style={{ width: '15%' }}>SUPPORT</th>
              <th style={{ width: '18%' }}>STATUS</th>
              <th style={{ width: '9%', textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {issues.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="admin-empty-table-state">
                    <h4>No reports found</h4>
                    <p>Try searching for a different keyword or check filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              issues.map((issue) => (
                <tr key={issue.id}>
                  {/* Issue Title & Location */}
                  <td>
                    <div className="td-issue-title-group">
                      <span className="td-issue-title">{issue.title}</span>
                      <span className="td-issue-location">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="td-loc-pin">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {issue.location}
                      </span>
                    </div>
                  </td>

                  {/* Category Pill */}
                  <td>
                    <span className={`admin-cat-pill ${getCategoryClass(issue.category)}`}>
                      {issue.category}
                    </span>
                  </td>

                  {/* Support Upvotes */}
                  <td>
                    <span className="td-support-count">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="td-support-arrow">
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                      </svg>
                      {issue.upvotes}
                    </span>
                  </td>

                  {/* Interactive Status Selector */}
                  <td>
                    <div className="status-select-pill-wrapper">
                      <select
                        value={issue.status}
                        onChange={(e) => onStatusChange(issue.id, e.target.value)}
                        className={`status-select-pill ${getStatusPillClass(issue.status)}`}
                        aria-label={`Update status for ${issue.title}`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="status-pill-chevron">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </td>

                  {/* Action (Delete / Trash) */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn-trash-action"
                      onClick={() => onDeleteClick(issue)}
                      title="Remove report"
                      aria-label="Remove report"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="trash-icon">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
