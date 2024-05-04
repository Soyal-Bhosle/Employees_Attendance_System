// EmployeeAddPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiUserFill, RiMailFill, RiPhoneFill, RiLockPasswordFill } from "react-icons/ri";
import { FaCircleUser } from "react-icons/fa6";
import { MdWork } from "react-icons/md";
import axios from 'axios';
import "./EmployeeAddPage.css";

function EmployeeAddPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        contact: '',
        password: '',
        confirmPassword: '',
        gender: '',
        role: '',
        doj: '' // Add doj to form data
    });
    const [error, setError] = useState('');
    const [employeeCounter, setEmployeeCounter] = useState(1); // Initial ID value
    const [existingEmployees, setExistingEmployees] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/employees');
                const data = response.data;
                setExistingEmployees(data);
                const maxId = Math.max(...data.map(emp => parseInt(emp.id)));
                setEmployeeCounter(maxId + 1);
            } catch (error) {
                console.error('Error fetching existing employees:', error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, username, email, contact, gender, role, password, confirmPassword, doj } = formData;

        if (name.trim() === "") {
            setError("Name cannot be empty");
            return;
        }
        if (!/^[A-Za-z]{2,}\s[A-Za-z]{2,}$/.test(name)) {
            setError("Name format is incorrect. It should contain two words with only alphabets.");
            return;
        }
        if (username.trim() === "") {
            setError("Username cannot be empty");
            return;
        }
        if (existingEmployees.some(emp => emp.username === username)) {
            setError("Username already exists. Please choose a different one.");
            return;
        }
        if (email.trim() === "") {
            setError("Email cannot be empty");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Invalid email address");
            return;
        }
        if (contact.trim() === "") {
            setError("Contact cannot be empty");
            return;
        }
        if (!/^\d+$/.test(contact)) {
            setError("Contact must contain only numbers");
            return;
        }
        if (contact.length !== 10) {
            setError("Contact number must be a 10-digit number");
            return;
        }
        if (gender === "") {
            setError("Gender cannot be empty");
            return;
        }
        if (role === "") {
            setError("Role cannot be empty");
            return;
        }
        if (password.trim() === "") {
            setError("Password cannot be empty");
            return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
            setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
            return;
        }
        if (confirmPassword !== password) {
            setError("Passwords do not match");
            return;
        }
        if (doj === "") {
            setError("Date cannot be empty");
            return;
        }
        if (new Date(doj) <= new Date()) {
            setError("Date of Joining must be a future date");
            return;
        }
        
        try {
            const newEmployee = {
                id: employeeCounter.toString(),
                name,
                username,
                email,
                contact,
                gender,
                role,
                password,
                confirmPassword,
                doj
            };

            const response = await axios.post('http://localhost:8000/employees', newEmployee);
            const createdEmployee = response.data;
            console.log('Employee added successfully:', createdEmployee);

            // Show alert for successful addition
            setShowAlert(true);

            // Reset form data
            setFormData({
                name: '',
                username: '',
                email: '',
                contact: '',
                password: '',
                confirmPassword: '',
                gender: '',
                role: '',
                doj: ''
            });

            alert('Employee added successfully!');
            navigate('/admin-dashboard');
        } catch (error) {
            console.error('Error adding employee:', error);
            setError('Failed to add employee. Please try again.');
        }
    };

    const handleCancel = () => {
        navigate('/admin-dashboard');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1 style={{textAlign:'center', marginBottom:'50px'}}>Add Employee</h1>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='inputName'>
                            <RiUserFill className="icon" />Full Name
                        </label>
                        <input
                            type='text'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            className='form-control'
                            id='inputName'
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='inputUserName'>
                            <FaCircleUser className="icon" /> Username
                        </label>
                        <input
                            type='text'
                            name='username'
                            value={formData.username}
                            onChange={handleChange}
                            className='form-control'
                            id='inputUserName'
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='inputEmail'>
                            <RiMailFill className="icon" /> Email
                        </label>
                        <input
                            type='text'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='form-control'
                            id='inputEmail'
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='inputNumber'>
                            <RiPhoneFill className="icon" /> Contact
                        </label>
                        <input
                            type='tel'
                            name='contact'
                            value={formData.contact}
                            onChange={handleChange}
                            className='form-control'
                            id='inputNumber'
                        />
                    </div>
                    <div className='form-group'>
                        <label>Gender</label>
                        <div>
                            <input
                                type="radio"
                                id="male"
                                name="gender"
                                value="Male"
                                onChange={handleChange}
                            />
                            <label htmlFor="Male">Male</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                value="Female"
                                onChange={handleChange}
                            />
                            <label htmlFor="Female">Female</label>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='inputRole'>
                            <MdWork className="icon"/> Role
                        </label>
                        <select
                            name='role'
                            value={formData.role}
                            onChange={handleChange}
                            className='form-control'
                            id='inputRole'
                        >
                            <option value="">Select Your Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Counsellor">Counsellor</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='inputPassword'>
                            <RiLockPasswordFill className="icon" /> Password
                        </label>
                        <input
                            type='password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className='form-control'
                            id='inputPassword'
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='inputConfirmPassword'>
                            <RiLockPasswordFill className="icon" /> Confirm Password
                        </label>
                        <input
                            type='password'
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className='form-control'
                            id='inputConfirmPassword'
                        />
                    </div>
                    <div className="form-group">
                        <label>Date of Joining:</label>
                        <input type="date" value={formData.doj} onChange={(e) => setFormData({...formData, doj: e.target.value})} />
                    </div>
                    <div className='form-group'>
                        <button type='submit' className="btn btn-primary">Save</button>
                        <button type='button' className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                    </div>
                    {error && <p className="text-danger mt-3">{error}</p>}
                </form>
            </div>

            {/* Alert for successful addition */}
            {showAlert && (
                <div className="alert alert-success" role="alert" style={{ marginTop: '20px', textAlign: 'center' }}>
                    Employee added successfully!
                </div>
            )}
        </div>
    );
}

export default EmployeeAddPage;
