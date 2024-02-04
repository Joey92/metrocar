import axios from "axios";
import { BACKEND_SCHEME, BACKEND_DOMAIN } from "../config";

const baseURL = `${BACKEND_SCHEME}://backend.${BACKEND_DOMAIN}`;
const backend = axios.create({
  baseURL,
  timeout: 10000,
});

backend.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("authToken");
    if (!token) {
      return config;
    }

    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  undefined,
  { synchronous: true }
);

export default backend;
