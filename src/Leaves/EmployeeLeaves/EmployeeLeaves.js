import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from 'axios';
import { Link, useNavigate, } from 'react-router-dom';
import { Table, ButtonGroup, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import "./EmployeeLeaves.css";

const EmployeeLeaves = () => {
    const [empdata, setEmpdata] = useState([]);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        axios.get("http://localhost:8000/leaves")
            .then(res => {
                const resverse_data = res.data.reverse()
                setEmpdata(resverse_data);
                // setRecords(res.data)
            })
    }, [empdata])

    function fetchData(id) {
        axios.get("http://localhost:8000/leaves/" + id)
            .then((result) => {
                console.log(result.data);
                setData(result.data);
                // navigate('/home/Leaves2');
            })
            .catch((error) => console.log(error));
    }

    return (
        <div>
            <h1 className='page-title'>Leaves Details</h1>
            {/* <div className="text-start">
                <Link to="/create" className="btn btn-success" style={{ marginBottom: '5px' }}>Add Leaves</Link>
            </div> */}
            <div style={{ height: '300px', overflowY: 'auto' }}>
                <Table responsive  >
                    <thead className="sticky-top" >
                        <tr className="table-dark sticky-top">
                            {/* <th scope="col">Sr</th> */}
                            <th >Sr no</th>
                            <th >Name</th>
                            <th >Username</th>
                            <th >Role</th>
                            <th >From</th>
                            <th >To</th>
                            <th >Status</th>
                            <th >Action</th>
                            {/* <th scope="col">contact</th>
                        <th scope="col">Email</th> */}
                        </tr>
                    </thead>
                    <tbody  >
                        {empdata &&
                            empdata.map((item, index) => (
                                <tr key={item.index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.username}</td>
                                    <td>{item.role}</td>
                                    <td>{item.from}</td>
                                    <td>{item.to}</td>
                                    <td>{item.status}</td>
                                    {/* <td>{item.action}</td> */}
                                    <td>
                                        {/* <Link to={`/View/${item.id}`} className="btn btn-sm ms-1 btn-primary">View</Link> */}
                                        {/* <Link to={`/Update/${item.id}`} className="btn btn-sm ms-1 btn-success">Update</Link> */}
                                        {/* <button onClick={() => handleDelete(item.id)} className="btn btn-sm ms-1 btn-danger">Delete</button> */}
                                        {/* <Link to={`/View/${item.id}`} className="btn btn-sm ms-1 btn-primary">View</Link> */}
                                        <ButtonGroup className="mb-2">
                                            <Button onClick={() => handleShow(fetchData(item.id))} className="btn btn-sm ms-1 btn-success"><IoEyeOutline /></Button>
                                            <Button onClick={() => navigate(`/Update/${item.id}`)} className="btn btn-sm ms-1 btn-primary"><FaRegEdit /></Button>
                                            <Button onClick={() => handleDelete(item.id)} className="btn btn-sm ms-1 btn-danger"><RiDeleteBin6Line /></Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton style={{ backgroundColor: 'black', color: 'white' }}>
                    <Modal.Title ><h1>Employee Leaves</h1></Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: 'gray', color: 'black' }}>
                    <div className="container-views" >

                        <div className="form-container">
                            <table className="custom-table">
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{data.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Username</th>
                                        <td>{data.username}</td>
                                    </tr>
                                    <tr>
                                        <th>Role</th>
                                        <td>{data.role}</td>
                                    </tr>
                                    <tr>
                                        <th>From</th>
                                        <td>{data.from}</td>
                                    </tr>
                                    <tr>
                                        <th>To</th>
                                        <td>{data.to}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {data && data.length > 0 &&
                                data.map((item) => (
                                    <div className='container p-5'>
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.username}</td>
                                            <td>{item.from}</td>
                                            <td>{item.to}</td>

                                            <td>
                                                <Link to="/LeaveMaster">Back</Link>
                                            </td>
                                        </tr>
                                    </div>

                                ))
                            }
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: 'gray' }}>
                    <Button className="btn btn-primary " onClick={handleClose}>Back</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
    function handleDelete(id) {
        const conf = window.confirm("Do you want to delete");
        if (conf) {
            axios.delete("http://localhost:8000/leaves/" + id)
                .then(res => {
                    alert("Record has deleted successfully");
                    // navigate('/Leaves2')
                    // window.location.reload();
                }).catch(err => console.log(err))
        }
    }
}

export default EmployeeLeaves;