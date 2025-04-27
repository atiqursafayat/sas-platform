import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

export const createStudent = (data) => API.post('/students', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const getStudents = () => API.get('/students', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const getStudent = (id) => API.get(`/students/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const createApplication = (data) => API.post('/applications', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const getApplications = () => API.get('/applications', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const reviewApplication = (data) => API.post('/applications/review', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const getSponsors = () => API.get('/sponsors', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const createSponsor = (data) => API.post('/sponsors', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const sponsorStudent = (data) => API.post('/sponsors/sponsor', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const getPayments = () => API.get('/payments', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const createPayment = (data) => API.post('/payments', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const approvePayment = (data) => API.post('/payments/approve', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const getMessages = (userId) => API.get(`/messages/${userId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const sendMessage = (data) => API.post('/messages', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getUsers = () => API.get('/auth/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const deleteUser = (id) => API.delete(`/auth/users/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const getReport = (type, format) => API.get(`/reports/${type}?format=${format}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, responseType: 'blob' });
export const matchStudents = (data) => API.post('/match', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });