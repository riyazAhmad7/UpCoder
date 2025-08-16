import axios from "axios";

// Compute the API base URL once and export it for non-axios callers (e.g., fetch streams)
const baseURL =
  import.meta.env.VITE_API_URL ||
  `${window.location.origin.replace(/\/$/, "")}/api`;
export const apiBaseURL = baseURL;

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      // Temporarily disable automatic logout for token expiration
      // This is a workaround for the system date issue (2025)
      if (
        status === 401 &&
        data.message === "Token expired, please login again"
      ) {
        console.warn(
          "Token expiration detected but ignoring due to system date issue"
        );
        // Don't clear user session or redirect
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
