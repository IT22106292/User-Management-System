import React from 'react';
import { FiUser } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <FiUser className="navbar-icon" />
          <span>User Management</span>
        </div>
        <div className="navbar-links">
          <a href="/">Home</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;