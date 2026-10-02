// View Component: Issue Details & Discussion Modal (Centered Modal matching Screenshots)
import { useState } from 'react';

const STATUS_DOT_COLORS = {
  open: '#ef4444',
  'in progress': '#f59e0b',
  resolved: '#16a34a',
};

export default function IssueDetailModal({
  issue,
  isOpen,
  isPosting = false,
  currentUser,
  onClose,
  onUpvote,
  onAddComment,
}) {
  // Mounted per-issue (key={issue.id}), so the draft resets on every switch
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  if (!isOpen || !issue) return null;

  const comments = issue.comments || [];
  const statusColor = STATUS_DOT_COLORS[issue.status?.toLowerCase()] || '#64748b';

  // Until staff approve the report it is private, so there is nothing for the
  // campus to upvote or discuss yet.
  const moderation = issue.moderation || { state: 'approved', label: 'Approved', note: '' };
  const isPublished = moderation.state === 'approved';

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isPosting) return;

    const posted = await onAddComment?.(issue.id, commentText);
    if (posted) {
      setCommentText('');
      setCommentError('');
    } else {
      setCommentError('Could not post your comment. Please try again.');
    }
  };

  const formattedIssueId = issue.issueIdFormatted || 'ISS-01044';
  const authorName = issue.createdBy?.name || 'Riya Patel';
  const authorUserId = issue.createdBy?.userId || 'USR-014';

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="issue-detail-modal-centered"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-detail-heading"
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          className="detail-close-circle"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── 2. Photo Banner ── */}
        {issue.photo && (
          <div className="detail-photo-banner-wrap">
            <img src={issue.photo} alt={issue.title} className="detail-photo-banner-img" />
          </div>
        )}

        <div className="detail-created-time">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="time-clock-icon">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{issue.createdAt || 'Created Yesterday'}</span>
        </div>

        {/* Review state — a report is off the campus board until staff approve it */}
        {!isPublished && (
          <div className={`detail-moderation-banner detail-moderation-${moderation.state}`} role="status">
            <span className="detail-moderation-title">
              {moderation.state === 'rejected'
                ? 'Not published — staff turned this down'
                : 'Waiting for staff approval'}
            </span>
            <p className="detail-moderation-text">
              {moderation.state === 'rejected'
                ? moderation.note ||
                  'Campus staff declined this report. You can edit it and send it back for review.'
                : 'Campus staff are checking this report. It appears on the campus board once they approve it — only you can see it for now.'}
            </p>
          </div>
        )}

        {/* ── 3. Issue Information Card ── */}
        <div className="detail-card-panel">
          <h3 className="detail-panel-title">Issue information</h3>
          <div className="info-grid-2col">
            <div className="info-cell">
              <span className="info-cell-label">ISSUE ID</span>
              <span className="info-cell-val">{formattedIssueId}</span>
            </div>
            <div className="info-cell">
              <span className="info-cell-label">STATUS</span>
              <span className="info-cell-val font-semibold">
                <span className="status-indicator-dot" style={{ backgroundColor: statusColor }} />
                {issue.status}
              </span>
            </div>
            <div className="info-cell">
              <span className="info-cell-label">CATEGORY</span>
              <span className="info-cell-val font-semibold">{issue.category}</span>
            </div>
            <div className="info-cell">
              <span className="info-cell-label">CREATED AT</span>
              <span className="info-cell-val">{issue.createdAtFormatted || 'Today, 09:18 AM'}</span>
            </div>
            <div className="info-cell">
              <span className="info-cell-label">LOCATION</span>
              <span className="info-cell-val font-semibold">{issue.location}</span>
            </div>
            <div className="info-cell">
              <span className="info-cell-label">CREATED BY</span>
              <span className="info-cell-val">
                {authorName} · <span className="text-subtle">{authorUserId}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── 4. Description Card ── */}
        <div className="detail-card-panel">
          <span className="info-cell-label mb-1">DESCRIPTION</span>
          <p className="detail-description-text">{issue.description}</p>
        </div>

        {/* ── 5. Community Upvotes Card ── */}
        <div className="detail-card-panel">
          <div className="upvotes-card-header">
            <div>
              <h3 className="detail-panel-title">Community upvotes</h3>
              <p className="detail-panel-sub">One vote per verified campus user</p>
            </div>
            <button
              type="button"
              className={`btn-upvote-outline ${issue.upvotedByUser ? 'active-upvoted' : ''}`}
              onClick={() => onUpvote?.(issue.id)}
              aria-pressed={!!issue.upvotedByUser}
              disabled={!isPublished}
              title={isPublished ? 'Upvote this report' : 'Available once staff approve this report'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upvote-thumb-icon">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              <span>{issue.upvotedByUser ? 'Upvoted' : 'Upvote'}</span>
            </button>
          </div>

          <div className="upvotes-metrics-inner-box">
            <div className="upvotes-left-stat">
              <span className="upvotes-big-number">{issue.upvotes}</span>
              <div className="upvotes-stat-labels">
                <span className="stat-urgent-text">people marked this urgent</span>
                <span className="stat-record-sub">
                  Upvote record: {formattedIssueId}
                </span>
              </div>
            </div>
            <div className="detail-meta-box">
              <span className="detail-meta-lbl">REPORTED BY</span>
              <span className="detail-meta-val">{issue.createdBy?.name || 'Campus member'}</span>
            </div>
          </div>
        </div>

        {/* Upvote — stays in sync with the card behind the modal */}
        <div className="card-actions-left detail-upvote-row">
          <button
            type="button"
            className={`action-btn-pill ${issue.upvotedByUser ? 'active-voted' : ''}`}
            onClick={() => onUpvote?.(issue.id)}
            aria-pressed={!!issue.upvotedByUser}
            title={isPublished ? 'Upvote issue' : 'Available once staff approve this report'}
            disabled={!isPublished}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="footer-action-icon">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span>{issue.upvotes}</span>
          </button>
        </div>

        {/* Resolution note, when an admin has closed the issue */}
        {issue.resolutionNote && (
          <div className="detail-resolution-note">
            <span className="detail-meta-lbl">RESOLUTION</span>
            <p>{issue.resolutionNote}</p>
          </div>
        )}

        {/* Comments Section */}
        <div className="detail-comments-section">
          <div className="comments-card-header">
            <h3 className="detail-panel-title">Discussion ({comments.length})</h3>
            <p className="detail-panel-sub">Comments and updates from the campus community</p>
          </div>

          {/* Existing comments */}
          <div className="comments-thread-stack">
            {comments.length === 0 ? (
              <p className="comments-empty-note">
                No comments yet — be the first to add an update.
              </p>
            ) : (
              comments.map((cmt) => (
                <div key={cmt.id} className="comment-card-item">
                  <div
                    className="comment-user-avatar"
                    style={{ backgroundColor: cmt.avatarColor || '#dcfce7', color: cmt.textColor || '#166534' }}
                  >
                    {cmt.avatar}
                  </div>
                  <div className="comment-content-wrap">
                    <div className="comment-top-author-line">
                      <div className="comment-author-badge-group">
                        <span className="comment-author-name">
                          {currentUser?.id && String(cmt.userId) === String(currentUser.id) ? 'You' : cmt.author}
                        </span>
                        {cmt.badge && <span className="comment-role-tag">{cmt.badge}</span>}
                      </div>
                      <span className="comment-timestamp">{cmt.time}</span>
                    </div>
                    <p className="comment-body-text">{cmt.text}</p>
                    <p className="comment-tracking-sub">
                      Comment {cmt.code || 'CMT-280'} · User {cmt.userId || 'USR-006'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Input Form */}
          {isPublished ? (
            <form onSubmit={handleAddComment} className="add-comment-interactive-row">
              <div className="my-comment-avatar">AM</div>
              <div className="add-comment-input-wrap">
                <input
                  type="text"
                  className="add-comment-field"
                  placeholder="Add an update or useful detail..."
                  value={commentText}
                  maxLength={1000}
                  disabled={isPosting}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" className="comment-submit-btn" disabled={isPosting}>
                  {isPosting ? 'Posting…' : 'Post'}
                </button>
              </div>
            </form>
          ) : (
            <p className="comments-empty-note">
              Discussion opens up once campus staff approve this report.
            </p>
          )}
          {commentError && <span className="modal-field-err">{commentError}</span>}

          <p className="comment-guideline-note">
            Be specific and respectful. Staff can see this comment.
          </p>
        </div>
      </div>
    </div>
  );
}
