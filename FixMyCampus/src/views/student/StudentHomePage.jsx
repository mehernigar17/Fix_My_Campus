// View Page: Student Home / Explore Page (MVC Student Module)
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
    stats,
    filters,
    categories,
    statuses,
    locations,
    currentUser,
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
    handleOpenReportModal,
    handleCloseReportModal,
    handleViewDetails,
    handleCloseDetailModal,
    handleNewIssueInputChange,
    handlePhotoSelect,
    handleRemovePhoto,
    handleCreateIssueSubmit,
  } = useStudentIssuesController();

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

        {/* Issue Cards Grid */}
        <div className="issues-cards-grid">
          {isLoading ? (
            <div className="issues-empty-state">
              <p>Loading campus issues…</p>
            </div>
          ) : issues.length === 0 ? (
            <div className="issues-empty-state">
              <h3>No matching reports found</h3>
              <p>Try changing your search keywords or filter options.</p>
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
        issue={selectedIssue}
        isOpen={!!selectedIssue}
        onClose={handleCloseDetailModal}
        onUpvote={handleUpvote}
      />
    </div>
  );
}
