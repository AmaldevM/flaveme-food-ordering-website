import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';
import profile_image from '../../assets/profile_image.png';
import { axiosInstance } from '../../config/axiosInstance';
import { toast } from 'react-toastify';

const Navbar = ({ setToken }) => {
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/admin/logout');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('adminToken');
    setToken('');
  };

  return (
    <div className='navbar'>
      <div className="navbar-logo-container">
        <img className='logo' src={logo} alt="Flave Me Logo" />
        <span className="logo-badge">Admin Panel</span>
      </div>
      <div className="navbar-right-container">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
        <img className='profile' src={profile_image} alt="Profile" />
      </div>
    </div>
  );
};

export default Navbar;
