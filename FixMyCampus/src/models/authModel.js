// Model: Defines the shape/schema for auth-related data used in the frontend
// In MVC frontend context, models represent data structures and state shapes

export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

/**
 * Default login form state shape
 */
export const createLoginFormState = () => ({
  email: '',
  password: '',
  role: USER_ROLES.STUDENT,
});

/**
 * Validate login form fields
 * @param {Object} formData
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateLoginForm = ({ email, password, role }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Campus email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password || !password.trim()) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!Object.values(USER_ROLES).includes(role)) {
    errors.role = 'Please select a valid role.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
