import axios from 'axios';

const API_BASE = 'https://localhost:7049/api';

export const getEmployees = () => axios.get(`${API_BASE}/employee`);
export const getEmployee = (id) => axios.get(`${API_BASE}/employee/${id}`);
export const createEmployee = (data) => axios.post(`${API_BASE}/employee`, data);
export const updateEmployee = (id, data) => axios.put(`${API_BASE}/employee/${id}`, data);
export const deleteEmployee = (id) => axios.delete(`${API_BASE}/employee/${id}`);
export const deleteMultipleEmployees = (ids) => axios.post(`${API_BASE}/employee/delete-multiple`, ids);
export const getStates = () => axios.get(`${API_BASE}/state`);  