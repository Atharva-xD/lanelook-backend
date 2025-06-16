import React from 'react';
import StatsCard from './SidebarComponents/StatsCard';
import OrdersTable from './SidebarComponents/OrdersTable';
import UsersTable from './SidebarComponents/UsersTable';
import ProductsChart from './SidebarComponents/ProductsChart';
import SidebarAdmin from './Sidebar';
import './Admin.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="main-content .admin-container">
        <div className="dashboard-overview">
          <StatsCard title="Total Users" value="1,203" icon="user" />
          <StatsCard title="Total Sales" value="$13,205" icon="dollar" />
          <StatsCard title="Active Orders" value="342" icon="cart" />
        </div>
        <div className="chart-section">
          <ProductsChart />
        </div>
        <div className="tables-section">
          <OrdersTable />
          <UsersTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
