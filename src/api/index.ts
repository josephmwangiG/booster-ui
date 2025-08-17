import axios from "axios";


  const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Initialize Sanctum CSRF cookie
export const initializeSanctum = async () => {
  try {
    // Create a separate axios instance for Sanctum (not going through /api proxy)
    const sanctumApi = axios.create({
      baseURL: 'http://localhost:8000',
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    await sanctumApi.get("/sanctum/csrf-cookie");
  } catch (error) {
    console.error("Failed to initialize Sanctum:", error);
  }
};

export default api;