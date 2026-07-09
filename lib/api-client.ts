import { env } from "@/config/env";
import { useAuthStore } from "@/store/auth-store";

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Pull modern auth token dynamically from state if it exists
  const token = useAuthStore.getState().token;

  const headers = new Headers({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  });

  const response = await fetch(`${env.apiBaseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle unauthorized sessions immediately
    if (response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}