// View Component: Scalable & Reusable Campus Issue Card
export default function StudentIssueCard({ issue, onUpvote, onViewDetails }) {
  const getStatusDotColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return '#ef4444'; // Red dot for open
      case 'in progress':
        return '#f59e0b'; // Amber dot for in progress
      case 'resolved':
        return '#16a34a'; // Green dot for resolved
      default:
        return '#64748b';
    }
  };

  const getCategoryThemeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'water':
        return 'card-cat-water';
      case 'electrical':
        return 'card-cat-electrical';
      case 'internet':
        return 'card-cat-internet';
      case 'cleanliness':
        return 'card-cat-cleanliness';
      case 'furniture':
        return 'card-cat-furniture';
      default:
        return 'card-cat-other';
    }
  };

  return (
    <article className="campus-issue-card">
      {/* Top Image & Overlay Badges */}
      <div className="issue-card-image-wrapper">
        <img
          src={issue.photo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'}
          alt={issue.title}
          className="issue-card-image"
          loading="lazy"
        />

        {/* Category Badge (Top Left) */}
        <div className={`issue-card-cat-badge ${getCategoryThemeClass(issue.category)}`}>
          {issue.category}
        </div>

        {/* Status Badge (Top Right) */}
        <div className="issue-card-status-badge">
          <span
            className="status-indicator-dot"
            style={{ backgroundColor: getStatusDotColor(issue.status) }}
          />
          <span className="status-indicator-label">{issue.status}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="issue-card-body">
        {/* Priority & Timestamp */}
        <div className="issue-priority-row">
          <span className="priority-label-green">
            {issue.priority || 'HIGH PRIORITY'}
          </span>
          <span className="issue-time-ago">{issue.createdAt || 'Just now'}</span>
        </div>

        {/* Title */}
        <h3 className="issue-card-title">{issue.title}</h3>

        {/* Description */}
        <p className="issue-card-desc">{issue.description}</p>

        <hr className="issue-card-divider" />

        {/* Location */}
        <div className="issue-location-row">
          <svg className="location-pin-icon" viewBox="0 0 24 24" fill="none" stroke="#144634" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="location-text">{issue.location}</span>
        </div>

        {/* Reporter */}
        <div className="issue-reporter-row">
          <div className="reporter-avatar-circle">
            {issue.createdBy?.avatar || 'AM'}
          </div>
          <span className="reporter-label-text">
            Reported by <strong>{issue.createdBy?.name || 'Aarav Mehta'}</strong>
          </span>
        </div>
      </div>

      {/* Card Footer Bar */}
      <div className="issue-card-bottom-bar">
        <div className="card-actions-left">
          {/* Upvote Button */}
          <button
            type="button"
            className={`action-btn-pill ${issue.upvotedByUser ? 'active-voted' : ''}`}
            onClick={() => onUpvote(issue.id)}
            title="Upvote issue"
            aria-label={`Upvote issue, current votes ${issue.upvotes}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer-action-icon">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span>{issue.upvotes}</span>
          </button>

          {/* Comments Count */}
          <div className="action-btn-pill comments-display" title="Comments">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer-action-icon">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{issue.commentsCount || 0}</span>
          </div>
        </div>

        {/* View Details Button */}
        <button
          type="button"
          className="btn-view-details"
          onClick={() => onViewDetails && onViewDetails(issue)}
        >
          <span>View details</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="details-chevron">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </article>
  );
}
