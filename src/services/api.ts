import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.35:8080",
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response);
    return Promise.reject(error);
  }
);

export default api;
