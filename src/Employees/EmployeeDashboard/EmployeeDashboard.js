import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";

function EmployeeDashboard({ loggedInEmployee }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedInEmployee) {
            setIsLoggedIn(true);
        } else {
            alert("Cannot access without LOGIN");
            // If not logged in, redirect to login page
            navigate('/employee-login');
            
        }
    }, [loggedInEmployee, navigate]);

    return (
        <div style={{marginLeft:'-13px'}}>
            {isLoggedIn && (
                <>
                    <EmployeeNavbar loggedInEmployee={loggedInEmployee} />
                    <div className="container-fluid">
                        <div style={{display:'flex'}}>
                                <EmployeeSidebar />
                                <div style={{marginLeft:'2%'}}>
                                    <Outlet />
                                </div>    
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default EmployeeDashboard;
