// Controller: Business logic that bridges model validation and service calls
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLoginFormState, validateLoginForm, USER_ROLES } from '../models/authModel';
import { loginUser } from '../services/authService';

/**
 * useAuthController - Custom hook acting as the Controller for auth flows
 * Manages form state, validation, and delegates API calls to the service layer
 */
export const useAuthController = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(createLoginFormState());
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

  const handleFillDemo = useCallback(() => {
    setFormData({
      email: 'student@campus.edu',
      password: 'student123',
      role: USER_ROLES.STUDENT,
    });
    setErrors({});
    setApiError('');
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setApiError('');

      const { isValid, errors: validationErrors } = validateLoginForm(formData);
      if (!isValid) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);
      try {
        const { user } = await loginUser(formData);
        // Redirect based on role
        if (user.role === USER_ROLES.ADMIN) {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || 'Login failed. Please check your credentials.';
        setApiError(message);
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
    handleFillDemo,
    handleSubmit,
    USER_ROLES,
  };
};
