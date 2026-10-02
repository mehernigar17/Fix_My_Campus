// View: Login Page component (renders the UI, delegates logic to the controller)
import { Link } from 'react-router-dom';
import { useAuthController } from '../../controllers/authController';
import '../../styles/login.css';

export default function LoginPage() {
  const {
    formData,
    errors,
    isLoading,
    apiError,
    handleRoleChange,
    handleInputChange,
    handleFillDemo,
    handleSubmit,
    USER_ROLES,
  } = useAuthController();

  return (
    <div className="login-page">
      {/* ── Left Hero Panel ── */}
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
          <p className="form-eyebrow">Welcome Back</p>
          <h2 className="form-title">Sign in to continue</h2>
          <p className="form-subtitle">Choose your portal and enter your details.</p>

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

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* API Error */}
            {apiError && <div className="api-error" role="alert">{apiError}</div>}

            {/* Email Field */}
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
              <div className="form-label-row">
                <label htmlFor="password" className="form-label">Password</label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••••"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
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
              <span>
                {isLoading
                  ? 'Signing in…'
                  : formData.role === USER_ROLES.ADMIN
                  ? 'Sign in as admin'
                  : 'Sign in as student'}
              </span>
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

          {/* Demo Account Banner */}
          <div
            className="demo-banner"
            role="button"
            tabIndex={0}
            onClick={handleFillDemo}
            onKeyDown={(e) => e.key === 'Enter' && handleFillDemo()}
            aria-label="Fill demo credentials"
          >
            <div className="demo-check">
              <svg viewBox="0 0 10 10">
                <polyline points="1.5,5 4,7.5 8.5,2.5" />
              </svg>
            </div>
            <div>
              <span className="demo-title">Demo account ready</span>
              <span className="demo-creds">student@campus.edu · student123</span>
            </div>
          </div>

          {/* Create Account */}
          <p className="create-account-row">
            New to FixMyCampus?
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
