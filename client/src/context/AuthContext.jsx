import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("quiz-platform-auth");

    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      setUser(parsedAuth.user);
      setToken(parsedAuth.token);
    }

    setLoading(false);
  }, []);

  const saveAuth = (authPayload) => {
    setUser(authPayload.user);
    setToken(authPayload.token);
    localStorage.setItem("quiz-platform-auth", JSON.stringify(authPayload));
  };

  const login = async (formData) => {
    const { data } = await axiosInstance.post("/auth/login", formData);
    saveAuth(data);
    return data;
  };

  const register = async (formData) => {
    const { data } = await axiosInstance.post("/auth/signup", formData);
    saveAuth(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("quiz-platform-auth");
  };

  const refreshProfile = async () => {
    if (!token) {
      return;
    }

    const { data } = await axiosInstance.get("/auth/me");
    saveAuth({ token, user: data });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
