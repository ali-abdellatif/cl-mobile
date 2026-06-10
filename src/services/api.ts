// NOTE: Scaffolded by setup. Replace baseURL with your real API and wire up
// interceptors as needed.
import axios from 'axios';
import { Storage } from '../utils/storage';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async config => {
  const token = await Storage.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
