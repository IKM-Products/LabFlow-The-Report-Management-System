// config/axios.ts
import axios from "axios";
import { getSession } from "next-auth/react";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.109:8082/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor to attach bearer token from NextAuth session
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified API error extraction
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessages = error.response?.data?.messages || [
      error.message || "An unexpected network error occurred",
    ];
    return Promise.reject(errorMessages);
  }
);

export default axiosInstance;