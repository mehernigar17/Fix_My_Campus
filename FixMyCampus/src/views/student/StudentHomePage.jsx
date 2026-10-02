// View Page: Student Home / Explore Page (MVC Student Module)
import { useEffect } from 'react';
import { useStudentIssuesController } from '../../controllers/student/useStudentIssuesController';
import StudentNavbar from './components/StudentNavbar';
import StudentHeroStats from './components/StudentHeroStats';
import StudentIssuesFilterBar from './components/StudentIssuesFilterBar';
import StudentIssueCard from './components/StudentIssueCard';
import ReportIssueModal from './components/ReportIssueModal';
import IssueDetailModal from './components/IssueDetailModal';
import '../../styles/student.css';

export default function StudentHomePage() {
  const {
    issues,
    totalCount,
    isLoading,
    loadError,
    stats,
    filters,
    categories,
    statuses,
    locations,
    currentUser,
    isMyReportsView,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handleLocationChange,
    handleUpvote,
    isReportModalOpen,
    selectedIssue,
    newIssueData,
    formErrors,
    isSubmitting,
    isPostingComment,
    successMessage,
    clearSuccessMessage,
    handleOpenReportModal,
    handleCloseReportModal,
    handleViewDetails,
    handleCloseDetailModal,
    handleNewIssueInputChange,
    handlePhotoSelect,
    handleRemovePhoto,
    handleCreateIssueSubmit,
    handleAddComment,
  } = useStudentIssuesController();

  // Auto-dismiss the success banner after a few seconds
  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = setTimeout(clearSuccessMessage, 5000);
    return () => clearTimeout(timer);
  }, [successMessage, clearSuccessMessage]);

  return (
    <div className="student-home-page">
      {/* Top Navigation */}
      <StudentNavbar
        currentUser={currentUser}
        onOpenReportModal={handleOpenReportModal}
      />

      <main className="student-main-content">
        {/* Hero Section & Community Stats */}
        <StudentHeroStats stats={stats} />

        {/* Confirmation banner after a successful report */}
        {successMessage && (
          <div className="success-banner" role="status">
            {successMessage}
          </div>
        )}

        {/* Filters & Search Bar */}
        <StudentIssuesFilterBar
          totalCount={totalCount}
          filters={filters}
          categories={categories}
          statuses={statuses}
          locations={locations}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onStatusChange={handleStatusChange}
          onLocationChange={handleLocationChange}
        />

        {/* Load error */}
        {loadError && (
          <div className="issues-empty-state issues-error-state" role="alert">
            <h3>We couldn&apos;t load the reports</h3>
            <p>{loadError}</p>
          </div>
        )}

        {/* Issue Cards Grid */}
        {!loadError && (
          <div className="issues-cards-grid">
            {isLoading ? (
              <div className="issues-empty-state">
                <p>Loading campus issues…</p>
              </div>
            ) : issues.length === 0 ? (
              <div className="issues-empty-state">
                <h3>{isMyReportsView ? 'You haven’t reported anything yet' : 'No matching reports found'}</h3>
                <p>
                  {isMyReportsView
                    ? 'Use “Report an issue” to flag something that needs fixing on campus.'
                    : 'Try changing your search keywords or filter options.'}
                </p>
              </div>
            ) : (
              issues.map((issue) => (
                <StudentIssueCard
                  key={issue.id}
                  issue={issue}
                  onUpvote={handleUpvote}
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        formData={newIssueData}
        errors={formErrors}
        isSubmitting={isSubmitting}
        categories={categories}
        locations={locations}
        onInputChange={handleNewIssueInputChange}
        onPhotoSelect={handlePhotoSelect}
        onRemovePhoto={handleRemovePhoto}
        onSubmit={handleCreateIssueSubmit}
      />

      {/* Issue Detail & Discussion Modal */}
      <IssueDetailModal
        key={selectedIssue?.id || 'none'}
        issue={selectedIssue}
        isOpen={!!selectedIssue}
        isPosting={isPostingComment}
        currentUser={currentUser}
        onClose={handleCloseDetailModal}
        onUpvote={handleUpvote}
        onAddComment={handleAddComment}
      />
    </div>
  );
}