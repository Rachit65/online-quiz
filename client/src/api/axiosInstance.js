import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use((config) => {
  const authData = localStorage.getItem("quiz-platform-auth");

  if (authData) {
    const { token } = JSON.parse(authData);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosInstance;
