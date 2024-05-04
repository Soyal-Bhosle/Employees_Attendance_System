import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiUserFill, RiMailFill, RiPhoneFill, RiLockPasswordFill } from "react-icons/ri";
import { FaCircleUser } from "react-icons/fa6";
import { MdWork } from "react-icons/md";
import axios from 'axios';
import "./EmployeeEditPage.css";

function EmployeeEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        contact: '',
        password: '',
        confirmPassword: '',
        gender: '',
        role: ''
    });
    const [error, setError] = useState('');
    const [existingEmployees, setExistingEmployees] = useState([]);

    useEffect(() => {
        // Fetch employee data based on id and populate the form
        fetch(`http://localhost:8000/employees/${id}`)
            .then(response => response.json())
            .then(data => {
                setFormData(data);
            })
            .catch(error => console.error('Error fetching employee:', error));

        // Fetch existing employees to check for duplicate usernames
        fetch('http://localhost:8000/employees')
            .then(response => response.json())
            .then(data => {
                setExistingEmployees(data);
            })
            .catch(error => console.error('Error fetching employees:', error));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, username, email, contact, gender, role, password, confirmPassword } = formData;

        // Form validation
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
        if (existingEmployees.some(emp => emp.username === username && emp.id !== id)) {
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

        try {
            // PUT request to update employee data on the server
            await axios.put(`http://localhost:8000/employees/${id}`, formData);
            alert('Employee edited successfully!');
            navigate('/admin-dashboard');
        } catch (error) {
            console.error('Error updating employee:', error);
            setError('Failed to edit employee. Please try again.');
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
            <h1 style={{textAlign:'center', marginBottom:'50px'}}>Edit Employee {id}</h1>
            <form onSubmit={handleSubmit} >
                <div className='mb-3'>
                    <label htmlFor='inputName' className='form-label'>
                        <RiUserFill className="icon" /> Full Name
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
                <div className='mb-3'>
                    <label htmlFor='inputUserName' className='form-label'>
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
                <div className='mb-3'>
                    <label htmlFor='inputEmail' className='form-label'>
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
                <div className='mb-3'>
                    <label htmlFor='inputNumber' className='form-label'>
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
                <div className='mb-3'>
                    <label className='form-label'>Gender</label>
                    <div>
                        <input
                            type="radio"
                            id="male"
                            name="gender"
                            value="Male"
                            onChange={handleChange}
                            checked={formData.gender === 'Male'}
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
                            checked={formData.gender === 'Female'}
                        />
                        <label htmlFor="Female">Female</label>
                    </div>
                </div>
                <div className='mb-3'>
                    <label htmlFor='inputRole' className='form-label'>
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
                <div className='mb-3'>
                    <label htmlFor='inputPassword' className='form-label'>
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
                <div className='mb-3'>
                    <label htmlFor='inputConfirmPassword' className='form-label'>
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
                <div>
                    <button type='submit' className="btn btn-primary">Save Changes</button>
                    <button type='button' className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                </div>
                {error && <p className="text-danger mt-3">{error}</p>}
            </form>
            </div>
        </div>
    );
}

export default EmployeeEditPage;
