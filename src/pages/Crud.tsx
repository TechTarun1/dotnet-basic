import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Container } from "react-bootstrap";
import axios from "axios";

const Crud = () => {

    const [data, setData] = useState<any>([]);
    const [show, setShow] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<any>();

    const [editName, setEditName] = useState<string>('');
    const [editAge, setEditAge] = useState<any>();
    const [editId, setEditId] = useState<number>(0);

    const url = 'https://localhost:7122/api/Employee'

    useEffect(() => {
        getEmployees();
    }, [])

    const getEmployees = () => {
        axios.get(`${url}/GetEmployees`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        }).then((response) => {
            setData(response?.data);
        }).catch((err: any) => {
            console.log(JSON.stringify(err))
        })
    }

    const handleEdit = (item: any) => {
        handleShow(item);
    }

    const handleUpdate = () => {
        axios.put(`${url}/${editId}`, { eName: editName, age: editAge }).then((res) => {
            alert('success');
            getEmployees();
        })
    }

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this employee") == true) {
            axios.delete(`${url}/${id}`).then((res) => {
                alert('successfully deleted.');
                getEmployees();
            })
        }
    }

    const handleShow = (item: any) => {
        setShow(true);
        setEditName(item.eName);
        setEditAge(item.age);
        setEditId(item.id)
    }

    const handleClose = () => {
        setShow(false);
    }

    const addEmployee = () => {
        axios.post(`${url}/AddEmployee`, { eName: name, age: age }).then((res) => {
            alert("success");
            getEmployees();
        })
        setName('');
        setAge('');
    }

    return (
        <div>
            <Container style={{ marginTop: 30 }}>
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Name" value={name} onChange={(e: any) => setName(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Age" value={age} onChange={(e: any) => setAge(e.target.value)} />
                    </Col>
                    <Col>
                        <button className="btn btn-primary" onClick={() => addEmployee()}>Add Employee</button>
                    </Col>
                </Row>
            </Container>
            <br /><br />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item: any, index: number) => {
                        return (
                            <tr key={index} style={{ cursor: "pointer" }}>
                                <td>{index + 1}</td>
                                <td>{item.id}</td>
                                <td>{item.eName}</td>
                                <td>{item.age}</td>
                                <td colSpan={2}>
                                    <button className="btn btn-primary" onClick={() => handleEdit(item)}>Edit</button>&nbsp;&nbsp;
                                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input type="text" className="form-control" placeholder="Enter Name" value={editName} onChange={(e: any) => setEditName(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" className="form-control" placeholder="Enter Age" value={editAge} onChange={(e: any) => setEditAge(e.target.value)} />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleUpdate()}>
                        Edit employee
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Crud;
