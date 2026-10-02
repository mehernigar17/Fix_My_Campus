// Controller: Admin Operations Business Logic & State Controller
// Everything on this screen comes from the FixMyCampus API — the issue list,
// the overview cards, status changes, resolution notes and deletions.
import { useState, useEffect, useCallback } from 'react';
import {
  fetchIssues,
  fetchStats,
  updateIssueStatus,
  reviewIssue,
  deleteIssue,
} from '../../services/issueService';
import { apiErrorMessage } from '../../services/apiClient';
import { getCurrentUser } from '../../services/authService';
import {
  ISSUE_CATEGORIES,
  ISSUE_STATUSES,
  ADMIN_MODERATION_FILTERS,
  ALL_CATEGORY,
  ALL_STATUS,
  MODERATION_LABEL_TO_API,
} from '../../models/issueModel';

// The admin board is a single screen, so ask for the largest page the API allows.
const ADMIN_PAGE_SIZE = 100;
// Typing in the search box shouldn't fire a request per keystroke.
const SEARCH_DEBOUNCE_MS = 350;
const TOAST_MS = 4500;

const EMPTY_STATS = {
  openCount: 0,
  inProgressCount: 0,
  resolvedCount: 0,
  totalUpvotes: 0,
  total: 0,
  pendingCount: 0,
};

export const useAdminController = () => {
  const [issues, setIssues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Filters — `searchQuery` drives the input, `appliedSearch` the request
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(ALL_STATUS);
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORY);
  // Review queue filter: All | Pending | Approved | Rejected
  const [moderationFilter, setModerationFilter] = useState('All');

  const [stats, setStats] = useState(EMPTY_STATS);

  // Row currently being written to (status change) — used to lock its select
  const [savingIssueId, setSavingIssueId] = useState(null);

  // Feedback banner: { type: 'success' | 'error', message }
  const [toast, setToast] = useState(null);

  // Resolve flow — choosing "Resolved" asks for a note before saving
  const [issueToResolve, setIssueToResolve] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // Review flow — approving or rejecting a report asks for an optional note
  // the reporter will see
  const [reviewTarget, setReviewTarget] = useState(null); // { issue, decision }
  const [reviewNote, setReviewNote] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  // Which row is mid-review, so only that row's buttons lock.
  const [reviewingIssueId, setReviewingIssueId] = useState(null);

  // Delete modal state
  const [issueToDelete, setIssueToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Authenticated Admin User — read once from localStorage, no effect needed
  const [currentUser] = useState(() => {
    const user = getCurrentUser();
    if (user && user.name) {
      const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      return {
        name: user.name,
        roleTitle: user.role === 'admin' ? 'Campus administrator' : 'Staff',
        avatar: initials || 'AR',
      };
    }
    return { name: 'Arjun Rao', roleTitle: 'Campus administrator', avatar: 'AR' };
  });

  // Debounce the search box before it reaches the API
  useEffect(() => {
    const timer = setTimeout(() => setAppliedSearch(searchQuery), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const showToast = useCallback((type, message) => setToast({ type, message }), []);

  // Auto-dismiss the feedback banner
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadIssues = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await fetchIssues(
        { search: appliedSearch, status: statusFilter, category: categoryFilter },
        { sort: 'newest', limit: ADMIN_PAGE_SIZE, moderation: moderationFilter }
      );
      setIssues(res.issues || []);
      setTotalCount(res.total ?? res.issues?.length ?? 0);
    } catch (err) {
      setIssues([]);
      setTotalCount(0);
      setLoadError(apiErrorMessage(err, 'Could not load the campus reports.'));
    } finally {
      setIsLoading(false);
    }
  }, [appliedSearch, statusFilter, categoryFilter, moderationFilter]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetchStats();
      if (res) setStats({ ...EMPTY_STATS, ...res });
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  }, []);

  useEffect(() => {
    (async () => loadIssues())();
  }, [loadIssues]);

  useEffect(() => {
    (async () => loadStats())();
  }, [loadStats]);

  // ── Filters ──
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    setStatusFilter(status);
  }, []);

  const handleCategoryFilterChange = useCallback((e) => {
    setCategoryFilter(e.target.value);
  }, []);

  const handleModerationFilterChange = useCallback((value) => {
    setModerationFilter(value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setAppliedSearch('');
    setStatusFilter(ALL_STATUS);
    setCategoryFilter(ALL_CATEGORY);
    setModerationFilter('All');
  }, []);

  // ── Admin review gate (PATCH /issues/:id/moderation) ──
  // Approving publishes a report to the campus board; rejecting keeps it off
  // the board and shows the note to the reporter.

  const handleReviewClick = useCallback((issue, decision) => {
    setReviewTarget({ issue, decision });
    setReviewNote('');
  }, []);

  const handleCloseReviewModal = useCallback(() => {
    setReviewTarget(null);
    setReviewNote('');
  }, []);

  const handleReviewNoteChange = useCallback((e) => {
    setReviewNote(e.target.value);
  }, []);

  const handleConfirmReview = useCallback(async () => {
    if (!reviewTarget) return;
    const { issue, decision } = reviewTarget;
    const note = reviewNote.trim();

    setReviewTarget(null);
    setReviewNote('');
    setIsReviewing(true);
    setReviewingIssueId(issue.id);
    try {
      const { message, issue: updated } = await reviewIssue(issue.id, decision, note);

      // A reviewed report leaves the queue when it no longer matches the
      // active review filter, so the row and the count follow the same rule.
      const wanted = MODERATION_LABEL_TO_API[moderationFilter];
      const leavesFilter =
        moderationFilter !== 'All' && updated.moderation.state !== wanted;

      setIssues((prev) =>
        leavesFilter
          ? prev.filter((i) => i.id !== updated.id)
          : prev.map((i) => (i.id === updated.id ? updated : i))
      );
      setTotalCount((prev) => (leavesFilter ? Math.max(prev - 1, 0) : prev));

      showToast('success', message || (decision === 'approve' ? 'Report approved.' : 'Report rejected.'));
      loadStats();
    } catch (err) {
      showToast('error', apiErrorMessage(err, 'Could not save that review decision.'));
      // The decision did not land: put the row back so it stays reviewable.
      loadIssues();
    } finally {
      setIsReviewing(false);
      setReviewingIssueId(null);
    }
  }, [reviewTarget, reviewNote, moderationFilter, loadIssues, loadStats, showToast]);

  // ── Status changes (PATCH /issues/:id/status, admin only) ──

  /**
   * Optimistic write with rollback: the row updates instantly, then the server's
   * copy replaces it. A failed write restores the previous value and explains why.
   */
  const persistStatus = useCallback(
    async (issueId, nextStatus, note) => {
      const previous = issues.find((i) => i.id === issueId);
      if (!previous) return;

      setSavingIssueId(issueId);
      setIssues((prev) =>
        prev.map((i) =>
          i.id === issueId
            ? {
                ...i,
                status: nextStatus,
                ...(note !== undefined ? { resolutionNote: note } : {}),
              }
            : i
        )
      );

      try {
        const { issue } = await updateIssueStatus(issueId, nextStatus, note);
        setIssues((prev) => prev.map((i) => (i.id === issueId ? issue : i)));
        showToast('success', `“${previous.title}” is now ${nextStatus.toLowerCase()}.`);
        loadStats();
      } catch (err) {
        setIssues((prev) => prev.map((i) => (i.id === issueId ? previous : i)));
        showToast('error', apiErrorMessage(err, 'Could not update that report.'));
      } finally {
        setSavingIssueId(null);
      }
    },
    [issues, loadStats, showToast]
  );

  /**
   * Status dropdown handler. "Resolved" first asks what was done, so students
   * see a real note on the report; the other two states save straight away.
   */
  const handleStatusChange = useCallback(
    (issueId, nextStatus) => {
      const issue = issues.find((i) => i.id === issueId);
      if (!issue || issue.status === nextStatus) return;

      if (nextStatus === 'Resolved') {
        setIssueToResolve(issue);
        setResolutionNote(issue.resolutionNote || '');
        return;
      }
      persistStatus(issueId, nextStatus);
    },
    [issues, persistStatus]
  );

  const handleCloseResolveModal = useCallback(() => {
    setIssueToResolve(null);
    setResolutionNote('');
  }, []);

  const handleResolutionNoteChange = useCallback((e) => {
    setResolutionNote(e.target.value);
  }, []);

  const handleConfirmResolve = useCallback(async () => {
    if (!issueToResolve) return;
    const target = issueToResolve;
    const note = resolutionNote.trim();
    setIssueToResolve(null);
    setResolutionNote('');
    await persistStatus(target.id, 'Resolved', note);
  }, [issueToResolve, resolutionNote, persistStatus]);

  // ── Deletion (DELETE /issues/:id, owner or admin) ──
  const handleOpenDeleteModal = useCallback((issue) => {
    setIssueToDelete(issue);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIssueToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!issueToDelete) return;
    const target = issueToDelete;

    setIsDeleting(true);
    try {
      await deleteIssue(target.id);
      setIssues((prev) => prev.filter((i) => i.id !== target.id));
      setTotalCount((prev) => Math.max(prev - 1, 0));
      setIssueToDelete(null);
      showToast('success', `“${target.title}” was removed.`);
      loadStats();
    } catch (err) {
      setIssueToDelete(null);
      showToast('error', apiErrorMessage(err, 'Could not remove that report.'));
    } finally {
      setIsDeleting(false);
    }
  }, [issueToDelete, loadStats, showToast]);

  const dismissToast = useCallback(() => setToast(null), []);

  return {
    issues,
    totalCount,
    isLoading,
    loadError,
    searchQuery,
    statusFilter,
    categoryFilter,
    moderationFilter,
    categories: ISSUE_CATEGORIES,
    statuses: ISSUE_STATUSES,
    moderationFilters: ADMIN_MODERATION_FILTERS,
    stats,
    currentUser,
    savingIssueId,
    reviewingIssueId,
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
    loadIssues,
  };
};
