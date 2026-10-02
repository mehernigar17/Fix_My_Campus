// View Component: Issue Details & Comments Modal (Green Theme)
import { useState } from 'react';

export default function IssueDetailModal({ issue, isOpen, onClose, onUpvote }) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 'c-1',
      author: 'Maya Sharma',
      avatar: 'MS',
      text: 'I noticed this earlier today during my morning lecture as well. Very hazardous.',
      time: '12 min ago',
    },
    {
      id: 'c-2',
      author: 'Campus Maintenance Team',
      avatar: 'CM',
      text: 'A technician has been dispatched to inspect and resolve.',
      time: '5 min ago',
    },
  ]);

  if (!isOpen || !issue) return null;

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: 'Maya Sharma',
      avatar: 'MS',
      text: commentText.trim(),
      time: 'Just now',
    };

    setComments([newComment, ...comments]);
    setCommentText('');
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
                <span className="status-indicator-dot" style={{ backgroundColor: '#ef4444' }} />
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
              <span className="detail-meta-val">{issue.createdBy?.name || 'Aarav Mehta'}</span>
            </div>
          </div>

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
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="comment-submit-btn">
                Post
              </button>
            </form>

            {/* Comments stack */}
            <div className="comments-list-stack">
              {comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <div className="reporter-avatar-circle">{c.avatar}</div>
                  <div className="comment-bubble">
                    <div className="comment-author-row">
                      <span className="comment-author-name">{c.author}</span>
                      <span className="comment-time">{c.time}</span>
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
