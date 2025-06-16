// AdminLayout.js
import React from "react";
import SidebarAdmin from "./Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <SidebarAdmin />

      <div className="main-content">{children}</div>
    </div>
  );
};

export default AdminLayout;
