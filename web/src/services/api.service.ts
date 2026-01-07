import axios from "axios";
import type { AuthResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3005";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (username: string, email: string, password: string, role: "passenger" | "driver") => {
    const response = await api.post<AuthResponse>("/auth/register", {
      username,
      email,
      password,
      role,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export default api;
