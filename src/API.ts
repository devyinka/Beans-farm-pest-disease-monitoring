import axios from "axios";

const sanitizedEnvUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(
  /^['\"]|['\"]$/g,
  "",
);
const BACKEND_URL = sanitizedEnvUrl || "http://localhost:5001";

const BACKENDAPI = axios.create({
  baseURL: BACKEND_URL,
});

// Clean dynamic memory lookups on every single outgoing request pipeline
BACKENDAPI.interceptors.request.use(
  (config) => {
    // Check client storage dynamically right before dispatching the request
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("beanfarm_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        // Fallback: Clear headers if no token exists to prevent parsing ghost headers
        delete config.headers["Authorization"];
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default BACKENDAPI;
