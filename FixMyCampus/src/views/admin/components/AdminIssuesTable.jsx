// View Component: Admin Issue Management Table with Live Status Controls & Delete Actions
export default function AdminIssuesTable({
  issues,
  totalCount,
  searchQuery,
  statusFilter,
  categoryFilter,
  moderationFilter,
  categories,
  statuses,
  moderationFilters,
  isLoading,
  loadError,
  savingIssueId,
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  onModerationFilterChange,
  onClearFilters,
  onStatusChange,
  onReviewClick,
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

  const getModerationPillClass = (state) => {
    switch (state) {
      case 'approved':
        return 'moderation-pill-approved';
      case 'rejected':
        return 'moderation-pill-rejected';
      case 'pending':
      default:
        return 'moderation-pill-pending';
    }
  };

  const hasFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'All' ||
    categoryFilter !== 'All' ||
    moderationFilter !== 'All';

  // How many reports are still waiting for a decision, shown next to the queue
  // filter so the review backlog is visible without opening the filter.
  const pendingCount = issues.filter((i) => i.moderation?.state === 'pending').length;

  return (
    <div className="admin-table-card">
      {/* Header Row */}
      <div className="admin-table-header-row">
        <div>
          <h2 className="admin-table-title">Issue management</h2>
          <p className="admin-table-subtitle">
            Approve reports before they reach the campus board, then track the work.
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

      {/* Filter Row — review queue + status pills + category, all applied by the API */}
      <div className="admin-table-toolbar">
        <div className="admin-filter-pills" role="group" aria-label="Filter by review state">
          {moderationFilters.map((state) => (
            <button
              key={state}
              type="button"
              className={`admin-filter-pill moderation-filter-pill ${moderationFilter === state ? 'active' : ''} moderation-filter-${state.toLowerCase()}`}
              aria-pressed={moderationFilter === state}
              onClick={() => onModerationFilterChange(state)}
            >
              {state}
              {state === 'Pending' && pendingCount > 0 && (
                <span className="moderation-filter-count">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="admin-toolbar-right">
          <select
            className="admin-category-select"
            value={categoryFilter}
            onChange={onCategoryFilterChange}
            aria-label="Filter by category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'All' ? 'All categories' : category}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button type="button" className="admin-clear-filters-btn" onClick={onClearFilters}>
              Clear filters
            </button>
          )}

          <span className="admin-table-count">
            {isLoading ? 'Loading…' : `Showing ${issues.length} of ${totalCount}`}
          </span>
        </div>
      </div>

      {/* Second row — the work status of the report itself */}
      <div className="admin-table-toolbar admin-table-toolbar-secondary">
        <div className="admin-filter-pills" role="group" aria-label="Filter by status">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              className={`admin-filter-pill ${statusFilter === status ? 'active' : ''}`}
              aria-pressed={statusFilter === status}
              onClick={() => onStatusFilterChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Issues Table */}
      <div className="admin-table-responsive-wrap">
        <table className="admin-issues-table">
          <thead>
            <tr>
              <th style={{ width: '34%' }}>ISSUE</th>
              <th style={{ width: '15%' }}>REVIEW</th>
              <th style={{ width: '15%' }}>CATEGORY</th>
              <th style={{ width: '11%' }}>SUPPORT</th>
              <th style={{ width: '16%' }}>STATUS</th>
              <th style={{ width: '9%', textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loadError ? (
              <tr>
                <td colSpan={6}>
                  <div className="admin-empty-table-state admin-error-state">
                    <h4>We couldn&apos;t load the reports</h4>
                    <p>{loadError}</p>
                  </div>
                </td>
              </tr>
            ) : isLoading && issues.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="admin-empty-table-state">
                    <p>Loading campus reports…</p>
                  </div>
                </td>
              </tr>
            ) : issues.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="admin-empty-table-state">
                    <h4>No reports found</h4>
                    <p>
                      {hasFilters
                        ? 'Try a different keyword, status, category or review state.'
                        : 'Students have not reported anything yet.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              issues.map((issue) => {
                const moderation = issue.moderation || { state: 'approved', label: 'Approved' };
                const isSaving = savingIssueId === issue.id;

                return (
                  <tr key={issue.id} className={moderation.state === 'approved' ? '' : 'admin-row-pending'}>
                  {/* Issue Title, Location & Reporter */}
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
                      <span className="td-issue-reporter">
                        Reported by {issue.createdBy?.name || 'Campus member'} · {issue.createdAt}
                      </span>
                      {issue.resolutionNote && (
                        <span className="td-issue-note" title={issue.resolutionNote}>
                          Note: {issue.resolutionNote}
                        </span>
                      )}
                      {moderation.note && (
                        <span className="td-issue-note" title={moderation.note}>
                          Review: {moderation.note}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Admin review: publish to the board or keep it off */}
                  <td>
                    <div className="moderation-cell">
                      <span className={`moderation-pill ${getModerationPillClass(moderation.state)}`}>
                        {moderation.label}
                      </span>
                      <div className="moderation-actions">
                        <button
                          type="button"
                          className="btn-review-approve"
                          onClick={() => onReviewClick(issue, 'approve')}
                          disabled={isSaving || moderation.state === 'approved'}
                          title={
                            moderation.state === 'approved'
                              ? 'Already on the campus board'
                              : 'Publish to the campus board'
                          }
                          aria-label={`Approve report: ${issue.title}`}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="btn-review-reject"
                          onClick={() => onReviewClick(issue, 'reject')}
                          disabled={isSaving || moderation.state === 'rejected'}
                          title={
                            moderation.state === 'rejected'
                              ? 'Already rejected'
                              : 'Keep off the campus board'
                          }
                          aria-label={`Reject report: ${issue.title}`}
                        >
                          Reject
                        </button>
                      </div>
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
                        disabled={isSaving}
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
                      aria-label={`Remove report: ${issue.title}`}
                      disabled={isSaving}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
