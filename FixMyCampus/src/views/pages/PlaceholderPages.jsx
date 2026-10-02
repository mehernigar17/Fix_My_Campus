// Placeholder pages for routing
import { Link } from 'react-router-dom';

export function StudentDashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif', gap: '1rem' }}>
      <h1 style={{ fontSize: '2rem', color: '#1a4a3a' }}>Student Dashboard</h1>
      <p style={{ color: '#64748b' }}>Welcome! You are logged in as a student.</p>
      <Link to="/login" style={{ color: '#1a4a3a', fontWeight: 600, textDecoration: 'underline' }}>Sign out</Link>
    </div>
  );
}

export function AdminDashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif', gap: '1rem' }}>
      <h1 style={{ fontSize: '2rem', color: '#1a4a3a' }}>Admin Dashboard</h1>
      <p style={{ color: '#64748b' }}>Welcome! You are logged in as an admin.</p>
      <Link to="/login" style={{ color: '#1a4a3a', fontWeight: 600, textDecoration: 'underline' }}>Sign out</Link>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif', gap: '1rem' }}>
      <h1 style={{ fontSize: '3rem', color: '#1a4a3a' }}>404</h1>
      <p style={{ color: '#64748b' }}>Page not found.</p>
      <Link to="/login" style={{ color: '#1a4a3a', fontWeight: 600, textDecoration: 'underline' }}>Go to Login</Link>
    </div>
  );
}
