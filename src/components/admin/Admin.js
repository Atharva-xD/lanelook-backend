import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import DashboardPage from './DashboardPage';
import OrdersTable from './SidebarComponents/OrdersTable';
import UsersTable from './SidebarComponents/UsersTable';
import ProductsChart from './SidebarComponents/ProductsChart';
import ProductsTable from './SidebarComponents/ProductsTable';
import './Admin.css';

function Admin() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/ordertable" element={<OrdersTable />} />
        <Route path="/productstable" element={<ProductsTable />} />
        <Route path="/userstable" element={<UsersTable />} />
        <Route path="/analytics" element={<ProductsChart />} />
      </Routes>
    </AdminLayout>
  );
}

export default Admin;
