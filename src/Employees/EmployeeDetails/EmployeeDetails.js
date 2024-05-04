// EmployeeDetails.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiEyeLine, RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit } from "react-icons/fi";
import EmployeeViewModal from './EmployeeViewModal';
import axios from 'axios';
import "./EmployeeDetails.css";

function EmployeeDetails() {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = confirm('Are you sure you want to delete this employee?'); // Ask for confirmation

        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/employees/${id}`);
                setEmployees(employees.filter(emp => emp.id !== id));
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const openModal = (employee) => {
        setSelectedEmployee(employee);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <h1 className="heading">Employee Details</h1>
            <br />
            <Link to="/add-employee" className="btnn btn btn-primary mb-3">Add Employee</Link>
            <br />
            <div style={{overflow:'hidden', position:'relative', boxShadow:"black 0px 1px 7px -1px"}}>
                <table className="table">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Contact</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>
                <div style={{overflowY:'auto', maxHeight:'200px'}}>
                    <table className="table">
                        <tbody>
                            {employees.map(employee => (
                                <tr key={employee.id}>
                                    <td>{employee.id}</td>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.gender}</td>
                                    <td>{employee.contact}</td>
                                    <td>
                                        <Link to={`/edit-employee/${employee.id}`} className="space1"><FiEdit /></Link>
                                        <RiEyeLine className="space2" onClick={() => openModal(employee)} />
                                        <RiDeleteBin6Line className="space3" onClick={() => handleDelete(employee.id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
                <EmployeeViewModal
                    employee={selectedEmployee}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

export default EmployeeDetails;
