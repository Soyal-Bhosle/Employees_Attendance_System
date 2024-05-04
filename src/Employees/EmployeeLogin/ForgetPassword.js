import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './ForgetPassword.css';

const ForgetPassword = () => {
  const navigate = useNavigate(); // Hook to access navigation functions

  const [username, setUsername] = useState('');
  const [userFound, setUserFound] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleFindUser = async () => {
    try {
      if (!username) {
        setUsernameError('Username cannot be empty');
        return;
      }

      const response = await axios.get(`http://localhost:8000/employees?username=${username}`);
      if (response.data.length > 0) {
        setUserFound(true);
        setUsernameError('');
      } else {
        setUserFound(false);
        setUsernameError('Username not found');
      }
    } catch (error) {
      console.error('Error finding user:', error);
      setUsernameError('Error finding user');
    }
  };

  const validatePassword = (password) => {
    // Password validation regex (minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async () => {
    // Reset any previous errors
    setUsernameError('');
    setPasswordError('');

    // Validate if any field is empty
    if (!newPassword) {
      setPasswordError('Password fields cannot be empty');
      return;
    }
    if (!confirmPassword) {
      setPasswordError('Confirm Password fields cannot be empty');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/employees?username=${username}`);
      if (response.data.length > 0) {
        const user = response.data[0];

        // Check if new password is the same as the old password
        if (newPassword === user.password) {
          setPasswordError('New password cannot be the same as the old password');
          return;
        }

        // Update both password and confirmPassword in the user object
        const updatedUser = {
          ...user,
          password: newPassword,
          confirmPassword: confirmPassword,
        };

        // Send PUT request to update the user's password in the database
        await axios.put(`http://localhost:8000/employees/${user.id}`, updatedUser);

        // Show alert for successful password change
        alert('Password changed successfully');

        // Navigate to the EmployeeLogin page after successful password change
        navigate('/employee-login');
      } else {
        setUsernameError('User not found');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      // Handle error and display appropriate message to the user
      setPasswordError('Failed to change password. Please try again.');
    }
  };

  const handleCancel = () => {
    // Navigate back to the employee login page
    navigate('/employee-login');
  };

  return (
    <div style={{textAlign:'center', marginTop:'50px'}}>
      <h2>Forgot Password</h2>
      <input
        style={{padding: '10px', marginBottom: '20px', width: '250px', borderRadius: '10px'}}
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <button className="btn btn-success" style={{padding: '10px', marginBottom: '20px', width: '250px', borderRadius: '10px'}} onClick={handleFindUser}>Find</button>

      {usernameError && <p style={{color:'red', marginTop:'5px'}}>{usernameError}</p>}

      {userFound && (
        <div style={{marginTop:'20px'}}>
          <input
            style={{padding: '10px', marginBottom: '20px', width: '250px', borderRadius: '10px'}}
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <br />
          <input
            style={{padding: '10px', marginBottom: '20px', width: '250px', borderRadius: '10px'}}
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <br />
          {passwordError && <p style={{color:'red', marginTop:'5px'}}>{passwordError}</p>}
          <button className="btn btn-primary"style={{padding: '10px', marginBottom: '20px', width: '250px', borderRadius: '10px'}} onClick={handleChangePassword}>Change Password</button><br/>
          <button className="btn btn-danger" style={{margin:'20px', padding: '10px', marginBottom: '20px', width: '250px', borderRadius: '10px'}} onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
