import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("novaUser");
  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data?.message?.toLowerCase().includes("session")) {
      localStorage.removeItem("novaUser");
      if (window.location.pathname.startsWith("/admin")) window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
