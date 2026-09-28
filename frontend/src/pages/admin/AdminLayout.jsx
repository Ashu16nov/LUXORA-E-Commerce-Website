import React, { useContext } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Calendar, Users, PackageCheck, ArrowLeft, ShieldCheck, LogOut, Sparkles } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user || !user.isAdmin) {
    return (
      <div className="admin-access-denied container text-center" style={{ padding: '5rem 0' }}>
        <ShieldCheck size={56} color="#e11d48" style={{ marginBottom: '1rem' }} />
        <h2>Access Restricted</h2>
        <p>You must be logged in as an Administrator to access the LUXORA Control Panel.</p>
        <Link to="/login" className="btn btn-primary mt-4">Login with Test Admin</Link>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-badge"><Sparkles size={14} /> LUXORA CONTROL ATELIER</span>
          <h2 className="luxora-title">LUXORA ADMIN</h2>
        </div>

        <nav className="admin-nav-links">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard Overview
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={18} /> Retail Inventory Stock
          </NavLink>
          <NavLink to="/admin/rentals" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Calendar size={18} /> Rental Closet Stock 👑
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <PackageCheck size={18} /> Customer Orders & Refunds
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Users size={18} /> Customers & Staff Roles
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="btn-store-return">
            <ArrowLeft size={16} /> Return to Store Front
          </Link>
          <button className="btn-admin-logout" onClick={() => { logout(); navigate('/login'); }}>
            <LogOut size={16} /> Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-content-area">
        <header className="admin-topbar">
          <div className="topbar-welcome">
            <span>Logged in as <strong>{user.name}</strong> (Administrator)</span>
          </div>
          <div className="topbar-actions">
            <Link to="/" className="topbar-view-site">Store Front</Link>
          </div>
        </header>

        <main className="admin-main-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
