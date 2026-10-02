// View Component: Confirmation Modal for Marking a Report Resolved
// Staff can leave a short note that the student sees on the report.
export default function ResolveNoteModal({
  issue,
  isOpen,
  note,
  onNoteChange,
  onClose,
  onConfirm,
  isSaving,
}) {
  if (!isOpen || !issue) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="delete-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resolve-dialog-title"
      >
        <div className="delete-modal-icon-circle resolve-modal-icon-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3 id="resolve-dialog-title" className="delete-modal-title">
          Mark as resolved
        </h3>
        <p className="delete-modal-text">
          <strong>&quot;{issue.title}&quot;</strong> will move to Resolved. Add a note so the
          student knows what was done (optional).
        </p>

        <textarea
          className="resolve-modal-textarea"
          rows={3}
          maxLength={1000}
          placeholder="e.g. Replaced the tap washer and tested the water flow."
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
            className="btn-modal-submit-green"
            onClick={onConfirm}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : 'Mark resolved'}
          </button>
        </div>
      </div>
    </div>
  );
}
