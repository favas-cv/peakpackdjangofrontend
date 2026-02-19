import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  withCredentials: true,
});

// 🔹 Attach access token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Auto refresh if access token expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If no response, reject
    if (!error.response) {
      return Promise.reject(error);
    }

    // 🔥 If logout request fails, don't try refresh
    if (originalRequest.url.includes("logout")) {
      return Promise.reject(error);
    }

    // 🔥 Don't try refresh if already retried
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // 🔥 Only try refresh if:
    // - status is 401
    // - access token exists
    // - request is not refresh endpoint
    if (
      error.response.status === 401 &&
      localStorage.getItem("access_token") &&
      !originalRequest.url.includes("refresh")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/accounts/refresh/",
          {},
          { withCredentials: true }
        );

        const newAccess = res.data.access;

        localStorage.setItem("access_token", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 🔥 Refresh failed → logout silently
        toast.error("the session is expirired ,please login again")
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
