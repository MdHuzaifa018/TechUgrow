import axios from 'axios';

// Dynamically use VITE_API_URL if defined, otherwise fallback to live Render production backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://techugrow-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
