import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FloatingLabel, Form, } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditLeaves() {
    const { id } = useParams();
    const [data, setData] = useState({
        name: "",
        role: "",
        from: "",
        to: "",
        username: '',
        status: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/leaves/${id}`)
            .then((res) => {
                console.log(res.data);
                setData({
                    name: res.data.name,
                    username: res.data.username,
                    role: res.data.role,
                    from: res.data.from,
                    to: res.data.to,
                    status: res.data.status,
                    leaveType: res.data.leaveType
                });
            })
            .catch((error) => console.log(error));
    }, [id]);

    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }
    function handleBack() {
        navigate('/admin-dashboard/employee-leaves')
    }
    function handleSubmit(event) {
        event.preventDefault()
        axios.put(`http://localhost:8000/leaves/${id}`, data)
            .then(res => {
                alert("data updated successfully");
                setData({
                    name: res.data.name,
                    username: res.data.username,
                    role: res.data.role,
                    from: res.data.from,
                    to: res.data.to,
                    status: res.data.status
                });
            })
            .catch(error => console.log(error));
        navigate('/admin-dashboard/employee-leaves')
    }

    const { name, from, to, role, status } = data;

    return (
        <div className='d-flex w-100 h-100 justify-content-center align-items-center'>
            <div className='w-50 border bg-light p-5'>
                <div style={{ backgroundColor: '#202429', padding: '20px' }}>
                    <Form onSubmit={handleSubmit}>
                        <h1 style={{ backgroundColor: 'black', color: 'white', padding: '10px' }}>Edit</h1>
                        <FloatingLabel controlId="floatingInput" label="EmpName" className="mb-3">
                            <Form.Control type="text" placeholder="name" name='fullname' value={name}
                                required onChange={handleInputChange} readOnly />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput" label="Role" className="mb-3">
                            <Form.Control type="text" placeholder="role" name='role' value={role}
                                required onChange={handleInputChange} readOnly />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput" label="From" className="mb-3">
                            <Form.Control type="date" name='from' placeholder="from" value={from}
                                required onChange={handleInputChange} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput" label="To" className="mb-3">
                            <Form.Control type="date" placeholder="to" name='to' value={to}
                                required onChange={handleInputChange} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInput" label="Status" className="mb-3">
                            <Form.Control as="select" name="status" value={status}
                                onChange={handleInputChange} required>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </Form.Control>
                        </FloatingLabel>
                        <br />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn btn-success" style={{ padding: '10px 20px' }}>Update</button>
                            <button onClick={handleBack} className="btn btn-danger" style={{ padding: '10px 20px' }}>Back</button>
                        </div>
                    </Form>
                </div>
            </div>

        </div >
    )
}
export default EditLeaves;