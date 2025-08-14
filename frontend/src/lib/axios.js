import axios from "axios";

const BASE_URL = 
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/v1"
    : "https://mini-linkedin-backend-r10r.onrender.com/api/v1";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('Request failed:', error.config?.url, error.response?.status);
    return Promise.reject(error);
  }
);