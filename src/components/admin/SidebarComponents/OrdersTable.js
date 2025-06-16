import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersTable.css';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      // Sort orders by date and get the 5 most recent
      const sortedOrders = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setOrders(sortedOrders);
    } catch (err) {
      setError('Error fetching orders');
      console.error('Orders fetch error:', err);
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#f1c40f';
      case 'processing':
        return '#3498db';
      case 'shipped':
        return '#9b59b6';
      case 'delivered':
        return '#2ecc71';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="orders-table">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.slice(-6).toUpperCase()}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                >
                  {order.orderStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
