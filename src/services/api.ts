import axios from 'axios';

// URL de la API en producción
const API_URL = 'https://backend-node-khgr.onrender.com/api';

// Crear instancia de axios con configuración por defecto
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.accessToken) {
        config.headers['x-access-token'] = userData.accessToken;
      }
    }
    
    // Si es FormData, eliminar Content-Type para que axios lo maneje automáticamente
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el token ha expirado o es inválido
    if (error.response?.status === 401) {
      // Limpiar localStorage y redirigir al login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    


    return Promise.reject(error);
  }
);

export default api;
