// View Page: Admin Home / Operations Overview Page (MVC Admin Module)
import { useAdminController } from '../../controllers/admin/useAdminController';
import AdminNavbar from './components/AdminNavbar';
import AdminHeroStats from './components/AdminHeroStats';
import AdminIssuesTable from './components/AdminIssuesTable';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import '../../styles/admin.css';

export default function AdminHomePage() {
  const {
    issues,
    searchQuery,
    stats,
    currentUser,
    issueToDelete,
    isDeleting,
    handleSearchChange,
    handleStatusChange,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
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

        {/* Issue Management Table with Live Status Controls & Search */}
        <AdminIssuesTable
          issues={issues}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onDeleteClick={handleOpenDeleteModal}
        />
      </main>

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
