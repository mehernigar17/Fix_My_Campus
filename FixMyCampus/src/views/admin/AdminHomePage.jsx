// View Page: Admin Home / Operations Overview Page (MVC Admin Module)
import { useAdminController } from '../../controllers/admin/useAdminController';
import AdminNavbar from './components/AdminNavbar';
import AdminHeroStats from './components/AdminHeroStats';
import AdminIssuesTable from './components/AdminIssuesTable';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ResolveNoteModal from './components/ResolveNoteModal';
import ReviewNoteModal from './components/ReviewNoteModal';
import '../../styles/admin.css';

export default function AdminHomePage() {
  const {
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
    stats,
    currentUser,
    savingIssueId,
    toast,
    issueToResolve,
    resolutionNote,
    reviewTarget,
    reviewNote,
    isReviewing,
    issueToDelete,
    isDeleting,
    handleSearchChange,
    handleStatusFilterChange,
    handleCategoryFilterChange,
    handleModerationFilterChange,
    handleClearFilters,
    handleStatusChange,
    handleCloseResolveModal,
    handleResolutionNoteChange,
    handleConfirmResolve,
    handleReviewClick,
    handleCloseReviewModal,
    handleReviewNoteChange,
    handleConfirmReview,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
    dismissToast,
  } = useAdminController();

  return (
    <div className="admin-home-page">
      {/* Top Admin Navbar */}
      <AdminNavbar currentUser={currentUser} />

      <main className="admin-main-content">
        {/* Operations Overview Hero & 4 Stat Cards */}
        <AdminHeroStats
          stats={stats}
          adminName={currentUser?.name}
        />

        {/* Feedback after a status change or a deletion */}
        {toast && (
          <div
            className={`admin-toast ${toast.type === 'error' ? 'admin-toast-error' : 'admin-toast-success'}`}
            role="status"
          >
            <span>{toast.message}</span>
            <button type="button" className="admin-toast-close" onClick={dismissToast} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}

        {/* Issue Management Table with Live Status Controls & Search */}
        <AdminIssuesTable
          issues={issues}
          totalCount={totalCount}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          categoryFilter={categoryFilter}
          moderationFilter={moderationFilter}
          categories={categories}
          statuses={statuses}
          moderationFilters={moderationFilters}
          isLoading={isLoading}
          loadError={loadError}
          savingIssueId={savingIssueId}
          onSearchChange={handleSearchChange}
          onStatusFilterChange={handleStatusFilterChange}
          onCategoryFilterChange={handleCategoryFilterChange}
          onModerationFilterChange={handleModerationFilterChange}
          onClearFilters={handleClearFilters}
          onStatusChange={handleStatusChange}
          onReviewClick={handleReviewClick}
          onDeleteClick={handleOpenDeleteModal}
        />
      </main>

      {/* Resolution Note Dialog */}
      <ResolveNoteModal
        issue={issueToResolve}
        isOpen={!!issueToResolve}
        note={resolutionNote}
        onNoteChange={handleResolutionNoteChange}
        onClose={handleCloseResolveModal}
        onConfirm={handleConfirmResolve}
        isSaving={savingIssueId === issueToResolve?.id}
      />

      {/* Admin Review Dialog — publish a report to the board or reject it */}
      <ReviewNoteModal
        issue={reviewTarget?.issue}
        decision={reviewTarget?.decision}
        isOpen={!!reviewTarget}
        note={reviewNote}
        onNoteChange={handleReviewNoteChange}
        onClose={handleCloseReviewModal}
        onConfirm={handleConfirmReview}
        isSaving={isReviewing}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        issue={issueToDelete}
        isOpen={!!issueToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
