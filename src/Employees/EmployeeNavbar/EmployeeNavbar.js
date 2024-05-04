// EmployeeNavbar.js
import React from 'react';
import { SlLogout } from "react-icons/sl";
import { Link, useNavigate } from 'react-router-dom'; 
import "./EmployeeNavbar.css";
import logo from "./logo.png";

function EmployeeNavbar({ loggedInEmployee }) {
    const navigate = useNavigate();

    const handleLogout = (event) => {
        const logoutConfirmed = confirm('Are you sure you want to logout?'); // Ask for confirmation

        if (!logoutConfirmed) {
            event.preventDefault(); // Prevent default link navigation if logout is not confirmed
        } else {
            sessionStorage.removeItem('loggedInEmployee');
            alert('Logout Successful');
            navigate('/employee-login');
        }
    };

    return (
        <div>
            <nav className="emp-navbar" style={{ backgroundColor: '#202429' }}>
                <div className="navbar-brand">
                    <img src={logo} alt="company-logo" width="30" height="24" className="emp-logo-img" /><label className='emp-company-text'>JSV Tech</label>
                </div>
                <div className="text-center flex-grow-1 welcome-text">Welcome {loggedInEmployee ? loggedInEmployee.name : 'Name'}</div>
                <Link to="/employee-login" onClick={handleLogout} className="emp-logout-link">
                    <SlLogout className="emp-logout" />
                </Link>
            </nav>
        </div>
    );
}

export default EmployeeNavbar;
