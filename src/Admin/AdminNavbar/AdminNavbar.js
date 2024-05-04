// AdminNavbar.js
import React from 'react';
import { SlLogout } from "react-icons/sl";
import { Link, useNavigate } from 'react-router-dom';
import "./AdminNavbar.css";
import logo from "./logo.png";

function AdminNavbar() {
  const navigate = useNavigate(); 

  // Get logged-in user information from session storage
  const loggedInEmployee = JSON.parse(sessionStorage.getItem('loggedInEmployee'));

  const handleLogout = (event) => {
    const confirmLogout = confirm('Are you sure you want to logout?'); // Ask for confirmation

    if (!confirmLogout) {
      event.preventDefault(); // Prevent default navigation if logout is canceled
    } else {
      // Remove data from session storage upon logout
      sessionStorage.removeItem('loggedInEmployee');
      alert('Logout Successful');
      // Navigate to the admin login page
      navigate('/admin-login');
    }
  };
  
  return (
    <div>
      <nav className="admin-navbar" style={{ backgroundColor: '#202429' }}>
        <div className="navbar-brand">
          <img src={logo} alt="company-logo" width="30" height="24" className="admin-logo-img" /> <label className='admin-company-text'>JSV Tech</label>
        </div>
        <div className="adminwelcome-text">Welcome {loggedInEmployee ? loggedInEmployee.name : ''} {loggedInEmployee && loggedInEmployee.role === 'Admin' ? '(ADMIN)' : ''}</div>
        <Link to="/admin-login" onClick={handleLogout}>
          <SlLogout className="admin-logout" />
        </Link>
      </nav>
    </div>
  );
}

export default AdminNavbar;
