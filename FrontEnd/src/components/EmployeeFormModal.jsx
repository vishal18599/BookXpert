import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { calculateAge } from '../utils/calculateAge';

const EmployeeFormModal = ({ show, handleClose, onSubmit, employee, states }) => {
    const [formData, setFormData] = useState({
        name: '', designation: '', dateOfJoining: '', salary: '',
        gender: 'Male', stateId: '', dateOfBirth: '', age: 0
    });

    useEffect(() => {
        if (employee) setFormData(employee);
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updated = { ...formData, [name]: value };
        if (name === 'dateOfBirth') updated.age = calculateAge(value);
        setFormData(updated);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.designation || !formData.salary || !formData.stateId) {
            alert('Please fill all required fields');
            return;
        }
        onSubmit(formData);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{employee ? 'Edit' : 'Add'} Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="designation">
                        <Form.Label>Designation</Form.Label>
                        <Form.Control name="designation" value={formData.designation} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="dateOfJoining">
                        <Form.Label>Date of Joining</Form.Label>
                        <Form.Control type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="salary">
                        <Form.Label>Salary</Form.Label>
                        <Form.Control type="number" name="salary" value={formData.salary} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="stateId">
                        <Form.Label>State</Form.Label>
                        <Form.Select name="stateId" value={formData.stateId} onChange={handleChange}>
                            <option value="">Select</option>
                            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="dateOfBirth">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="age">
                        <Form.Label>Age</Form.Label>
                        <Form.Control readOnly value={formData.age} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>{employee ? 'Update' : 'Save'}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EmployeeFormModal;