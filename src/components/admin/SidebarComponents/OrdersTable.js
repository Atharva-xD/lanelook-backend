import React from 'react';
import './OrdersTable.css';

const OrdersTable = () => {
  const orders = [
    { id: 'ORD123', user: 'John Doe', amount: '$120', status: 'Completed' },
    { id: 'ORD124', user: 'Jane Smith', amount: '$75', status: 'Pending' },
    // Add more orders
  ];

  return (
    <div className="orders-table container">
      <h3>Recent Orders</h3>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user}</td>
              <td>{order.amount}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
