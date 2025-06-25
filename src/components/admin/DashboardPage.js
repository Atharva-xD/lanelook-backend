import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import StatsCard from './SidebarComponents/StatsCard';
import OrdersTable from './SidebarComponents/OrdersTable';
import UsersTable from './SidebarComponents/UsersTable';
import ProductsChart from './SidebarComponents/ProductsChart';
import SidebarAdmin from './Sidebar';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSales: 0,
    activeOrders: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month');

  // Use useCallback so the function reference is stable
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all required data in parallel
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get('http://localhost:5000/api/products', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      const users = usersRes.data;
      const orders = ordersRes.data;
      const products = productsRes.data;

      // Calculate total sales
      const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

      // Calculate active orders (pending and processing)
      const activeOrders = orders.filter(order => 
        ['pending', 'processing'].includes(order.orderStatus)
      ).length;

      // Calculate trends (comparing with previous period)
      const currentPeriod = getDateRange(dateRange);
      const previousPeriod = getPreviousPeriod(dateRange);

      const currentPeriodSales = orders
        .filter(order => new Date(order.createdAt) >= currentPeriod.start)
        .reduce((sum, order) => sum + order.totalPrice, 0);

      const previousPeriodSales = orders
        .filter(order => 
          new Date(order.createdAt) >= previousPeriod.start && 
          new Date(order.createdAt) < currentPeriod.start
        )
        .reduce((sum, order) => sum + order.totalPrice, 0);

      const salesTrend = previousPeriodSales ? 
        ((currentPeriodSales - previousPeriodSales) / previousPeriodSales) * 100 : 0;

      const usersTrend = calculateTrend(
        users.filter(u => new Date(u.createdAt) >= currentPeriod.start).length,
        users.filter(u => 
          new Date(u.createdAt) >= previousPeriod.start && 
          new Date(u.createdAt) < currentPeriod.start
        ).length
      );

      const ordersTrend = calculateTrend(
        activeOrders,
        orders.filter(o => 
          new Date(o.createdAt) >= previousPeriod.start && 
          new Date(o.createdAt) < currentPeriod.start &&
          ['pending', 'processing'].includes(o.orderStatus)
        ).length
      );

      const productsTrend = calculateTrend(
        products.filter(p => new Date(p.createdAt) >= currentPeriod.start).length,
        products.filter(p => 
          new Date(p.createdAt) >= previousPeriod.start && 
          new Date(p.createdAt) < currentPeriod.start
        ).length
      );

      setStats({
        totalUsers: users.length,
        totalSales: totalSales.toFixed(2),
        activeOrders,
        totalProducts: products.length,
        trends: {
          users: usersTrend,
          sales: salesTrend,
          orders: ordersTrend,
          products: productsTrend
        }
      });
    } catch (err) {
      setError('Error fetching dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getDateRange = (range) => {
    const now = new Date();
    const start = new Date();

    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setMonth(now.getMonth() - 1);
    }

    return { start, end: now };
  };

  const getPreviousPeriod = (range) => {
    const current = getDateRange(range);
    const duration = current.end - current.start;
    return {
      start: new Date(current.start - duration),
      end: current.start
    };
  };

  const calculateTrend = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <SidebarAdmin />
        <div className="main-content">
          <div className="loading">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <SidebarAdmin />
        <div className="main-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <SidebarAdmin />
      <div className="main-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Dashboard Overview</h1>
            <div className="date-filter">
              <select 
                className="date-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
          <div className="dashboard-overview">
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon="user"
              trend={`${stats.trends.users.toFixed(1)}%`}
              trendUp={stats.trends.users >= 0}
            />
            <StatsCard
              title="Total Sales"
              value={`₹${stats.totalSales}`}
              icon="rupees"
              trend={`${stats.trends.sales.toFixed(1)}%`}
              trendUp={stats.trends.sales >= 0}
            />
            <StatsCard
              title="Active Orders"
              value={stats.activeOrders}
              icon="cart"
              trend={`${stats.trends.orders.toFixed(1)}%`}
              trendUp={stats.trends.orders >= 0}
            />
            <StatsCard
              title="Total Products"
              value={stats.totalProducts}
              icon="box"
              trend={`${stats.trends.products.toFixed(1)}%`}
              trendUp={stats.trends.products >= 0}
            />
          </div>
          <div className="dashboard-grid">
            <div className="chart-card">
              <h2>Sales Overview</h2>
              <ProductsChart dateRange={dateRange} />
            </div>
            <div className="tables-section">
              <div className="table-card">
                <h2>Recent Orders</h2>
                <OrdersTable limit={5} refreshDashboard={fetchDashboardData} />
              </div>
              <div className="table-card">
                <h2>Recent Users</h2>
                <UsersTable limit={5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
