import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
// import { FaRegEdit } from "react-icons/fa";
// import { RiDeleteBin6Line } from "react-icons/ri";
import { Modal, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './ManageLeaves.css';

function ManageLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [leavesData, setLeavesData] = useState({
        description: '',
        totalLeaves: ''
    });

    // const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchLeave();
    }, [leavesData]);

    const fetchLeave = () => {
        axios.get('http://localhost:8000/manageleaves/')
            .then(response => setLeaves(response.data))
            .catch(error => console.error('Error fetching leaves:', error));
    }

    // const handleEdit = (id) => {
    //     // Implement edit functionality here
    //     setEditId(id);
    //     setShowEditModal(true);
    //     const leavesToEdit = leaves.find(leaves => leaves.id === id)
    //     setLeavesData({
    //         description: leavesToEdit.description,
    //         totalLeaves: leavesToEdit.totalLeaves
    //     });
    // };

    const handleAdd = () => {
        setShowAddModal(true);
        setLeavesData({
            description: '',
            totalLeaves: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeavesData({ ...leavesData, [name]: value });
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/manageleaves/', leavesData)
            .then(response => {
                setShowAddModal(false);
                fetchLeave();
            })
            .catch(error => console.error("Error adding leaves", error));
    };

    // const handleEditSubmit = (e) => {
    //     e.preventDefault();
    //     axios.put(`http://localhost:8000/adminleaves/${editId}`, leavesData)
    //         .then(response => {
    //             setShowEditModal(false);
    //             fetchLeave();
    //         })
    //         .catch(error => console.error("'Error edditing leaves:', error"));
    // };

    return (
        <div>
            <h2>Leaves List</h2>
            <div className="text-start">
                <Button onClick={handleAdd} className="btn btn-success" style={{ marginBottom: '5px' }}>Add Leaves</Button>
            </div>
            <div style={{ height: '300px', overflowY: 'auto' }}>
                <table className='admin' >
                    <thead className='sticky-top '>
                        <tr className="table-dark">
                            <th className="sticky-top" >Sr.No</th>
                            <th className="sticky-top" >description</th>
                            <th className="sticky-top">Total Leaves</th>
                            {/* <th className="sticky-top">Action</th> */}
                        </tr>
                    </thead>

                    <tbody className='admin-tbody'>
                        {leaves.map((leave, index) => (
                            <tr key={leave.id}>
                                <td>{index + 1}</td>
                                <td>{leave.description}</td>
                                <td>{leave.totalLeaves}</td>
                                {/* <td>
                                    <ButtonGroup className="mb-2">
                                        <Button onClick={() => handleEdit(leave.id)} className="btn btn-sm ms-1 btn-primary"><FaRegEdit /></Button>
                                        <Button onClick={() => handleDelete(leave.id)} className="btn btn-sm ms-1 btn-danger"><RiDeleteBin6Line /></Button>
                                    </ButtonGroup>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Add Leave Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton style={{ backgroundColor: 'black', color: 'white' }}>
                    <Modal.Title>Add Leaves</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#202429', color: 'White', padding: '20px' }}>
                    <Form onSubmit={handleAddSubmit}>

                        {/* Add Form for Adding Leaves */}

                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter description" name="description" value={leavesData.description}
                                required onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="totalLeaves">
                            <Form.Label>Total Leaves</Form.Label>
                            <Form.Control type="text" placeholder="Enter total leaves" name="totalLeaves" value={leavesData.totalLeaves}
                                required onChange={handleInputChange} />
                        </Form.Group>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button variant="success" type="submit" style={{ marginTop: '15px' }}>Add</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Modal for Editing Leaves */}

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton style={{ backgroundColor: 'black', color: 'white' }}>
                    <Modal.Title>Edit Leaves</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#202429', color: 'white', padding: '20px' }}>
                    <Form >
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter description" name="description" value={leavesData.description}
                                required onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group controlId="totalLeaves">
                            <Form.Label>Total Leaves</Form.Label>
                            <Form.Control type="text" placeholder="Enter total leaves" name="totalLeaves" value={leavesData.totalLeaves}
                                required onChange={handleInputChange} />
                        </Form.Group>
                        <Button variant="success" type="submit" style={{ marginTop: '15px' }}>Update</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );

    // function handleDelete(id) {
    //     const conf = window.confirm("Do you want to delete");
    //     if (conf) {
    //         axios.delete(`http://localhost:8000/adminleaves/${id}`)
    //             .then(res => {
    //                 alert("Record has deleted successfully");
    //                 fetchLeave();
    //                 // navigate('/Leaves2')sss
    //                 // window.location.reload();
    //             })
    //             .catch(err => console.log(err))
    //     }
    // }
}

export default ManageLeaves;