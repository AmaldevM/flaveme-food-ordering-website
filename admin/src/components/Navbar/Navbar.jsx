import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';
import profile_image from '../../assets/profile_image.png';

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="navbar-logo-container">
        <img className='logo' src={logo} alt="Flave Me Logo" />
        <span className="logo-badge">Admin Panel</span>
      </div>
      <img className='profile' src={profile_image} alt="Profile" />
    </div>
  );
};

export default Navbar;
