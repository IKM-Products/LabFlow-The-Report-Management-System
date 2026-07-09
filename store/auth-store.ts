import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Matching the 'users' and 'roles' entities from your dbdiagram schema
export interface User {
  id: number;
  full_name: string;
  username: string;
  email: string;
  phone?: string;
  role_name: string; // From the linked roles table
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Call this upon successful login via your Next.js/React Hook Form handler
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      // Clear credentials completely on logout
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      // Useful if a user updates their profile data during a active session
      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),
    }),
    {
      name: "labflow-auth-storage", // Unique key for localStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist user and token data, keeping structural flags clean
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);