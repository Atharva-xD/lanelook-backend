import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";
import { TbLayoutDashboard } from "react-icons/tb";
import { MdOutlineSettings } from "react-icons/md";
import { LuUsersRound } from "react-icons/lu";
import { IoAnalyticsOutline } from "react-icons/io5";
import "./Sidebar.css"

function SidebarAdmin() {
  return (
    <div>
      <Sidebar className="sidebar">
        <Menu
         className="sidebardiv"
          menuItemStyles={{
            // button: {
            //   [`&.active`]: {
            //     backgroundColor: "#222222", // Active background color
            //     color: "#fff", // Active text color
            //   },

            //   // Default styles for MenuItem buttons
            //   color: "#fff", // Default text color
            //   backgroundColor: "#222", // Default background color

            //   "&:hover": {
            //     backgroundColor: "#fff", // Background color on hover
            //     color: "#222", // Text color on hover
            //   },
            // },
          }}
        >
          <MenuItem className="menuitem" component={<Link to="/admin/" />}>
            <TbLayoutDashboard className="sidebar-icon"/>
          </MenuItem>

          <MenuItem className="menuitem" component={<Link to="/admin/productstable" />}>
            <FaBoxOpen className="sidebar-icon"/>
          </MenuItem>

          <MenuItem className="menuitem" component={<Link to="/admin/userstable" />}>
            <LuUsersRound className="sidebar-icon"/>
          </MenuItem>

          <MenuItem className="menuitem" component={<Link to="/admin/analytics" />}>
            <IoAnalyticsOutline className="sidebar-icon"/>
          </MenuItem>

          <MenuItem className="menuitem" component={<Link to="/admin/setting" />}>
            <MdOutlineSettings className="sidebar-icon"/>
          </MenuItem>
        </Menu>
      </Sidebar>    
    </div>
  );
}

export default SidebarAdmin;