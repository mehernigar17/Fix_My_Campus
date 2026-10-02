// View: Register Page — matches the design mockup exactly
import { Link } from 'react-router-dom';
import { useRegisterController } from '../../controllers/registerController';
import '../../styles/login.css'; // reuses the shared auth layout CSS

export default function RegisterPage() {
  const {
    formData,
    errors,
    isLoading,
    apiError,
    handleRoleChange,
    handleInputChange,
    handleSubmit,
    USER_ROLES,
  } = useRegisterController();

  return (
    <div className="login-page">
      {/* ── Left Hero Panel (same as Login) ── */}
      <aside className="login-hero">
        {/* Logo */}
        <div className="hero-logo">
          <div className="hero-logo-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>
          FixMyCampus
        </div>

        {/* Headline */}
        <div className="hero-body">
          <p className="hero-eyebrow">A Better Campus, Together</p>
          <h1 className="hero-headline">
            See it.<br />
            Report it.<br />
            <span>Fix it.</span>
          </h1>
          <p className="hero-desc">
            One transparent place for students and campus teams to turn everyday problems into
            visible progress.
          </p>

          {/* Stats */}
          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">142</div>
              <div className="hero-stat-label">Issues Resolved</div>
            </div>
            <div>
              <div className="hero-stat-value">3.2 days</div>
              <div className="hero-stat-label">Average Response</div>
            </div>
            <div>
              <div className="hero-stat-value">89%</div>
              <div className="hero-stat-label">Student Satisfaction</div>
            </div>
          </div>
        </div>

        <p className="hero-footer">
          Built for a safer, cleaner, better-connected campus.
        </p>
      </aside>

      {/* ── Right Form Panel ── */}
      <main className="login-form-panel">
        <div className="login-form-container">
          <p className="form-eyebrow">Join Your Campus</p>
          <h2 className="form-title">Create your account</h2>
          <p className="form-subtitle">Tell us how you'll use FixMyCampus.</p>

          {/* Role Selector */}
          <div className="role-selector" role="group" aria-label="Select role">
            {/* Student Card */}
            <button
              type="button"
              className={`role-card ${formData.role === USER_ROLES.STUDENT ? 'active' : ''}`}
              onClick={() => handleRoleChange(USER_ROLES.STUDENT)}
              aria-pressed={formData.role === USER_ROLES.STUDENT}
            >
              <div className="role-icon">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <div>
                <span className="role-card-label">Student</span>
                <span className="role-card-desc">Report &amp; track issues</span>
              </div>
            </button>

            {/* Admin Card */}
            <button
              type="button"
              className={`role-card ${formData.role === USER_ROLES.ADMIN ? 'active' : ''}`}
              onClick={() => handleRoleChange(USER_ROLES.ADMIN)}
              aria-pressed={formData.role === USER_ROLES.ADMIN}
            >
              <div className="role-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
                </svg>
              </div>
              <div>
                <span className="role-card-label">Admin</span>
                <span className="role-card-desc">Manage campus fixes</span>
              </div>
            </button>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* API Error */}
            {apiError && (
              <div className="api-error" role="alert">
                {apiError}
              </div>
            )}

            {/* Full Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full name</label>
              <input
                id="name"
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Your full name"
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="name"
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <span id="name-error" className="field-error" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Campus Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">Campus email</label>
              <input
                id="email"
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="student@campus.edu"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <span id="email-error" className="field-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••••"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <span id="password-error" className="field-error" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-submit" disabled={isLoading}>
              <span>{isLoading ? 'Creating account…' : 'Create account'}</span>
              <span className="btn-submit-icon" aria-hidden="true">
                {isLoading ? (
                  <span className="spinner" />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6h8M6 2l4 4-4 4"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </button>
          </form>

          {/* Sign In Link */}
          <p className="create-account-row">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
