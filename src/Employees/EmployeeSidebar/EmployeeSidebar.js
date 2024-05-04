import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { BiSolidSpreadsheet } from "react-icons/bi";
import { TiHome } from "react-icons/ti";
import "./EmployeeSidebar.css";
 
function EmployeeSidebar() {
    return (
        <aside>
        <div className="employee-sidebar">
            <span className="fs-4">Employee Dashboard</span>
            <hr/>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="profile" className="nav-link text-white">
                    <FaUserCircle /> My Profile
                    </Link>
                </li>
                <li>
                    <Link to="attendance" className="nav-link text-white">
                    <BiSolidSpreadsheet /> Attendance
                    </Link>
                </li>
                <li>
                    <Link to="leaves" className="nav-link text-white">
                        <TiHome /> Leave
                    </Link>
                </li>
            </ul>
        </div>
    </aside>
  );
}
 
 export default EmployeeSidebar;