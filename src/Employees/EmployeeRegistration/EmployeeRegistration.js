// EmployeeRegistration.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { RiUserFill, RiLockPasswordFill, RiMailFill, RiPhoneFill } from "react-icons/ri";
import { FaCircleUser } from "react-icons/fa6";
import { MdWork } from "react-icons/md";
import "./EmployeeRegistration.css";

function EmployeeRegistration() {
    const navigate = useNavigate(); 
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [doj, setDoj] = useState("");
    const [gender, setGender] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");
    const [existingUsernames, setExistingUsernames] = useState([]);
    const [lastId, setLastId] = useState(0); // Initialize lastId with 0

    useEffect(() => {
        // Fetch existing usernames and last ID from the server
        fetch("http://localhost:8000/employees")
            .then(response => response.json())
            .then(data => {
                const usernames = data.map(emp => emp.username);
                setExistingUsernames(usernames);
                // Set lastId based on the length of data array
                setLastId(data.length);
            })
            .catch(error => {
                console.error('Error fetching existing usernames and last ID:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (existingUsernames.includes(username)) {
            setError("Username already exists. Please choose a different one.");
            return;
        }
        if (name === "") {
            setError("Name cannot be empty");
            return;
        }
        if (!/^[A-Za-z]{2,}\s[A-Za-z]{2,}$/.test(name)) {
            setError("Name format is incorrect. It should contain two words with only alphabets.");
            return;
        }
        if (email === "") {
            setError("Email cannot be empty");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Invalid email address");
            return;
        }
        if (role === "") {
            setError("Role cannot be empty");
            return;
        }
        if (contact === "") {
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
        if (password === "" || confirmPassword === "") {
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

        // If all validations pass, proceed with registration
        const newEmployee = {
            name,
            username,
            email,
            contact,
            gender,
            role,
            password,
            confirmPassword,
            doj,
            id: (lastId + 1).toString() // Assign the employee ID sequentially starting from 1
        };

        fetch("http://localhost:8000/employees", {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(newEmployee)
        }).then((res) => {
            alert('Registered Successfully.')
            navigate('/employee-login');
        }).catch((err) => {
            alert('Failed:' + err.message)
        });
    };

    return (
        <div className="bg-image">
            <div className='registration-container'>
                <h1>Employee Registration</h1>
                <div className='mb-3'>
                    <label htmlFor='inputName' className='form-label'>
                        <RiUserFill className="icon" /> Full Name
                    </label>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='form-control'
                        id='inputName'
                    />
                    <p style={{color:'grey'}}>eg. Ram Kapoor</p>
                </div>
                <div className='mb-3'>
                    <label htmlFor='inputUserName' className='form-label'>
                        <FaCircleUser className="icon" /> Username
                    </label>
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='form-control'
                        id='inputUserName'
                    />
                    <p style={{color:'grey'}}>eg. Ram123xx</p>
                </div>
                <div className='mb-3'>
                    <label htmlFor='inputEmail' className='form-label'>
                        <RiMailFill className="icon" /> Email
                    </label>
                    <input
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='form-control'
                        id='inputEmail'
                    />
                    <p style={{color:'grey'}}>eg. ram@gmail.com</p>
                </div>
                <div className='mb-3'>
                    <label htmlFor='inputNumber' className='form-label'>
                        <RiPhoneFill className="icon" /> Contact
                    </label>
                    <input
                        type='tel'
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className='form-control'
                        id='inputNumber'
                    />
                    <p style={{color:'grey'}}>eg. 9xxxxxxxx</p>
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Gender</label>
                    <div>
                        <input
                            type="radio"
                            id="male"
                            name="gender"
                            value="Male"
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <label htmlFor="Male">Male</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="female"
                            name="gender"
                            value="Female"
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <label htmlFor="Female">Female</label>
                    </div>
                </div>
                <div className='mb-3'>
                    <label htmlFor='inputRole' className='form-label'>
                        <MdWork className="icon"/>Role
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='form-control'
                        id='inputPassword'
                    />
                    <p style={{color:'grey'}}>eg. Ram123xx</p>
                </div>
                <div className='mb-3'>
                    <label htmlFor='inputConfirmPassword' className='form-label'>
                        <RiLockPasswordFill className="icon" /> Confirm Password
                    </label>
                    <input
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='form-control'
                        id='inputConfirmPassword'
                    />
                    <p style={{color:'grey'}}>eg. Ram123xx</p>
                </div>
                <div className='mb-3'>
                    <label htmlFor='inputDate' className='form-label'>
                        Date of Joining
                    </label>
                    <input
                        type='date'
                        value={doj}
                        onChange={(e) => setDoj(e.target.value)}
                        className='form-control'
                        id='inputDate'
                    />
                </div>
                <div>
                    <button onClick={handleSubmit} className="btnprimary btn btn-primary">Register</button>
                </div>
                {error && <p className="text-danger mt-3">{error}</p>}
                <p>Already Registered? <span onClick={() => navigate('/employee-login')} className="register-link">Click here</span></p>
            </div>
        </div>
    );
}

export default EmployeeRegistration;
