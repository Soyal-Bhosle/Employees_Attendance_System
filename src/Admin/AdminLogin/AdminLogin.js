import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLockPasswordLine } from 'react-icons/ri';
import './AdminLogin.css';
import { FaUserShield } from 'react-icons/fa';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    fetch('http://localhost:8000/employees')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch admin data');
        }
        return response.json();
      })
      .then((adminData) => {
        console.log(adminData); // Check if you're getting correct data
        const admin = adminData.find((admin) => admin.username === username && admin.password === password);
        console.log(admin); // Check if you're getting the correct admin
        if (admin && admin.role === 'Admin') {
          sessionStorage.setItem('loggedInEmployee', JSON.stringify(admin));
          alert('Login Successful');
          navigate('/admin-dashboard');
        } else {
          setError('You are not an Admin');
        }
      })
      .catch((error) => {
        console.error('Error fetching admin data:', error.message);
        setError('Failed to login');
      });
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 className="text-center mb-4">Admin Login</h2>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <FaUserShield />
          </span>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="form-control"
            placeholder="Username"
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">
            <RiLockPasswordLine />
          </span>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="form-control"
            placeholder="Password"
          />
        </div>
        <button onClick={handleLogin} className="btn btn-primary btn-block">
          Login
        </button>
        {error && <p className="text-danger mt-3">{error}</p>}
        <p className="text-center mt-3">Employee Login? <span onClick={() => navigate('/employee-login')} className="register-link">Click Here</span></p>
        <p className="text-center mt-3">Forget Password? <span onClick={() => navigate('/forget-password')} className="register-link">Click Here</span></p>
      </div>
    </div>
  );
}

export default AdminLogin;
