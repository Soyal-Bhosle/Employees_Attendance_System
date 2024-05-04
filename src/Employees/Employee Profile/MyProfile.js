// MyProfile.js
import React, { useState } from 'react';
import { FaCircleUser } from 'react-icons/fa6';
import './MyProfile.css';

function MyProfile({ loggedInEmployee }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="profile-container">
      <h1 className="profile-heading">My Profile</h1>
      <div className="profile-heading">
        <FaCircleUser />
      </div>

      <div className="profile-info">
        <p>
          <b>ID:</b> {loggedInEmployee.id}
        </p>
        <p>
          <b>Name:</b> {loggedInEmployee.name}
        </p>
        <p>
          <b>Username:</b> {loggedInEmployee.username}
        </p>
        <p>
          <b>Email:</b> {loggedInEmployee.email}
        </p>
        <p>
          <b>Contact:</b> {loggedInEmployee.contact}
        </p>
        <p>
          <b>Gender:</b> {loggedInEmployee.gender}
        </p>
        <p>
          <b>Role:</b> {loggedInEmployee.role}
        </p>
        <p>
          <b>Password:</b>{' '}
          {showPassword ? loggedInEmployee.password : '********'}{' '}
          <button onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </p>
        <p>
          <b>Date of Joining:</b> {loggedInEmployee.doj}
        </p>
      </div>
    </div>
  );
}

export default MyProfile;
