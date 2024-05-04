import React from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ButtonGroup, Modal, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './Holidays.css';

function Holidays() {
    const [holidays, setHolidays] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [holidayData, setHolidayData] = useState({
        holidayName: '',
        date: '',
        holidayType: ''
    });

    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchHoliday();
    }, [holidayData]);

    const fetchHoliday = () => {
        axios.get('http://localhost:8000/holiday/')
            .then(response => setHolidays(response.data))
            .catch(error => console.error('Error fetching holidays:', error));
    }

    const handleEdit = (id) => {
        setEditId(id);
        setShowEditModal(true);
        const holidayToEdit = holidays.find(holidays => holidays.id === id);
        setHolidayData({
            holidayName: holidayToEdit.holidayName,
            date: holidayToEdit.date,
            holidayType: holidayToEdit.holidayType
        });
    };

    const handleAdd = () => {
        setShowAddModal(true);
        setHolidayData({
            holidayName: '',
            date: '',
            holidayType: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHolidayData({ ...holidayData, [name]: value });
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/holiday/', holidayData)
            .then(response => {
                setShowAddModal(false);
                fetchHoliday();
                alert("Holiday added successfully");
            })
            .catch(error => console.error("Error adding holiday", error));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8000/holiday/${editId}`, holidayData)
            .then(response => {
                setShowEditModal(false);
                fetchHoliday();
                alert("Holiday updated successfully");
            })
            .catch(error => console.error("Error editing holiday", error));
    };

    return (
        <div>
            <h2>Holiday List</h2>
            <div className="text-start">
                <Button onClick={handleAdd} className="btn btn-success" style={{ marginBottom: '5px' }}>Add Holiday</Button>
            </div>
            <div style={{ height: '300px', overflowY: 'auto' }}>
                <table responsive className="holiday">
                    <thead>
                        <tr className="table-dark">
                            <th className="sticky-top">Sr.No</th>
                            <th className="sticky-top">Holiday Name</th>
                            <th className="sticky-top">Date</th>
                            <th className="sticky-top">Holiday type</th>
                            <th className="sticky-top">Action</th>
                        </tr>
                    </thead>
                    <tbody >
                        {holidays.map((holiday, index) => (
                            <tr key={holiday.id}>
                                <td>{index + 1}</td>
                                <td>{holiday.holidayName}</td>
                                <td>{holiday.date}</td>
                                <td>{holiday.holidayType}</td>
                                <td>
                                    <ButtonGroup className="mb-2">
                                        <Button onClick={() => handleEdit(holiday.id)} className="btn btn-sm ms-1 btn-primary"><FaRegEdit /></Button>
                                        <Button onClick={() => handleDelete(holiday.id)} className="btn btn-sm ms-1 btn-danger"><RiDeleteBin6Line /></Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Holiday Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton style={{ backgroundColor: 'black', color: 'white' }}>
                    <Modal.Title>Add Holiday</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#202429', color: 'white', padding: '20px' }}>
                    <Form onSubmit={handleAddSubmit}>
                        <Form.Group controlId="holidayName">
                            <Form.Label>Holiday Name</Form.Label>
                            <Form.Control type="text" name="holidayName" placeholder="Enter Holiday Name" value={holidayData.holidayName}
                                required onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="date" value={holidayData.date}
                                required onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="holidayType">
                            <Form.Label>Holiday Type</Form.Label>
                            <Form.Control as="select" name="holidayType" value={holidayData.holidayType}
                                required onChange={handleInputChange}>
                                <option>select holiday</option>
                                <option value="NH">National Holiday(NH)</option>
                                <option value="HL">Holiday Leave(HL)</option>
                            </Form.Control>
                        </Form.Group>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button variant="success" type="submit" style={{ marginTop: '15px' }}>Add</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Holiday Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton style={{ backgroundColor: 'black', color: 'white' }}>
                    <Modal.Title>Edit Holiday</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#202429', color: 'white', padding: '20px' }}>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="holidayName">
                            <Form.Label>Holiday Name</Form.Label>
                            <Form.Control type="text" name="holidayName" value={holidayData.holidayName}
                                required onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="date" value={holidayData.date}
                                required onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="holidayType">
                            <Form.Label>Holiday Type</Form.Label>
                            <Form.Control as="select" name="holidayType" value={holidayData.holidayType}
                                onChange={handleInputChange} required>
                                <option>select holiday</option>
                                <option value="NH">National Holiday</option>
                                <option value="HL">Holiday Leave</option>
                            </Form.Control>
                        </Form.Group>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button variant="success" type="submit" style={{ marginTop: '15px' }}>Update</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )

    function handleDelete(id) {
        const conf = window.confirm("Do you want to delete");
        if (conf) {
            axios.delete(`http://localhost:8000/holiday/${id}`)
                .then(res => {
                    alert("Record has deleted successfully");
                    fetchHoliday();
                })
                .catch(err => console.log(err))
        }
    }
}
export default Holidays;