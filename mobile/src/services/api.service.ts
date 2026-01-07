import axios from "axios";

// Cambia esta URL a tu IP local o servidor
const API_URL = "http://localhost:3005/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token JWT a todas las solicitudes
api.interceptors.request.use(
  (config) => {
    // El token se agregará dinámicamente desde AsyncStorage en cada request
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
