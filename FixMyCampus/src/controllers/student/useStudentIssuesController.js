// Controller: Student Issues Business Logic & State Controller
// All data comes from the FixMyCampus API; there is no local mock layer.
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ISSUE_CATEGORIES,
  ISSUE_STATUSES,
  CAMPUS_LOCATIONS,
  createNewIssueState,
  validateIssueForm,
  derivePriority,
  initialsFromName,
} from '../../models/issueModel';
import {
  fetchIssues,
  fetchMyIssues,
  fetchIssue,
  createIssue,
  toggleUpvote,
  addComment,
  fetchStats,
  duplicateReportFrom,
} from '../../services/issueService';
import { getCurrentUser } from '../../services/authService';
import { apiErrorMessage } from '../../services/apiClient';

// Typing in the search box shouldn't fire a request per keystroke.
const SEARCH_DEBOUNCE_MS = 350;

const EMPTY_STATS = {
  resolvedCount: 0,
  resolvedThisMonth: '0 this month',
  inProgressCount: 0,
  openCount: 0,
  avgResolutionTime: '—',
};

const INITIAL_FILTERS = {
  search: '',
  category: 'All',
  status: 'All',
  location: 'All locations',
};

// Read the signed-in profile straight out of localStorage — no effect needed.
const readCurrentUser = () => {
  const user = getCurrentUser();
  if (!user || !user.name) {
    return { name: 'Maya Sharma', role: 'Student', avatar: 'MS' };
  }
  return {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role === 'admin' ? 'Admin' : 'Student',
    avatar: initialsFromName(user.name) || 'MS',
  };
};

export const useStudentIssuesController = () => {
  const location = useLocation();
  const isMyReportsView = location.pathname === '/student/my-reports';

  const [issues, setIssues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [stats, setStats] = useState(EMPTY_STATS);

  // Filters & Search — `filters` drives the inputs, `appliedFilters` the request
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);

  // Modal Dialogs State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  // An issue fetched on demand (the duplicate the API pointed us at) — kept
  // apart from the paged list so it can open even outside the current filters.
  const [previewIssue, setPreviewIssue] = useState(null);
  const [newIssueData, setNewIssueData] = useState(createNewIssueState());
  const [formErrors, setFormErrors] = useState({});
  // The already-reported issue behind a rejected submission, if any
  const [duplicateIssue, setDuplicateIssue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpvotingDuplicate, setIsUpvotingDuplicate] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Authenticated Student Profile
  const [currentUser] = useState(readCurrentUser);

  // Debounce the search box before it reaches the API
  useEffect(() => {
    const timer = setTimeout(() => setAppliedFilters(filters), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filters]);

  const loadIssues = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = isMyReportsView
        ? await fetchMyIssues(appliedFilters)
        : await fetchIssues(appliedFilters, { sort: 'newest' });

      setIssues(res.issues);
      setTotalCount(res.total);
    } catch (err) {
      setIssues([]);
      setTotalCount(0);
      setLoadError(apiErrorMessage(err, 'Could not load campus issues.'));
    } finally {
      setIsLoading(false);
    }
  }, [appliedFilters, isMyReportsView]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetchStats();
      if (res) setStats({ ...EMPTY_STATS, ...res });
    } catch (err) {
      console.error('Failed to load campus stats:', err);
    }
  }, []);

  useEffect(() => {
    (async () => loadIssues())();
  }, [loadIssues]);

  useEffect(() => {
    (async () => loadStats())();
  }, [loadStats]);

  // The detail modal renders the live copy held in the list, or the issue
  // fetched on demand (an existing report the duplicate check pointed to).
  const selectedIssue = useMemo(
    () => previewIssue || issues.find((issue) => issue.id === selectedIssueId) || null,
    [issues, selectedIssueId, previewIssue]
  );

  const patchIssue = useCallback((issueId, patch) => {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === issueId ? { ...issue, ...patch } : issue))
    );
  }, []);

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

  // Upvoting Logic — optimistic, then reconciled with the server's count
  const handleUpvote = useCallback(
    async (issueId) => {
      setIssues((prev) =>
        prev.map((issue) => {
          if (issue.id !== issueId) return issue;
          const upvotedByUser = !issue.upvotedByUser;
          const upvotes = upvotedByUser ? issue.upvotes + 1 : Math.max(issue.upvotes - 1, 0);
          return { ...issue, upvotedByUser, upvotes, priority: derivePriority(upvotes) };
        })
      );

      try {
        const { upvoted, upvoteCount } = await toggleUpvote(issueId);
        patchIssue(issueId, {
          upvotedByUser: upvoted,
          upvotes: upvoteCount,
          priority: derivePriority(upvoteCount),
        });
      } catch {
        // Server is the source of truth — resync on failure
        loadIssues();
      }
    },
    [loadIssues, patchIssue]
  );

  // Modal Triggers
  const handleOpenReportModal = useCallback(() => {
    setNewIssueData(createNewIssueState());
    setFormErrors({});
    setDuplicateIssue(null);
    setSuccessMessage('');
    setIsReportModalOpen(true);
  }, []);

  const handleCloseReportModal = useCallback(() => {
    setIsReportModalOpen(false);
    setFormErrors({});
    setDuplicateIssue(null);
  }, []);

  const handleViewDetails = useCallback((issue) => {
    setPreviewIssue(null);
    setSelectedIssueId(issue.id);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setSelectedIssueId(null);
    setPreviewIssue(null);
  }, []);

  // Editing the report fields clears the "already reported" notice, since the
  // duplicate check will run again against the new wording.
  const handleNewIssueInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewIssueData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    setDuplicateIssue(null);
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
      setFormErrors({});
      setDuplicateIssue(null);
      setSuccessMessage('');

      const { isValid, errors } = validateIssueForm(newIssueData);
      if (!isValid) {
        setFormErrors(errors);
        return;
      }

      setIsSubmitting(true);
      try {
        const { issue } = await createIssue(newIssueData);

        setIssues((prev) => [issue, ...prev.filter((item) => item.id !== issue.id)]);
        setTotalCount((prev) => prev + 1);

        setIsReportModalOpen(false);
        setNewIssueData(createNewIssueState());
        setSuccessMessage('Your report was submitted. Thanks for flagging it!');
        loadStats();
      } catch (err) {
        // The same problem is already on the board: show the existing report
        // and let the student support it instead of filing a copy.
        const duplicate = duplicateReportFrom(err);
        if (duplicate) {
          setDuplicateIssue(duplicate);
        } else {
          setFormErrors({
            submit: apiErrorMessage(err, 'Failed to create report. Please try again.'),
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [newIssueData, loadStats]
  );

  // "Upvote the existing report instead" — support the report that already
  // exists, then close the form.
  const handleUpvoteDuplicate = useCallback(async () => {
    if (!duplicateIssue) return;
    setIsUpvotingDuplicate(true);
    try {
      if (!duplicateIssue.upvotedByUser) {
        await toggleUpvote(duplicateIssue.id);
      }
      setIsReportModalOpen(false);
      setFormErrors({});
      setDuplicateIssue(null);
      setSuccessMessage(
        duplicateIssue.upvotedByUser
          ? 'That problem was already reported — opening the existing report.'
          : 'Thanks! Your upvote was added to the existing report.'
      );
      loadStats();
    } catch (err) {
      setFormErrors({ submit: apiErrorMessage(err, 'Could not upvote the existing report.') });
    } finally {
      setIsUpvotingDuplicate(false);
    }
  }, [duplicateIssue, loadStats]);

  // Open the existing report, fetching it when the current filters hide it.
  const handleViewDuplicate = useCallback(async () => {
    if (!duplicateIssue) return;
    try {
      const known = issues.find((issue) => issue.id === duplicateIssue.id);
      const issue = known || (await fetchIssue(duplicateIssue.id));
      setPreviewIssue(issue);
      setIsReportModalOpen(false);
      setFormErrors({});
      setDuplicateIssue(null);
    } catch (err) {
      setFormErrors({ submit: apiErrorMessage(err, 'Could not open the existing report.') });
    }
  }, [duplicateIssue, issues]);

  // "Report something different" — drop the notice, keep the form.
  const handleDismissDuplicate = useCallback(() => {
    setDuplicateIssue(null);
  }, []);

  // Post a comment on the open issue and refresh it from the server response
  const handleAddComment = useCallback(
    async (issueId, text) => {
      const clean = (text || '').trim();
      if (!clean) return false;

      setIsPostingComment(true);
      try {
        const { issue } = await addComment(issueId, clean);
        patchIssue(issueId, issue);
        return true;
      } catch (err) {
        console.error('Failed to post comment:', err);
        return false;
      } finally {
        setIsPostingComment(false);
      }
    },
    [patchIssue]
  );

  // Auto-dismiss the success banner
  const clearSuccessMessage = useCallback(() => setSuccessMessage(''), []);

  return {
    issues,
    totalCount,
    isLoading,
    loadError,
    stats,
    filters,
    categories: ISSUE_CATEGORIES,
    statuses: ISSUE_STATUSES,
    locations: CAMPUS_LOCATIONS,
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
    duplicateIssue,
    isSubmitting,
    isUpvotingDuplicate,
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
    handleUpvoteDuplicate,
    handleViewDuplicate,
    handleDismissDuplicate,
    handleAddComment,
    loadIssues,
  };
};