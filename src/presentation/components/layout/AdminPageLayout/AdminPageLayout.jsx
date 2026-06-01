import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import './AdminPageLayout.css';

export default function AdminPageLayout({ title, subtitle, backTo, backLabel = 'Back', children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-page-layout">
      <div className="admin-page-layout__shell">
        {backTo && (
          <Link to={backTo} className="admin-page-layout__back">
            ← {backLabel}
          </Link>
        )}

        <header className="admin-page-layout__header">
          <div>
            <p className="admin-page-layout__eyebrow">Admin dashboard</p>
            <h1 className="admin-page-layout__title">{title}</h1>
            {subtitle ? <p className="admin-page-layout__subtitle">{subtitle}</p> : null}
          </div>

          <div className="admin-page-layout__session">
            <span className="admin-page-layout__user">{user?.email}</span>
            <button type="button" className="admin-page-layout__logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="admin-page-layout__content">{children}</div>
      </div>
    </div>
  );
}
