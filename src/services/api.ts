import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // 👈 This should match your backend's base URL
  withCredentials: true, // If you're using cookies (optional)
});

// Add JWT token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
