import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UsersTable.css';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to access this page');
      setLoading(false);
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      console.log('Making API request with token:', token.substring(0, 20) + '...');
      
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API Response:', response.data);
      
      // Sort users by date
      const sortedUsers = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUsers(sortedUsers);
      setError(null);
    } catch (err) {
      console.error('Users fetch error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.response?.headers,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      
      if (err.response) {
        if (err.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err.response.status === 403) {
          setError('You do not have permission to view this page');
        } else {
          setError(err.response.data.message || 'Error fetching users');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
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

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        { role: newRole },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update the users list with the new role
      setUsers(users.map(user => 
        user._id === userId ? response.data : user
      ));
      setError(null);
    } catch (err) {
      console.error('Error updating user role:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err.response.status === 403) {
          setError('You do not have permission to update user roles');
        } else {
          setError(err.response.data.message || 'Failed to update user role');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        {error.includes('log in') && (
          <button 
            className="login-btn"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="users-table-container">
      <div className="users-table-header">
        <h2>Users Management</h2>
        <p>Total Users: {users.length}</p>
      </div>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Username</th>
              <th>Joined</th>
              <th>Role</th>
              <th>Actions</th>
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
                <td>{user.username}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <select
                    value={user.role || 'user'}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={`role-select ${user.role}`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button 
                    className="view-details-btn"
                    onClick={() => {/* TODO: Implement view details */}}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
