// View Component: Search & Filter Controls for Student Campus Issues
export default function StudentIssuesFilterBar({
  totalCount,
  filters,
  categories,
  statuses,
  locations,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onLocationChange,
}) {
  return (
    <div className="issues-filter-section">
      {/* Header Row */}
      <div className="issues-header-row">
        <div>
          <h2 className="issues-heading">Campus issues</h2>
          <p className="issues-subheading">
            See what your community needs help with right now.
          </p>
        </div>
        <div className="issues-count-badge">
          {totalCount} {totalCount === 1 ? 'report' : 'reports'}
        </div>
      </div>

      {/* Filter Inputs Grid */}
      <div className="filters-bar-grid">
        {/* Search */}
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search by issue or location..."
            value={filters.search}
            onChange={onSearchChange}
          />
          {filters.search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange({ target: { value: '' } })}
            >
              ×
            </button>
          )}
        </div>

        {/* Category */}
        <div className="filter-select-group">
          <label className="filter-select-label">CATEGORY</label>
          <div className="custom-select-box">
            <select
              value={filters.category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="filter-select-control"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <svg className="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Status */}
        <div className="filter-select-group">
          <label className="filter-select-label">STATUS</label>
          <div className="custom-select-box">
            <select
              value={filters.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="filter-select-control"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <svg className="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Location */}
        <div className="filter-select-group">
          <label className="filter-select-label">LOCATION</label>
          <div className="custom-select-box">
            <select
              value={filters.location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="filter-select-control"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <svg className="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
