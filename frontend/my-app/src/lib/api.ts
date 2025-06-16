import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // URL de tu backend
  withCredentials: true, // Si usás cookies para auth
  
});

export default api;