// Controller: Student Issues Business Logic & State Controller
import { useState, useEffect, useCallback } from 'react';
import {
  ISSUE_CATEGORIES,
  ISSUE_STATUSES,
  CAMPUS_LOCATIONS,
  createNewIssueState,
  validateIssueForm,
} from '../../models/issueModel';
import {
  fetchIssues,
  toggleUpvote,
  createIssue,
  fetchStats,
} from '../../services/issueService';
import { getCurrentUser } from '../../services/authService';

export const useStudentIssuesController = () => {
  const [issues, setIssues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    resolvedCount: 142,
    resolvedThisMonth: '+18 this month',
    inProgressCount: 24,
    avgResolutionTime: '3.2 days',
  });

  // Filters & Search
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    status: 'All',
    location: 'All locations',
  });

  // Modal Dialogs State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newIssueData, setNewIssueData] = useState(createNewIssueState());
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authenticated Student Profile
  const [currentUser, setCurrentUser] = useState({
    name: 'Maya Sharma',
    role: 'Student',
    avatar: 'MS',
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
        role: user.role === 'admin' ? 'Admin' : 'Student',
        avatar: initials || 'MS',
      });
    }
  }, []);

  const loadIssues = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchIssues(filters);
      setIssues(res.issues || []);
      setTotalCount(res.total ?? (res.issues ? res.issues.length : 0));
    } catch (err) {
      console.error('Failed to load campus issues:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetchStats();
      if (res) setStats(res);
    } catch (err) {
      console.error('Failed to load campus stats:', err);
    }
  }, []);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Filter Handlers
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const handleStatusChange = useCallback((status) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const handleLocationChange = useCallback((location) => {
    setFilters((prev) => ({ ...prev, location }));
  }, []);

  // Upvoting Logic
  const handleUpvote = useCallback(async (issueId) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const isUpvoted = !issue.upvotedByUser;
          return {
            ...issue,
            upvotedByUser: isUpvoted,
            upvotes: isUpvoted ? issue.upvotes + 1 : Math.max(0, issue.upvotes - 1),
          };
        }
        return issue;
      })
    );

    // If modal is currently viewing this issue, update it too
    setSelectedIssue((prev) => {
      if (prev && prev.id === issueId) {
        const isUpvoted = !prev.upvotedByUser;
        return {
          ...prev,
          upvotedByUser: isUpvoted,
          upvotes: isUpvoted ? prev.upvotes + 1 : Math.max(0, prev.upvotes - 1),
        };
      }
      return prev;
    });

    try {
      await toggleUpvote(issueId);
    } catch (err) {
      loadIssues();
    }
  }, [loadIssues]);

  // Modal Triggers
  const handleOpenReportModal = useCallback(() => {
    setNewIssueData(createNewIssueState());
    setFormErrors({});
    setIsReportModalOpen(true);
  }, []);

  const handleCloseReportModal = useCallback(() => {
    setIsReportModalOpen(false);
    setFormErrors({});
  }, []);

  const handleViewDetails = useCallback((issue) => {
    setSelectedIssue(issue);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setSelectedIssue(null);
  }, []);

  const handleNewIssueInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewIssueData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handlePhotoSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, photo: 'Photo must be smaller than 5MB.' }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewIssueData((prev) => ({
          ...prev,
          photo: file,
          photoPreview: event.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemovePhoto = useCallback(() => {
    setNewIssueData((prev) => ({
      ...prev,
      photo: null,
      photoPreview: null,
    }));
  }, []);

  const handleCreateIssueSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { isValid, errors } = validateIssueForm(newIssueData);
      if (!isValid) {
        setFormErrors(errors);
        return;
      }

      setIsSubmitting(true);
      try {
        await createIssue(newIssueData);
        setIsReportModalOpen(false);
        setNewIssueData(createNewIssueState());
        loadIssues();
      } catch (err) {
        setFormErrors({ submit: 'Failed to create report. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [newIssueData, loadIssues]
  );

  return {
    issues,
    totalCount,
    isLoading,
    stats,
    filters,
    categories: ISSUE_CATEGORIES,
    statuses: ISSUE_STATUSES,
    locations: CAMPUS_LOCATIONS,
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
  };
};
