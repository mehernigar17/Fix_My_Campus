// Service: Issue-related API calls against the FixMyCampus backend.
// The API speaks snake_case + ObjectId; the UI expects camelCase display
// labels, so every payload is normalised here and nowhere else.
import { api, resolveAssetUrl } from './apiClient';
import {
  ALL_CATEGORY,
  ALL_LOCATION,
  ALL_STATUS,
  STATUS_LABEL_TO_API,
  API_TO_STATUS_LABEL,
  derivePriority,
  formatRelativeTime,
  initialsFromName,
} from '../models/issueModel';

/**
 * Convert an API issue into the shape the views render.
 */
const toUiIssue = (raw) => {
  if (!raw) return null;

  const reporterName = raw.reportedBy?.name || 'Campus member';
  const upvoteCount = raw.upvoteCount ?? 0;

  return {
    id: raw._id,
    title: raw.title || '',
    description: raw.description || '',
    category: raw.category || 'Other',
    location: raw.location || '',
    photo: resolveAssetUrl(raw.photo?.url),
    status: API_TO_STATUS_LABEL[raw.status] || raw.status || 'Open',
    priority: derivePriority(upvoteCount),
    upvotes: upvoteCount,
    upvotedByUser: !!raw.upvotedByMe,
    commentsCount: raw.comments?.length || 0,
    comments: (raw.comments || []).map((comment) => ({
      id: comment._id,
      text: comment.text,
      createdAt: comment.createdAt,
      time: formatRelativeTime(comment.createdAt),
      author: comment.user?.name || 'Campus member',
      userId: comment.user?._id || comment.user,
      avatar: initialsFromName(comment.user?.name),
    })),
    createdBy: {
      id: raw.reportedBy?._id || raw.reportedBy,
      name: reporterName,
      role: 'Student',
      avatar: initialsFromName(reporterName),
    },
    resolutionNote: raw.resolutionNote || '',
    resolvedAt: raw.resolvedAt,
    createdAt: formatRelativeTime(raw.createdAt),
  };
};

const toUiList = (payload) => ({
  issues: (payload?.issues || []).map(toUiIssue),
  total: payload?.total ?? 0,
  count: payload?.count ?? payload?.issues?.length ?? 0,
  page: payload?.page ?? 1,
  pages: payload?.pages ?? 1,
});

/**
 * Translate the filter bar's UI state into API query params.
 * The "All" sentinels are dropped rather than sent (the API rejects them),
 * and status labels are converted to their snake_case API values.
 */
const buildQueryParams = (filters = {}, extra = {}) => {
  const params = {};

  const search = (filters.search || '').trim();
  if (search) params.search = search;

  if (filters.category && filters.category !== ALL_CATEGORY) {
    params.category = filters.category;
  }

  if (filters.status && filters.status !== ALL_STATUS) {
    params.status = STATUS_LABEL_TO_API[filters.status] || filters.status;
  }

  if (filters.location && filters.location !== ALL_LOCATION) {
    params.location = filters.location;
  }

  return { ...params, ...extra };
};

/**
 * Fetch campus issues with search + filters (GET /issues).
 * @param {Object} filters  UI filter state
 * @param {Object} options  { mine: boolean, sort: 'newest'|'oldest'|'upvotes', limit, page }
 */
export const fetchIssues = async (filters = {}, options = {}) => {
  const { mine = false, sort = 'newest', limit = 50, page = 1 } = options;
  const extra = { sort, limit: String(limit), page: String(page) };
  if (mine) extra.mine = 'true';

  const { data } = await api.get('/issues', { params: buildQueryParams(filters, extra) });
  return toUiList(data);
};

/**
 * Fetch only the signed-in user's issues (GET /my/issues).
 */
export const fetchMyIssues = async (filters = {}, options = {}) => {
  const { limit = 50, page = 1 } = options;
  const { data } = await api.get('/my/issues', {
    params: buildQueryParams(filters, { limit: String(limit), page: String(page) }),
  });
  return toUiList(data);
};

/**
 * Fetch one issue with its discussion (GET /issues/:id).
 */
export const fetchIssue = async (issueId) => {
  const { data } = await api.get(`/issues/${issueId}`);
  return toUiIssue(data.issue);
};

/**
 * Create an issue (POST /issues, multipart/form-data so the optional photo
 * uploads as a real binary part rather than a JSON string).
 */
export const createIssue = async (issueData) => {
  const form = new FormData();
  form.append('title', (issueData.title || '').trim());
  form.append('description', (issueData.description || '').trim());
  form.append('category', issueData.category);
  form.append('location', (issueData.location || '').trim());

  if (issueData.photo instanceof File) {
    form.append('photo', issueData.photo);
  }

  const { data } = await api.post('/issues', form);
  return { message: data.message, issue: toUiIssue(data.issue) };
};

/**
 * Toggle the caller's upvote (POST /issues/:id/upvote).
 * @returns {{ upvoted: boolean, upvoteCount: number }}
 */
export const toggleUpvote = async (issueId) => {
  const { data } = await api.post(`/issues/${issueId}/upvote`);
  return { upvoted: !!data.upvoted, upvoteCount: data.upvoteCount ?? 0 };
};

/**
 * Post a comment on an issue (POST /issues/:id/comments).
 */
export const addComment = async (issueId, text) => {
  const { data } = await api.post(`/issues/${issueId}/comments`, { text: (text || '').trim() });
  const refreshed = toUiIssue(data.issue);
  return {
    message: data.message,
    comment: {
      id: data.comment?._id,
      text: data.comment?.text,
      createdAt: data.comment?.createdAt,
      time: formatRelativeTime(data.comment?.createdAt),
      author: data.comment?.user?.name || 'You',
      userId: data.comment?.user?._id,
      avatar: initialsFromName(data.comment?.user?.name),
    },
    issue: refreshed,
  };
};

/**
 * Delete one of the user's own issues (DELETE /issues/:id).
 */
export const deleteIssue = async (issueId) => {
  const { data } = await api.delete(`/issues/${issueId}`);
  return data;
};

/**
 * Campus stats for the hero panel (GET /stats).
 * Shaped to what StudentHeroStats renders: resolvedCount, resolvedThisMonth,
 * inProgressCount, avgResolutionTime.
 */
export const fetchStats = async () => {
  const { data } = await api.get('/stats');
  const byStatus = data?.byStatus || {};

  const avgDays = data?.avgResolutionDays;
  const avgResolutionTime =
    typeof avgDays === 'number'
      ? `${avgDays.toFixed(1)} ${avgDays === 1 ? 'day' : 'days'}`
      : '—';

  return {
    total: data?.total ?? 0,
    resolvedCount: byStatus.resolved ?? 0,
    inProgressCount: byStatus.in_progress ?? 0,
    openCount: byStatus.open ?? 0,
    resolvedThisMonth: `${data?.resolvedThisMonth ?? 0} this month`,
    avgResolutionTime,
    byStatus,
    byCategory: data?.byCategory || {},
    topUpvoted: (data?.topUpvoted || []).map(toUiIssue),
  };
};

/**
 * Categories + statuses straight from the API (GET /issues/categories).
 * Used as a fallback if the static lists ever drift from the API.
 */
export const fetchCategories = async () => {
  const { data } = await api.get('/issues/categories');
  return { categories: data?.categories || [], statuses: data?.statuses || [] };
};