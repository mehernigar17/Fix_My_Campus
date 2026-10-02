// View Component: Modal Dialog for Reporting a New Issue (Green Brand Theme)
import { useRef } from 'react';

export default function ReportIssueModal({
  isOpen,
  onClose,
  formData,
  errors,
  isSubmitting,
  categories,
  onInputChange,
  onPhotoSelect,
  onRemovePhoto,
  onSubmit,
}) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="report-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-heading"
      >
        {/* Close Button Top Right */}
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

        {/* Modal Header */}
        <div className="report-modal-header">
          <p className="report-modal-eyebrow">NEW REPORT</p>
          <h2 id="report-modal-heading" className="report-modal-title">What needs fixing?</h2>
          <p className="report-modal-subtitle">Give campus staff enough detail to act quickly.</p>
        </div>

        {/* Modal Form */}
        <form onSubmit={onSubmit} className="report-modal-form" noValidate>
          {errors.submit && (
            <div className="modal-error-banner">{errors.submit}</div>
          )}

          {/* Issue Title */}
          <div className="modal-field-block">
            <label className="modal-field-label" htmlFor="modal-title-input">
              Issue title
            </label>
            <input
              id="modal-title-input"
              type="text"
              name="title"
              className={`modal-text-input ${errors.title ? 'error' : ''}`}
              placeholder="e.g. Broken fan in lecture hall"
              value={formData.title}
              onChange={onInputChange}
            />
            {errors.title && <span className="modal-field-err">{errors.title}</span>}
          </div>

          {/* Category & Location Grid */}
          <div className="modal-fields-row">
            {/* Category Select */}
            <div className="modal-field-block">
              <label className="modal-field-label" htmlFor="modal-cat-select">
                Category
              </label>
              <div className="modal-select-wrapper">
                <select
                  id="modal-cat-select"
                  name="category"
                  className={`modal-select-control ${errors.category ? 'error' : ''}`}
                  value={formData.category}
                  onChange={onInputChange}
                >
                  <option value="" disabled>Select category</option>
                  {categories
                    .filter((c) => c !== 'All')
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
                <svg className="modal-select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {errors.category && <span className="modal-field-err">{errors.category}</span>}
            </div>

            {/* Location Input */}
            <div className="modal-field-block">
              <label className="modal-field-label" htmlFor="modal-loc-input">
                Location
              </label>
              <input
                id="modal-loc-input"
                type="text"
                name="location"
                className={`modal-text-input ${errors.location ? 'error' : ''}`}
                placeholder="Building, floor or room"
                value={formData.location}
                onChange={onInputChange}
              />
              {errors.location && <span className="modal-field-err">{errors.location}</span>}
            </div>
          </div>

          {/* Description */}
          <div className="modal-field-block">
            <label className="modal-field-label" htmlFor="modal-desc-input">
              Description
            </label>
            <textarea
              id="modal-desc-input"
              name="description"
              rows={4}
              className={`modal-textarea-control ${errors.description ? 'error' : ''}`}
              placeholder="Describe what happened and how urgently it needs attention..."
              value={formData.description}
              onChange={onInputChange}
            />
            {errors.description && <span className="modal-field-err">{errors.description}</span>}
          </div>

          {/* Add a Photo Area */}
          <div className="modal-field-block">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/png, image/jpeg, image/jpg"
              onChange={onPhotoSelect}
            />

            {formData.photoPreview ? (
              <div className="photo-preview-container">
                <img src={formData.photoPreview} alt="Selected preview" className="photo-preview-img" />
                <button
                  type="button"
                  className="photo-remove-btn"
                  onClick={onRemovePhoto}
                >
                  Remove photo
                </button>
              </div>
            ) : (
              <div
                className="modal-photo-dropzone"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                <div className="photo-dropzone-content">
                  <span className="photo-add-text">
                    <span className="plus-sign">+</span> Add a photo
                  </span>
                  <span className="photo-note-text">Optional · JPG or PNG up to 5MB</span>
                </div>
              </div>
            )}
            {errors.photo && <span className="modal-field-err">{errors.photo}</span>}
          </div>

          {/* Footer Actions (Brand Green Button) */}
          <div className="report-modal-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit-green"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Submitting…' : 'Submit report'}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="submit-arrow-icon">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
