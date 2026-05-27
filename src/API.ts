import axios from "axios";

const sanitizedEnvUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(
  /^['\"]|['\"]$/g,
  "",
);
const BACKEND_URL = sanitizedEnvUrl

const BACKENDAPI = axios.create({
  baseURL: BACKEND_URL,
});

// Add a request interceptor to include the token in the Authorization header
BACKENDAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("beanfarm_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default BACKENDAPI;
