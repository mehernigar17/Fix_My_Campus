// Controller: Admin Operations Business Logic & State Controller
import { useState, useEffect, useCallback } from 'react';
import {
  fetchIssues,
  updateIssueStatus,
  deleteIssue,
  fetchStats,
} from '../../services/issueService';
import { getCurrentUser } from '../../services/authService';

export const useAdminController = () => {
  const [issues, setIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    openCount: 2,
    inProgressCount: 1,
    resolvedCount: 1,
    totalUpvotes: 330,
  });

  // Delete modal state
  const [issueToDelete, setIssueToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Authenticated Admin User
  const [currentUser, setCurrentUser] = useState({
    name: 'Arjun Rao',
    roleTitle: 'Campus administrator',
    avatar: 'AR',
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.name) {
      const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      setCurrentUser({
        name: user.name,
        roleTitle: user.role === 'admin' ? 'Campus administrator' : 'Staff',
        avatar: initials || 'AR',
      });
    }
  }, []);

  const loadIssues = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchIssues({ search: searchQuery });
      setIssues(res.issues || []);
    } catch (err) {
      console.error('Failed to load admin issues:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetchStats();
      if (res) {
        setStats(res);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  }, []);

  useEffect(() => {
    loadIssues();
    loadStats();
  }, [loadIssues, loadStats]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Status Change handler
  const handleStatusChange = useCallback(
    async (issueId, newStatus) => {
      // Optimistic update
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i))
      );

      try {
        await updateIssueStatus(issueId, newStatus);
        loadStats();
      } catch (err) {
        loadIssues();
      }
    },
    [loadIssues, loadStats]
  );

  // Delete confirmation handlers
  const handleOpenDeleteModal = useCallback((issue) => {
    setIssueToDelete(issue);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIssueToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!issueToDelete) return;
    setIsDeleting(true);
    try {
      await deleteIssue(issueToDelete.id);
      setIssueToDelete(null);
      loadIssues();
      loadStats();
    } catch (err) {
      console.error('Failed to delete issue:', err);
    } finally {
      setIsDeleting(false);
    }
  }, [issueToDelete, loadIssues, loadStats]);

  return {
    issues,
    searchQuery,
    isLoading,
    stats,
    currentUser,
    issueToDelete,
    isDeleting,
    handleSearchChange,
    handleStatusChange,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete,
  };
};
