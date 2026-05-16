import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => config,
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let isSessionExpired = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (isSessionExpired) {
      return Promise.reject(new Error("Session expirée"));
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post("/api/auth/refresh", {}, { withCredentials: true });

        if (refreshResponse.data?.success) {
          processQueue(null);
          return axiosInstance(originalRequest);
        }

        throw new Error("Refresh failed");
      } catch (refreshError) {
        isRefreshing = false;

        if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
          isSessionExpired = true;
          const sessionError = new Error("Session expirée");
          processQueue(sessionError);

          if (typeof window !== "undefined") {
            await axios.post("/api/auth/logout", {}, { withCredentials: true }).catch(() => {
              // Ignore logout errors - session is already expired
            });
            window.location.href = "/auth/login";
          }
          return Promise.reject(sessionError);
        }

        processQueue(refreshError as Error);

        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }

        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/unauthorized";
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
