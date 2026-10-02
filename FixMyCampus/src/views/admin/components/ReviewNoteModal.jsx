// View Component: Confirmation Modal for Approving or Rejecting a Report
// A report stays off the campus board until an admin approves it. Either
// decision can carry a short note that the reporter sees.
export default function ReviewNoteModal({
  issue,
  decision,
  isOpen,
  note,
  onNoteChange,
  onClose,
  onConfirm,
  isSaving,
}) {
  if (!isOpen || !issue) return null;

  const isApprove = decision === 'approve';
  const heading = isApprove ? 'Publish to the campus board' : 'Reject this report';
  const confirmLabel = isApprove ? 'Approve & publish' : 'Reject report';
  const placeholder = isApprove
    ? 'Optional: e.g. Confirmed with the block supervisor, publishing.'
    : 'Tell the student why (e.g. This was fixed last week — please add a photo.)';

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="delete-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-dialog-title"
      >
        <div
          className={`delete-modal-icon-circle ${isApprove ? 'resolve-modal-icon-circle' : 'review-reject-icon-circle'}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {isApprove ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <>
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </>
            )}
          </svg>
        </div>

        <h3 id="review-dialog-title" className="delete-modal-title">
          {heading}
        </h3>
        <p className="delete-modal-text">
          <strong>&quot;{issue.title}&quot;</strong>{' '}
          {isApprove
            ? 'will become visible to every student on the campus board.'
            : 'will stay off the campus board. The student can still see it in “My reports”.'}
        </p>

        <textarea
          className="resolve-modal-textarea"
          rows={3}
          maxLength={500}
          placeholder={placeholder}
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          disabled={isSaving}
        />

        <div className="delete-modal-actions">
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn-modal-submit-green ${isApprove ? '' : 'btn-modal-submit-reject'}`}
            onClick={onConfirm}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}