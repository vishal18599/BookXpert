import React, { useEffect, useState, useRef } from 'react';
import {
    getEmployees,
    deleteEmployee,
    deleteMultipleEmployees,
    updateEmployee,
    createEmployee
} from '../services/api';
import { Button, Table, Form, Modal } from 'react-bootstrap';
import EmployeeFormModal from './EmployeeFormModal';
import $ from 'jquery';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const EmployeeList = ({ states }) => {
    const [employees, setEmployees] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const reportRef = useRef();

    const fetchEmployees = async () => {
        const res = await getEmployees();
        setEmployees(res.data);
        calculateTotalSalary(res.data);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const calculateTotalSalary = (data) => {
        const total = data.reduce((acc, e) => acc + parseFloat(e.salary || 0), 0);
        $('#totalSalary').text(`Total Salary: $${total.toFixed(2)}`);
    };

    const handleEdit = (emp) => {
        setEditing(emp);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await deleteEmployee(id);
            fetchEmployees();
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm('Delete selected records?')) {
            await deleteMultipleEmployees(selectedIds);
            setSelectedIds([]);
            fetchEmployees();
        }
    };

    const handleCheckbox = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectedIds(filtered.map(e => e.id));
        else setSelectedIds([]);
    };

    const handleSearchChange = (e) => setSearch(e.target.value);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Employee List', 14, 16);
        doc.autoTable({
            head: [['Name', 'Designation', 'DOB', 'Age', 'Salary', 'Gender', 'State']],
            body: employees.map(e => [
                e.name, e.designation, e.dateOfBirth, e.age, e.salary, e.gender, e.state?.name
            ])
        });
        doc.save('EmployeeList.pdf');
    };

    const renderChart = () => {
        const ctx = document.getElementById('empChart').getContext('2d');
        const labels = [...new Set(employees.map(e => e.designation))];
        const salaryData = labels.map(l =>
            employees.filter(e => e.designation === l).reduce((acc, e) => acc + e.salary, 0)
        );
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Total Salary by Designation',
                    data: salaryData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }]
            }
        });
    };

    useEffect(() => {
        if (showChart) setTimeout(renderChart, 100);
    }, [showChart]);

    const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    const pageCount = Math.ceil(filtered.length / pageSize);

    return (
        <div>
            <div className="d-flex justify-content-between mb-2">
                <Form.Control
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={handleSearchChange}
                    style={{ maxWidth: 300 }}
                />
                <div className="d-flex gap-2">
                    <Button variant="info" onClick={() => setShowChart(true)}>Show Chart</Button>
                    <Button variant="dark" onClick={() => setShowReport(true)}>View Report</Button>
                    <Button variant="secondary" onClick={generatePDF}>Download PDF</Button>
                    <Button variant="danger" onClick={handleBulkDelete} disabled={!selectedIds.length}>Delete Selected</Button>
                </div>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th><Form.Check type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filtered.length && filtered.length > 0} /></th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>DOB</th>
                        <th>Age</th>
                        <th>Salary</th>
                        <th>State</th>
                        <th>Gender</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginated.map(emp => (
                        <tr key={emp.id}>
                            <td><Form.Check type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => handleCheckbox(emp.id)} /></td>
                            <td onClick={() => handleEdit(emp)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{emp.name}</td>
                            <td>{emp.designation}</td>
                            <td>{emp.dateOfBirth}</td>
                            <td>{emp.age}</td>
                            <td>${emp.salary}</td>
                            <td>{emp.state?.name}</td>
                            <td>{emp.gender}</td>
                            <td><Button size="sm" variant="danger" onClick={() => handleDelete(emp.id)}>Delete</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div id="totalSalary" className="mb-3 fw-bold"></div>

            <div className="d-flex justify-content-between">
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <div>Page {page} of {pageCount}</div>
                <Button disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</Button>
            </div>

            <EmployeeFormModal
                show={showModal}
                handleClose={() => { setShowModal(false); setEditing(null); fetchEmployees(); }}
                onSubmit={(data) => {
                    if (editing) updateEmployee(editing.id, data).then(fetchEmployees);
                    else createEmployee(data).then(fetchEmployees);
                    setShowModal(false);
                }}
                employee={editing}
                states={states}
            />

            {/* Chart Modal */}
            <Modal show={showChart} onHide={() => setShowChart(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Salary Chart by Designation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <canvas id="empChart" height="200"></canvas>
                </Modal.Body>
            </Modal>

            {/* Report Modal */}
            <Modal show={showReport} onHide={() => setShowReport(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Employee Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div ref={reportRef}>
                        <h5 className="text-center">Employee Report</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Designation</th>
                                    <th>DOB</th>
                                    <th>Age</th>
                                    <th>Salary</th>
                                    <th>Gender</th>
                                    <th>State</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(emp => (
                                    <tr key={emp.id}>
                                        <td>{emp.name}</td>
                                        <td>{emp.designation}</td>
                                        <td>{emp.dateOfBirth}</td>
                                        <td>{emp.age}</td>
                                        <td>${emp.salary}</td>
                                        <td>{emp.gender}</td>
                                        <td>{emp.state?.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EmployeeList;
