import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsersTable.css';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      // Sort users by date and get the 5 most recent
      const sortedUsers = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setUsers(sortedUsers);
    } catch (err) {
      setError('Error fetching users');
      console.error('Users fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="users-table">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>{user.name || 'Anonymous'}</span>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                <span className={`role-badge ${user.role}`}>
                  {user.role || 'user'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
