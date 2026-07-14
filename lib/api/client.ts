// lib/api/client.ts
import axiosInstance from "@/axios/instance";
import { AxiosRequestConfig } from "axios";
import { getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Dynamically resolves the NextAuth access token depending on the execution context.
 * Server-side (SSR/RSC/Route Handlers) vs Client-side (Browser components).
 */
async function getAuthHeader(): Promise<string | null> {
  if (typeof window === "undefined") {
    const session = await getServerSession(authOptions);
    return session?.accessToken ? `Bearer ${session.accessToken}` : null;
  }
  const session = await getSession();
  return session?.accessToken ? `Bearer ${session.accessToken}` : null;
}

// Global Axios Request Interceptor to automatically attach authorization headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const authHeader = await getAuthHeader();
    if (authHeader) {
      config.headers = config.headers || {};
      config.headers.Authorization = authHeader;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Centralized request wrapper processing endpoints via our Axios instance
 * while unpacking the raw .data payload for the rest of your api definitions.
 */
export async function apiRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "API Network request failed"
    );
  }
}