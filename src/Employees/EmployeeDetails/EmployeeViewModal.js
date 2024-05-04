// EmployeeViewModal.js

import React from 'react';
import './EmployeeViewModal.css';

function EmployeeViewModal({ employee, onClose }) {
  console.log("Employee prop in EmployeeViewModal:", employee);

  return (
    <div className="modal-container">
      <div className="modal-content" style={{backgroundColor:'rgb(97, 97, 97)', borderRadius:'20px'}}>
        <span className="close" onClick={onClose}>&times;</span>
        <h1 className='view-heading'>Employee Detail</h1>
        <div className='details'>
        <p><b>Name:</b> {employee.name}</p>
        <p><b>Username:</b> {employee.username}</p>
        <p><b>Email:</b> {employee.email}</p>
        <p><b>Contact:</b> {employee.contact}</p>
        <p><b>Gender:</b> {employee.gender}</p>
        <p><b>Role:</b> {employee.role}</p>
        <p><b>Date of Joining:</b> {employee.doj}</p> 
      </div>
      </div>
    </div>
  );
}

export default EmployeeViewModal;
