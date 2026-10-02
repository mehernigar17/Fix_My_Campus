// Model: Shapes, categories, statuses, and validation for Issues
// Values here mirror the API contract in FixMyCampus_backend:
//   categories: Electrical | Water | Cleanliness | Furniture | Internet | Other
//   statuses:   open | in_progress | resolved
export const API_CATEGORIES = [
  'Water',
  'Electrical',
  'Water',
  'Internet',
  'Cleanliness',
  'Furniture',
  'Other',
];

export const ISSUE_CATEGORIES = ['All', ...API_CATEGORIES];

// The API uses snake_case statuses; the UI shows human labels.
export const STATUS_LABEL_TO_API = {
  Open: 'open',
  'In Progress': 'in_progress',
  Resolved: 'resolved',
};

export const API_TO_STATUS_LABEL = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
};

export const ISSUE_STATUSES = ['All', 'Open', 'In Progress', 'Resolved'];

// Sentinels used by the filter bar; never forwarded to the API.
export const ALL_CATEGORY = 'All';
export const ALL_STATUS = 'All';
export const ALL_LOCATION = 'All locations';

export const CAMPUS_LOCATIONS = [
  ALL_LOCATION,
  'Block C · Ground Floor',
  'Main Library · 2nd Floor',
  'Science Block · Room 104',
  'Hostel Block B · 3rd Floor',
  'Central Cafeteria',
  'Computer Lab 3 · Block A',
  'Sports Complex',
];

// ── Field limits enforced by the backend (kept in sync here so the form can
//    fail fast instead of round-tripping to a 400) ──
export const ISSUE_LIMITS = {
  titleMin: 5,
  titleMax: 120,
  descriptionMin: 10,
  descriptionMax: 2000,
  locationMin: 3,
  locationMax: 160,
  commentMax: 1000,
};

export const createNewIssueState = () => ({
  title: '',
  description: '',
  category: '',
  location: '',
  photo: null,
  photoPreview: null,
});

export const validateIssueForm = ({ title, description, category, location }) => {
  const errors = {};

  const cleanTitle = (title || '').trim();
  if (!cleanTitle) {
    errors.title = 'Issue title is required.';
  } else if (cleanTitle.length < ISSUE_LIMITS.titleMin) {
    errors.title = `Title must be at least ${ISSUE_LIMITS.titleMin} characters long.`;
  } else if (cleanTitle.length > ISSUE_LIMITS.titleMax) {
    errors.title = `Title cannot exceed ${ISSUE_LIMITS.titleMax} characters.`;
  }

  if (!category || category === ALL_CATEGORY || !category.trim()) {
    errors.category = 'Please select a category.';
  }

  const cleanLocation = (location || '').trim();
  if (!cleanLocation) {
    errors.location = 'Please specify building, floor or room.';
  } else if (cleanLocation.length < ISSUE_LIMITS.locationMin) {
    errors.location = `Location must be at least ${ISSUE_LIMITS.locationMin} characters.`;
  } else if (cleanLocation.length > ISSUE_LIMITS.locationMax) {
    errors.location = `Location cannot exceed ${ISSUE_LIMITS.locationMax} characters.`;
  }

  const cleanDescription = (description || '').trim();
  if (!cleanDescription) {
    errors.description = 'Please provide a description.';
  } else if (cleanDescription.length < ISSUE_LIMITS.descriptionMin) {
    errors.description = `Description must be at least ${ISSUE_LIMITS.descriptionMin} characters long.`;
  } else if (cleanDescription.length > ISSUE_LIMITS.descriptionMax) {
    errors.description = `Description cannot exceed ${ISSUE_LIMITS.descriptionMax} characters.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ── Display helpers ──

/**
 * Two-letter avatar initials from a display name.
 */
export const initialsFromName = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
};

/**
 * Human-friendly "18 min ago" from an ISO timestamp.
 */
export const formatRelativeTime = (iso) => {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';

  const minutes = Math.floor((Date.now() - then) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

/**
 * The API stores no priority field, so the badge is derived from community
 * signal: a well-supported issue reads as high priority.
 */
export const HIGH_PRIORITY_UPVOTE_THRESHOLD = 10;

export const derivePriority = (upvoteCount = 0) =>
  (upvoteCount || 0) >= HIGH_PRIORITY_UPVOTE_THRESHOLD
    ? 'HIGH PRIORITY'
    : 'NORMAL PRIORITY';