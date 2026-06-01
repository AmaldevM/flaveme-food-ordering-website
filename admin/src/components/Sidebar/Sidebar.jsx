import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import add_icon from '../../assets/upload_area.png';
import order_icon from '../../assets/parcel_icon.png';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to="/dashboard" className="sidebar-option">
          <img src={order_icon} alt="Dashboard" className="sidebar-icon" />
          <span className="sidebar-text">Dashboard</span>
        </NavLink>
        <NavLink to="/add" className="sidebar-option">
          <img src={add_icon} alt="Add Item" className="sidebar-icon" />
          <span className="sidebar-text">Add Items</span>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <img src={order_icon} alt="List Items" className="sidebar-icon" />
          <span className="sidebar-text">List Items</span>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <img src={order_icon} alt="Orders" className="sidebar-icon" />
          <span className="sidebar-text">Orders</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
