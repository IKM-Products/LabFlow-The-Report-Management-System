// src/config/axios.ts

import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://192.168.1.90:8080/api";

/* -------------------------------------------------------------------------- */
/*                                  PUBLIC API                                */
/* -------------------------------------------------------------------------- */

export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/*                                 PRIVATE API                                */
/* -------------------------------------------------------------------------- */

export const privateApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/*                            Attach Access Token                             */
/* -------------------------------------------------------------------------- */

privateApi.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* -------------------------------------------------------------------------- */
/*                          Handle Unauthorized                               */
/* -------------------------------------------------------------------------- */

privateApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response?.status === 401) {
      await signOut({
        callbackUrl: "/login",
      });
    }

    return Promise.reject(error);
  }
);

export default privateApi;