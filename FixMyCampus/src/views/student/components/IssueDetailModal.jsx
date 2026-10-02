// View Component: Issue Details & Comments Modal (Green Theme)
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

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="detail-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
      >
        <button
          type="button"
          className="report-modal-close-circle"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Photo */}
        {issue.photo && (
          <div className="detail-modal-photo-wrap">
            <img src={issue.photo} alt={issue.title} className="detail-modal-photo" />
            <div className="detail-floating-tags">
              <span className="issue-card-cat-badge card-cat-water">{issue.category}</span>
              <span className="issue-card-status-badge">
                <span className="status-indicator-dot" style={{ backgroundColor: statusColor }} />
                <span>{issue.status}</span>
              </span>
            </div>
          </div>
        )}

        <div className="detail-modal-content">
          <div className="issue-priority-row">
            <span className="priority-label-green">{issue.priority || 'HIGH PRIORITY'}</span>
            <span className="issue-time-ago">{issue.createdAt}</span>
          </div>

          <h2 id="detail-modal-title" className="detail-modal-heading">{issue.title}</h2>
          <p className="detail-modal-desc">{issue.description}</p>

          <div className="detail-modal-meta-grid">
            <div className="detail-meta-box">
              <span className="detail-meta-lbl">LOCATION</span>
              <span className="detail-meta-val">{issue.location}</span>
            </div>
            <div className="detail-meta-box">
              <span className="detail-meta-lbl">REPORTED BY</span>
              <span className="detail-meta-val">{issue.createdBy?.name || 'Campus member'}</span>
            </div>
          </div>

          {/* Upvote — stays in sync with the card behind the modal */}
          <div className="card-actions-left detail-upvote-row">
            <button
              type="button"
              className={`action-btn-pill ${issue.upvotedByUser ? 'active-voted' : ''}`}
              onClick={() => onUpvote?.(issue.id)}
              aria-pressed={!!issue.upvotedByUser}
              title="Upvote issue"
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
            <h3 className="comments-heading">
              Discussion ({comments.length})
            </h3>

            {/* Comment input form */}
            <form onSubmit={handleAddComment} className="comment-input-form">
              <input
                type="text"
                placeholder="Add a comment or update on this issue…"
                className="comment-text-input"
                value={commentText}
                maxLength={1000}
                disabled={isPosting}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="comment-submit-btn" disabled={isPosting}>
                {isPosting ? 'Posting…' : 'Post'}
              </button>
            </form>
            {commentError && <span className="modal-field-err">{commentError}</span>}

            {/* Comments stack */}
            <div className="comments-list-stack">
              {comments.length === 0 ? (
                <p className="comments-empty-note">
                  No comments yet — be the first to add an update.
                </p>
              ) : (
                [...comments]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((c) => {
                    const isMine = currentUser?.id && String(c.userId) === String(currentUser.id);
                    return (
                      <div key={c.id} className="comment-item">
                        <div className="reporter-avatar-circle">{c.avatar}</div>
                        <div className="comment-bubble">
                          <div className="comment-author-row">
                            <span className="comment-author-name">{isMine ? 'You' : c.author}</span>
                            <span className="comment-time">{c.time}</span>
                          </div>
                          <p className="comment-text">{c.text}</p>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}