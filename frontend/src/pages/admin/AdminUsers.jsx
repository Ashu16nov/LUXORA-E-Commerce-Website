import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import { Users, Shield, ShieldCheck, Trash2, Search, UserCheck, UserX } from 'lucide-react';
import './AdminUsers.css';

const AdminUsers = () => {
  const { user, token } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [user, token]);

  const fetchUsers = async () => {
    if (!user || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/users`, config);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
    setLoading(false);
  };

  const handleToggleAdminRole = async (targetUser) => {
    const actionText = targetUser.isAdmin ? 'Revoke Admin' : 'Grant Admin Privilege';
    if (!window.confirm(`${actionText} for ${targetUser.name}?`)) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/auth/users/${targetUser._id}/role`, { isAdmin: !targetUser.isAdmin }, config);
      addToast(`Updated permissions for ${targetUser.name}!`, 'success', 'Role Updated');
      fetchUsers();
    } catch (err) {
      addToast('Failed to update user role', 'error');
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser._id === user._id) {
      addToast("You cannot delete your own logged-in admin account.", 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete user "${targetUser.name}"?`)) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/auth/users/${targetUser._id}`, config);
      addToast(`Deleted user ${targetUser.name}`, 'info');
      fetchUsers();
    } catch (err) {
      addToast('Failed to delete user', 'error');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-users-page">
      <div className="admin-page-header">
        <div>
          <h1>Client & Staff Role Management</h1>
          <p>Manage client profiles, assign Administrator credentials, and remove accounts.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by client name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Profile</th>
                <th>Email Address</th>
                <th>Role & Credentials</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="table-user-item">
                      <div className="user-avatar-small font-gold">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong>{u.name}</strong>
                        {u._id === user._id && <span className="you-badge">(You)</span>}
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    {u.isAdmin ? (
                      <span className="role-pill admin"><ShieldCheck size={14} /> Administrator</span>
                    ) : (
                      <span className="role-pill client">Verified Client</span>
                    )}
                  </td>
                  <td>
                    <span className="status-badge in">Active Account</span>
                  </td>
                  <td>
                    <div className="table-actions-row">
                      <button
                        className={`btn-role-toggle ${u.isAdmin ? 'revoke' : 'grant'}`}
                        onClick={() => handleToggleAdminRole(u)}
                        title={u.isAdmin ? 'Revoke Admin' : 'Grant Admin'}
                      >
                        {u.isAdmin ? <UserX size={15} /> : <UserCheck size={15} />}
                        {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                      </button>

                      {u._id !== user._id && (
                        <button
                          className="btn-table-action delete"
                          onClick={() => handleDeleteUser(u)}
                          title="Delete Account"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
