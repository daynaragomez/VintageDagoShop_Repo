import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, login, logout } = useAuth();
  const [form, setForm] = useState({ email: 'admin@vintagedago.com', password: 'admin123' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const nextPath = location.state?.from?.pathname || '/admin/orders';
      navigate(nextPath, { replace: true });
    }
  }, [isAdmin, isAuthenticated, location.state, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { user } = await login(form.email.trim(), form.password);

      if (user.role !== 'admin') {
        logout();
        setError('Admin access is required for this area.');
        return;
      }

      const nextPath = location.state?.from?.pathname || '/admin/orders';
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-page__card">
        <p className="admin-login-page__eyebrow">Vintage Dago Shop</p>
        <h1 className="admin-login-page__title">Admin Sign In</h1>
        <p className="admin-login-page__subtitle">
          Access order management and update the ecommerce workflow from one place.
        </p>

        <form className="admin-login-page__form" onSubmit={handleSubmit}>
          <label className="admin-login-page__field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@vintagedago.com"
              autoComplete="username"
              required
            />
          </label>

          <label className="admin-login-page__field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="admin-login-page__error">{error}</p> : null}

          <button type="submit" className="admin-login-page__submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in to admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
