// View Component: Confirmation Modal for Report Deletion (Signature Green Theme)
export default function DeleteConfirmModal({
  issue,
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}) {
  if (!isOpen || !issue) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="delete-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="delete-modal-icon-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        <h3 id="delete-dialog-title" className="delete-modal-title">
          Remove this report?
        </h3>
        <p className="delete-modal-text">
          Are you sure you want to remove <strong>"{issue.title}"</strong>?
        </p>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-modal-submit-green"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Removing…' : 'Yes, remove'}
          </button>
        </div>
      </div>
    </div>
  );
}
