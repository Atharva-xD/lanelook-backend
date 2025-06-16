import React from 'react';
import './UsersTable.css';

const UsersTable = () => {
  const users = [
    { id: 'USR123', name: 'John Doe', email: 'john@example.com', role: 'Customer' },
    { id: 'USR124', name: 'Jane Smith', email: 'jane@example.com', role: 'Customer' },
    // Add more users
  ];

  return (
    <div className="users-table container">
      <h3>Users List</h3>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
