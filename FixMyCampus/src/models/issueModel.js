// Model: Defines shapes, categories, statuses, and validation for Issues
export const ISSUE_CATEGORIES = [
  'All',
  'Electrical',
  'Water',
  'Internet',
  'Cleanliness',
  'Furniture',
  'Other',
];

export const ISSUE_STATUSES = [
  'All',
  'Open',
  'In Progress',
  'Resolved',
];

export const CAMPUS_LOCATIONS = [
  'All locations',
  'Block C · Main pathway',
  'Academic Block A · Floor 2',
  'Central Library · West Wing',
  'Student Centre · Ground Floor',
  'Hostel Block B · Floor 3',
  'Central Cafeteria · East Wing',
  'Computer Lab 3 · Block A',
  'Sports Complex',
];

export const INITIAL_ISSUES = [
  {
    id: 'iss-1',
    code: 'FMC-101',
    issueIdFormatted: 'ISS-00101',
    title: 'Street lights not working near Block C',
    description: 'Multiple street poles along the main pathway to Block C are non-functional, making the walkway very dark at night.',
    category: 'Electrical',
    priority: 'HIGH PRIORITY',
    status: 'Resolved',
    location: 'Block C · Main pathway',
    createdBy: {
      name: 'Rohan Sharma',
      userId: 'USR-014',
      role: 'Student',
      avatar: 'RS',
    },
    upvotes: 128,
    upvotedByUser: false,
    upvoteVoters: ['RS', 'AK', 'MP'],
    createdAt: 'Yesterday',
    createdAtFormatted: 'Yesterday, 06:30 PM',
    photo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    comments: [
      {
        id: 'cmt-1',
        code: 'CMT-101',
        userId: 'USR-004',
        author: 'Campus Electrician',
        badge: 'Staff',
        avatar: 'CE',
        avatarColor: '#dcfce7',
        textColor: '#166534',
        text: 'Replaced faulty junction fuse and tested all bulbs. Pathway is now lit.',
        time: 'Yesterday',
      },
    ],
  },
  {
    id: 'iss-2',
    code: 'FMC-102',
    issueIdFormatted: 'ISS-00102',
    title: 'Water cooler leaking on second floor',
    description: 'The cooler has been leaking since yesterday and the floor is getting slippery near lecture hall 204.',
    category: 'Water',
    priority: 'HIGH PRIORITY',
    status: 'In Progress',
    location: 'Academic Block A · Floor 2',
    createdBy: {
      name: 'Aarav Mehta',
      userId: 'USR-018',
      role: 'Student',
      avatar: 'AM',
    },
    upvotes: 86,
    upvotedByUser: false,
    upvoteVoters: ['AM', 'SK', 'RJ'],
    createdAt: 'Today, 10:15 AM',
    createdAtFormatted: 'Today, 10:15 AM',
    photo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
    comments: [
      {
        id: 'cmt-2',
        code: 'CMT-102',
        userId: 'USR-002',
        author: 'Plumbing Unit',
        badge: 'Staff',
        avatar: 'PU',
        avatarColor: '#fef3c7',
        textColor: '#92400e',
        text: 'Drain pipe being replaced today.',
        time: '1 hour ago',
      },
    ],
  },
  {
    id: 'iss-3',
    code: 'FMC-103',
    issueIdFormatted: 'ISS-00103',
    title: 'Wi-Fi keeps dropping in the library',
    description: 'Signal in the west wing study area drops every few minutes causing interruptions during research work.',
    category: 'Internet',
    priority: 'HIGH PRIORITY',
    status: 'Open',
    location: 'Central Library · West Wing',
    createdBy: {
      name: 'Riya Patel',
      userId: 'USR-011',
      role: 'Student',
      avatar: 'RP',
    },
    upvotes: 64,
    upvotedByUser: false,
    upvoteVoters: ['RP', 'MS', 'KL'],
    createdAt: 'Today, 09:30 AM',
    createdAtFormatted: 'Today, 09:30 AM',
    photo: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=80',
    comments: [],
  },
  {
    id: 'iss-4',
    code: 'FMC-104',
    issueIdFormatted: 'ISS-00104',
    title: 'Washroom needs urgent cleaning',
    description: 'Ground floor student centre washrooms need cleaning, soap refills, and water check.',
    category: 'Cleanliness',
    priority: 'HIGH PRIORITY',
    status: 'Open',
    location: 'Student Centre · Ground Floor',
    createdBy: {
      name: 'Devin Patel',
      userId: 'USR-025',
      role: 'Student',
      avatar: 'DP',
    },
    upvotes: 52,
    upvotedByUser: false,
    upvoteVoters: ['DP', 'PN', 'VA'],
    createdAt: 'Today, 08:45 AM',
    createdAtFormatted: 'Today, 08:45 AM',
    photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    comments: [],
  },
];

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

  if (!title || !title.trim()) {
    errors.title = 'Issue title is required.';
  } else if (title.trim().length < 4) {
    errors.title = 'Title must be at least 4 characters long.';
  }

  if (!category || category === 'All' || !category.trim()) {
    errors.category = 'Please select a category.';
  }

  if (!location || location === 'All locations' || !location.trim()) {
    errors.location = 'Please specify building, floor or room.';
  }

  if (!description || !description.trim()) {
    errors.description = 'Please provide a description.';
  } else if (description.trim().length < 8) {
    errors.description = 'Description must be at least 8 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
