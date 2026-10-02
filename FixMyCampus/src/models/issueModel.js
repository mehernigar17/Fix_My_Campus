// Model: Defines shapes, categories, statuses, and validation for Issues
export const ISSUE_CATEGORIES = [
  'All',
  'Water',
  'Electrical',
  'Cleanliness',
  'Furniture',
  'Internet',
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
  'Block C · Ground Floor',
  'Main Library · 2nd Floor',
  'Science Block · Room 104',
  'Hostel Block B · 3rd Floor',
  'Central Cafeteria',
  'Computer Lab 3 · Block A',
  'Sports Complex',
];

export const INITIAL_ISSUES = [
  {
    id: 'iss-1',
    title: 'Water cooler leaking near Block C',
    description: 'The cooler has been leaking since yesterday and the floor is getting slippery.',
    category: 'Water',
    priority: 'HIGH PRIORITY',
    status: 'Open',
    location: 'Block C · Ground Floor',
    createdBy: {
      name: 'Aarav Mehta',
      role: 'Student',
      avatar: 'AM',
    },
    upvotes: 48,
    upvotedByUser: false,
    commentsCount: 12,
    createdAt: '18 min ago',
    photo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'iss-2',
    title: 'Broken fan in lecture hall B-201',
    description: 'The central ceiling fan is vibrating aggressively and making grinding metallic noise during lectures.',
    category: 'Electrical',
    priority: 'HIGH PRIORITY',
    status: 'In Progress',
    location: 'Academic Block B · Room 201',
    createdBy: {
      name: 'Maya Sharma',
      role: 'Student',
      avatar: 'MS',
    },
    upvotes: 35,
    upvotedByUser: true,
    commentsCount: 8,
    createdAt: '1 hour ago',
    photo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'iss-3',
    title: 'Wi-Fi router dead zone in Science Block lounge',
    description: 'Campus-Student Wi-Fi signals drop constantly in Room 104 and adjacent cubicles during peak afternoon study hours.',
    category: 'Internet',
    priority: 'NORMAL PRIORITY',
    status: 'Open',
    location: 'Science Block · Room 104',
    createdBy: {
      name: 'Devin Patel',
      role: 'Student',
      avatar: 'DP',
    },
    upvotes: 27,
    upvotedByUser: false,
    commentsCount: 5,
    createdAt: '3 hours ago',
    photo: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'iss-4',
    title: 'Damaged wooden benches and loose sockets in Cafeteria',
    description: 'Two booth tables near the east window have broken wooden supports and loose power sockets.',
    category: 'Furniture',
    priority: 'HIGH PRIORITY',
    status: 'In Progress',
    location: 'Central Cafeteria · East Wing',
    createdBy: {
      name: 'Priya Nair',
      role: 'Student',
      avatar: 'PN',
    },
    upvotes: 41,
    upvotedByUser: false,
    commentsCount: 9,
    createdAt: '1 day ago',
    photo: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'iss-5',
    title: 'Washroom dispensers empty and water pressure low',
    description: 'Soap dispensers need refill and tap pressure is insufficient on the 2nd floor library.',
    category: 'Cleanliness',
    priority: 'NORMAL PRIORITY',
    status: 'Resolved',
    location: 'Main Library · 2nd Floor',
    createdBy: {
      name: 'Rohan Gupta',
      role: 'Student',
      avatar: 'RG',
    },
    upvotes: 19,
    upvotedByUser: false,
    commentsCount: 4,
    createdAt: '2 days ago',
    photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'iss-6',
    title: 'AC unit leaking water in Computer Lab 3',
    description: 'The ceiling AC unit above row B is dripping water onto work desks.',
    category: 'Electrical',
    priority: 'HIGH PRIORITY',
    status: 'Open',
    location: 'Computer Lab 3 · Block A',
    createdBy: {
      name: 'Maya Sharma',
      role: 'Student',
      avatar: 'MS',
    },
    upvotes: 52,
    upvotedByUser: false,
    commentsCount: 14,
    createdAt: '2 days ago',
    photo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
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
