// Controller: Business logic for the registration form
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_ROLES } from '../models/authModel';
import { registerUser } from '../services/authService';
import { apiErrorMessage } from '../services/apiClient';

/**
 * Validate registration form fields
 */
const validateRegisterForm = ({ name, email, password, role }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Full name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

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

  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * useRegisterController — Custom hook acting as Controller for the register flow
 */
export const useRegisterController = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: USER_ROLES.STUDENT,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleRoleChange = useCallback((role) => {
    setFormData((prev) => ({ ...prev, role }));
    setErrors({});
    setApiError('');
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setApiError('');

      const { isValid, errors: validationErrors } = validateRegisterForm(formData);
      if (!isValid) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);
      try {
        // Creates the account and signs the user in (the API returns a token)
        const { user } = await registerUser(formData);

        // Redirect based on role
        if (user.role === USER_ROLES.ADMIN) {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } catch (err) {
        setApiError(apiErrorMessage(err, 'Registration failed. Please try again.'));
      } finally {
        setIsLoading(false);
      }
    },
    [formData, navigate]
  );

  return {
    formData,
    errors,
    isLoading,
    apiError,
    handleRoleChange,
    handleInputChange,
    handleSubmit,
    USER_ROLES,
  };
};
