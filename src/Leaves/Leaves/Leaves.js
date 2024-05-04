import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegEdit } from "react-icons/fa";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { MdCancel } from "react-icons/md";
import { Button, Modal, ButtonGroup, Form } from 'react-bootstrap';
import './Leaves.css';


const Leaves = ({ loggedInUser }) => {
    const [leaves, setLeaves] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        id: '',
        name: '',
        username: '',
        role: '',
        leaveType: '',
        status: 'Pending'    //status 'Pending' by default
    });

    const [editModal, setEditModal] = useState(false);
    const [holidays, setHolidays] = useState([]);
    // const [cancelData, setCancelData] = useState([])
    useEffect(() => {
        fetchData();
        fetchHoliday();
    }, []);

    const fetchHoliday = () => {
        axios.get('http://localhost:8000/holiday')
            .then(response => setHolidays(response.data))
            .catch(error => console.error('Error fetching holidays', error));
    }

    const fetchPersonData = () => {
        axios.get('http://localhost:8000/leaves')
            .then(response => {
                const username = sessionStorage.getItem('loggedInEmployee');
                const userData = JSON.parse(username);
                const single_data = response.data.filter(user => user.username === userData.username);
                const reverse_data = single_data.reverse();
                setLeaves(reverse_data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    };

    useEffect(() => {
        fetchPersonData();
    }, [showModal, editModal]); // Fetch data whenever showModal or editModal changes



    const fetchData = () => {
        axios.get('http://localhost:8000/employees')
            .then(response => {
                const username = sessionStorage.getItem('loggedInEmployee');
                const userData = JSON.parse(username);
                console.log(response.data);
                const single_data = response.data.filter(user => user.username === userData.username);
                console.log('single data', single_data);

                if (single_data.length > 0) {
                    const userData1 = single_data[0];
                    console.log(userData);
                    setFormData({
                        from: '',
                        to: '',
                        leaveType: '',
                        status: 'Pending',
                        name: userData1.name,
                        username: userData1.username,
                        role: userData1.role
                    });
                }

            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    };

    const handleAddLeaves = () => {
        const { from, to } = formData;
        const overLappingHolidays = holidays.filter(holiday => (from <= holiday.date && to >= holiday.date));

        if (overLappingHolidays.length > 0) {
            alert('It is already a National Holiday. Please select different dates.');
            return;
        }

        if (!formData.from && !formData.to) {
            alert('Both From date and To date are required');
            return;
        } else if (!formData.from) {
            alert('From date is required');
            return;
        } else if (!formData.to) {
            alert('To date is required');
            return;
        } else if (!formData.leaveType) {
            alert('Leave Type is required');
            return;
        }

        axios.post('http://localhost:8000/leaves', formData)
            .then(response => {
                setLeaves([...leaves, response.data]);
                setShowModal(false);
                alert('Data added successfully');
            })
            .catch(error => {
                console.log('Error adding leaves', error);
            });
        setFormData('')
    };

    const handleEdit = (id) => {
        const leaveToEdit = leaves.find(leave => leave.id === id);
        setFormData(leaveToEdit);
        setEditModal(true);
        console.log(leaveToEdit);
    };

    const handleEditLeaves = () => {
        axios.put(`http://localhost:8000/leaves/${formData.id}`, formData)
            .then(response => {
                fetchData();
                setEditModal(false);
                alert('Data updated successfully');
            })
            .catch(error => {
                console.log('Error editing leaves', error);
            });
    };


    // const handleCancelLeaves = (id) => {
    //     const conf = window.confirm("Do you want to Cancel the Leave");
    //     if (conf) {
    //         const updatedLeaves = leaves.map(leave => {
    //             if (leave.id === id) {
    //                 return { ...leave, status: 'Cancel' };
    //             }
    //             return leave;
    //         });
    //         const username = sessionStorage.getItem('isLogin');
    //         const userData = JSON.parse(username);
    // axios.put(`http://localhost:8000/person/${id}`, { status: 'Cancel' })
    // {
    //     from: '',
    //     to: '',
    //     leaveType: '',
    //     status: 'Cancel',
    //     fullname: userData.fullname,
    //     username: userData.username,
    //     role: userData.role
    // }
    //             .then(res => {
    //                 // setLeaves(updatedLeaves);
    //                 alert("Leaves have been canceled successfully");
    //                 fetchData();
    //             })
    //             .catch(err => console.log(err));
    //     }
    // };

    // const handleCancelLeaves = (id) => {
    //     const conf = window.confirm("Do you want to Cancel the Leave");
    //     if (conf) {
    //         axios.put(`http://localhost:8000/person/${id}`, { status: 'Cancel' })
    //             .then(res => {
    //                 alert("Leaves have been canceled successfully");
    //                 fetchData(); // Refresh data after cancellation
    //             })
    //             .catch(err => console.log(err));
    //     }
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFromChange = (e) => {
        const { value } = e.target;
        const currentDate = new Date().toISOString().split('T')[0];
        if (value >= currentDate) {
            setFormData({ ...formData, from: value });
        } else {
            alert('Please select a future date');
        }
    };

    const handleToChange = (e) => {
        const { value } = e.target;
        if (value >= formData.from) {
            setFormData({ ...formData, to: value });
        } else {
            alert('To date should not be earlier than From date');
        }
    };


    return (
        <div>
            <h2>Leaves List</h2>
            <div className="text-start">
                <Button onClick={() => setShowModal(true)} className="btn btn-success" style={{ marginBottom: '5px' }}>Add Leaves</Button>
            </div>
            <div className="table-container">
                <table className="table" >
                    <thead>
                        <tr className="table-dark">
                            <th className="sticky-top">Sr No</th>
                            <th className="sticky-top">Fullname</th>
                            <th className="sticky-top">Username</th>
                            <th className="sticky-top">Role</th>
                            <th className="sticky-top">From</th>
                            <th className="sticky-top">To</th>
                            <th className="sticky-top">Leave Type</th>
                            <th className="sticky-top">Status</th>
                            <th className="sticky-top">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            leaves && leaves.length > 0 && leaves.map((item, index) => (
                                <tr key={item.index}>
                                    <td>{index + 1}</td>
                                    {/* <td>{item.id}</td> */}
                                    <td>{item.name}</td>
                                    <td>{item.username}</td>
                                    <td>{item.role}</td>
                                    <td>{item.from}</td>
                                    <td>{item.to}</td>
                                    <td>{item.leaveType}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <ButtonGroup className="mb-2">
                                            {index === 0 && (
                                                <>
                                                    <Button onClick={() => handleEdit(item.id)} className="btn btn-sm ms-1 btn-primary"><FaRegEdit /></Button>
                                                    {/* <Button onClick={() => handleCancelLeaves(item.id)} className="btn btn-sm ms-1 btn-danger"><MdCancel /></Button> */}
                                                    {/* <Button onClick={() => handleDelete(item.id)} className="btn btn-sm ms-1 btn-danger"><RiDeleteBin6Line /></Button> */}
                                                </>
                                            )}
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Add Leave Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton style={{ backgroundColor: 'black', color: 'white' }}>
                    <Modal.Title>Add Leaves</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#202429', color: 'white', padding: '20px' }}>
                    <Form>
                        <Form.Group controlId="from">
                            <Form.Label>From</Form.Label>
                            <Form.Control type="date" name="from" value={formData.from}
                                required onChange={handleFromChange} />
                        </Form.Group>
                        <Form.Group controlId="to">
                            <Form.Label>To</Form.Label>
                            <Form.Control type="date" name="to" value={formData.to}
                                required onChange={handleToChange} />
                        </Form.Group>
                        <Form.Group controlId="leaveType">
                            <Form.Label>Leave Type</Form.Label>
                            <Form.Control as="select" name="leaveType" value={formData.leaveType}
                                onChange={handleChange} >
                                <option value="">Select Leave Type</option>
                                <option value="sick">Sick</option>
                                <option value="vacation">Vacation</option>
                                <option value="maternity">Maternity</option>

                            </Form.Control>
                        </Form.Group>
                        {/* <Form.Group controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control type="text" name="status" value="Pending" disabled></Form.Control>
                        </Form.Group> */}
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#202429' }}>
                    <Button variant="primary" onClick={handleAddLeaves}>Add</Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Leave Modal */}
            <Modal show={editModal} onHide={() => setEditModal(false)}>
                <Modal.Header closeButton style={{ backgroundColor: 'black', color: 'white' }}>
                    <Modal.Title>Edit Leaves</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#202429', color: 'white', padding: '20px' }}>
                    <Form>
                        <Form.Group controlId="from">
                            <Form.Label>From</Form.Label>
                            <Form.Control type="date" name="from" value={formData.from}
                                required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="to">
                            <Form.Label>To</Form.Label>
                            <Form.Control type="date" name="to" value={formData.to}
                                required onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control type="text" name="status" value="Pending" disabled></Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#202429' }}>
                    <Button variant="primary" onClick={handleEditLeaves}>Update</Button>
                    <Button variant="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

    // function handleDelete(id) {
    // const conf = window.confirm("Do you want to delete");
    //     if (conf) {
    //         axios.delete(`http://localhost:8000/person/${id}`)
    //             .then(res => {
    //                 alert("Record has been deleted successfully");
    //                 fetchData();
    //             })
    //             .catch(err => console.log(err))
    //     }
    // }
}

export default Leaves;