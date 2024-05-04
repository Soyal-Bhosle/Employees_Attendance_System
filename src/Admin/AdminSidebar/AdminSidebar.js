import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaListAlt } from 'react-icons/fa';
import { FaHouseUser } from "react-icons/fa6";
import { RiHomeGearFill } from "react-icons/ri";
import { BsSuitcaseFill } from "react-icons/bs";
import { IoMdDocument } from "react-icons/io";
import './AdminSidebar.css';

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <span className="fs-4">Admin Dashboard</span>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="employee-details" className="nav-link text-white">
            <FaUsers /> Employees Details
          </Link>
        </li>
        <li>
          <Link to="employee-attendance" className="nav-link text-white">
            <FaListAlt /> Employees Attendance
          </Link>
        </li>
        <li>
          <Link to="attendance-records" className="nav-link text-white">
            <IoMdDocument /> Attendance Record
          </Link>
        </li>
        <li>
          <Link to="employee-leaves" className="nav-link text-white">
            <FaHouseUser /> Employees leaves
          </Link>
        </li>
        <li>
          <Link to="manage-leaves" className="nav-link text-white">
            <RiHomeGearFill /> Manage leaves
          </Link>
        </li>
        <li>
          <Link to="holidays" className="nav-link text-white">
            <BsSuitcaseFill /> Holidays
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;
