import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import AdminSidebar from '../AdminSidebar/AdminSidebar';

function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a logged-in user stored in sessionStorage
    const loggedInEmployee = JSON.parse(sessionStorage.getItem('loggedInEmployee'));

    if (loggedInEmployee && loggedInEmployee.role === 'Admin') {
      // If logged in as admin, set isLoggedIn to true
      setIsLoggedIn(true);
    } else {
      // If not logged in or not an admin, show alert and redirect to admin login
      alert('Cannot access without LOGIN');
      navigate('/admin-login'); // Redirect to admin login page
    }
  }, [navigate]);

  return (
    <div style={{ marginLeft: '-13px' }}>
      {isLoggedIn && (
        <>
          <AdminNavbar />
          <div className="container-fluid">
            <div style={{ display: 'flex' }}>
              <AdminSidebar />
              <div style={{ marginLeft: '50px' }}>
                <Outlet />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
