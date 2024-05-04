// EmployeeLogin.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaCircleUser } from "react-icons/fa6";
import "./EmployeeLogin.css";

function EmployeeLogin({ onLogin }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
        // Fetch employee data from JSON server when component mounts
        fetch("http://localhost:8000/employees")
            .then(response => response.json())
            .then(data => {
                setEmployeeData(data);
            })
            .catch(error => {
                console.error('Error fetching employee data:', error);
            });
    }, []);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = () => {
        // Check if entered username and password match with stored credentials
        const employee = employeeData.find(emp => emp.username === username && emp.password === password);
        if (employee) {
            setError("");
            // Call the onEmployeeLogin function passed from the parent component
            onLogin(employee);
            sessionStorage.setItem('loggedInEmployee', JSON.stringify(employee));

            alert('Login Successful');
            navigate('/employee-dashboard');
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="employee-login-container">
            <div className="employee-login-box">
                <h2 className="text-center mb-4">Employee Login</h2>
                <div className="input-group mb-3">
                    <span className="input-group-text">
                        <FaCircleUser />
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
                <div className="text-center"> {/* Centering the button */}
                    <button onClick={handleLogin} className="btn btn-primary">
                        Login
                    </button>
                </div>
                {error && <p className="text-danger mt-3">{error}</p>}
                <p className="text-center mt-3">New Employee? <span onClick={() => navigate('/employee-registration')} className="register-link">Register here</span></p>
                <p className="text-center mt-3">Admin Login? <span onClick={() => navigate('/admin-login')} className="register-link">Click Here</span></p>
                <p className="text-center mt-3">Forget Password? <span onClick={() => navigate('/forget-password')} className="register-link">Click Here</span></p>
            </div>
        </div>
    );
}

export default EmployeeLogin;
