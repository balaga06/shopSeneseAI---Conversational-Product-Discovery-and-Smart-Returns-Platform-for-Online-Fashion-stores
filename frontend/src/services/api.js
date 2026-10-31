import axios from "axios";

// ============================================================
// BACKEND URL
// ============================================================

const API_BASE_URL = "http://127.0.0.1:8000/api";

// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ========================================================
    // JSON REQUEST
    // ========================================================

    if (
      config.data &&
      !(config.data instanceof FormData)
    ) {
      config.headers["Content-Type"] = "application/json";
    }

    // ========================================================
    // FORM DATA REQUEST
    // Let browser/Axios create multipart boundary
    // ========================================================

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    if (error.response?.status === 401) {
      console.error(
        "Authentication failed. Token is missing, invalid or expired."
      );
    }

    return Promise.reject(error);
  }
);

export default api;