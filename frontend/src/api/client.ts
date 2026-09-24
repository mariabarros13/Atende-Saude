import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor: Injeta o Token Bearer no cabeçalho de cada requisição se ele existir no localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@AtendeSaude:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
