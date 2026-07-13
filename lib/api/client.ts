import { getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

async function getAuthHeader(): Promise<string | null> {
  if (typeof window === "undefined") {
    const session = await getServerSession(authOptions);
    return session?.user?.accessToken ? `Bearer ${session.user.accessToken}` : null;
  }
  const session = await getSession();
  return session?.user?.accessToken ? `Bearer ${session.user.accessToken}` : null;
}

export async function apiClient<T>(
  endpoint: string, 
  { method = "GET", body, options }: { method?: string; body?: any; options?: RequestInit } = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const authHeader = await getAuthHeader();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(authHeader ? { Authorization: authHeader } : {}),
    ...(options?.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || `HTTP Exception: ${response.status}`);
  }

  return response.json() as Promise<T>;
}