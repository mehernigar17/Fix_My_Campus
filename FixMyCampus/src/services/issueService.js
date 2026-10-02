// Service: Handles Issue-related API calls and local mock fallback persistence
import axios from 'axios';
import { INITIAL_ISSUES } from '../models/issueModel';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fmc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const STORAGE_KEY = 'fmc_issues_data_v2';

const getStoredIssues = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_ISSUES;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ISSUES));
  return INITIAL_ISSUES;
};

const saveStoredIssues = (issues) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
};

/**
 * Fetch all issues with search and filter parameters
 */
export const fetchIssues = async (params = {}) => {
  try {
    const { data } = await api.get('/issues', { params });
    return data;
  } catch (err) {
    let issues = getStoredIssues();

    if (params.category && params.category !== 'All') {
      issues = issues.filter((i) => i.category.toLowerCase() === params.category.toLowerCase());
    }

    if (params.status && params.status !== 'All') {
      issues = issues.filter((i) => i.status.toLowerCase() === params.status.toLowerCase());
    }

    if (params.location && params.location !== 'All locations') {
      issues = issues.filter((i) => i.location.toLowerCase().includes(params.location.toLowerCase()));
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      issues = issues.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
      );
    }

    return { issues, total: issues.length };
  }
};

/**
 * Toggle upvote on an issue
 */
export const toggleUpvote = async (issueId) => {
  try {
    const { data } = await api.post(`/issues/${issueId}/upvote`);
    return data;
  } catch (err) {
    const issues = getStoredIssues();
    const updated = issues.map((item) => {
      if (item.id === issueId) {
        const isUpvoted = !item.upvotedByUser;
        return {
          ...item,
          upvotedByUser: isUpvoted,
          upvotes: isUpvoted ? item.upvotes + 1 : Math.max(0, item.upvotes - 1),
        };
      }
      return item;
    });
    saveStoredIssues(updated);
    const target = updated.find((i) => i.id === issueId);
    return { success: true, issue: target };
  }
};

/**
 * Create a new issue
 */
export const createIssue = async (issueData) => {
  try {
    const { data } = await api.post('/issues', issueData);
    return data;
  } catch (err) {
    const issues = getStoredIssues();
    const newIssue = {
      id: `iss-${Date.now()}`,
      title: issueData.title,
      description: issueData.description,
      category: issueData.category || 'Other',
      priority: 'HIGH PRIORITY',
      status: 'Open',
      location: issueData.location || 'Campus Main',
      createdBy: {
        name: 'Maya Sharma',
        role: 'Student',
        avatar: 'MS',
      },
      upvotes: 1,
      upvotedByUser: true,
      commentsCount: 0,
      createdAt: 'Just now',
      photo: issueData.photoPreview || issueData.photo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80',
    };
    const updated = [newIssue, ...issues];
    saveStoredIssues(updated);
    return { success: true, issue: newIssue };
  }
};

/**
 * Fetch campus community statistics
 */
export const fetchStats = async () => {
  try {
    const { data } = await api.get('/stats');
    return data;
  } catch (err) {
    return {
      resolvedCount: 142,
      resolvedThisMonth: '+18 this month',
      inProgressCount: 24,
      avgResolutionTime: '3.2 days',
    };
  }
};
