import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api.service";
import socketService from "../services/socket.service";
import type { User, AuthResponse } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: "passenger" | "driver") => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar el usuario al iniciar la app
  useEffect(() => {
    loadUser();
  }, []);

  // Agregar token a las solicitudes API
  useEffect(() => {
    if (token) {
      api.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        
        const response = await api.get<User>("/auth/me");
        setUser(response.data);
        
        // Conectar socket
        socketService.connect(savedToken);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      await AsyncStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", { email, password });
      const { token: newToken, user: newUser } = response.data;

      await AsyncStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);

      // Conectar socket
      socketService.connect(newToken);
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al iniciar sesión";
      throw new Error(message);
    }
  };

  const register = async (username: string, email: string, password: string, role: "passenger" | "driver") => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", {
        username,
        email,
        password,
        role,
      });
      const { token: newToken, user: newUser } = response.data;

      await AsyncStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);

      // Conectar socket
      socketService.connect(newToken);
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al registrarse";
      throw new Error(message);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
    socketService.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
