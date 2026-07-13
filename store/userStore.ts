// store/userStore.ts
import { AuthUser } from "@/types/auth_types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { technicianApi } from "@/lib/api/technician";

export interface UserState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;

  // Actions
  setUser: (user: AuthUser) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchProfile: () => Promise<void>;
  clear: () => void;

  // Selectors
  isAuthenticated: () => boolean;
  getUserId: () => string | undefined;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      loading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }, false, "setUser"),

      updateUser: (updates) =>
        set(
          (state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          }),
          false,
          "updateUser"
        ),

      setLoading: (loading) => set({ loading }, false, "setLoading"),

      setError: (error) => set({ error }, false, "setError"),

      // Async Action pulling directly from your integrated centralized API client
      fetchProfile: async () => {
        set({ loading: true, error: null }, false, "fetchProfile/start");
        try {
          const profileData = await technicianApi.getMe();
          
          // Map properties safely onto your current AuthUser context shape
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...profileData } : profileData,
              loading: false,
            }),
            false,
            "fetchProfile/success"
          );
        } catch (err: any) {
          set(
            { error: err.message || "Failed fetching context payload", loading: false },
            false,
            "fetchProfile/failure"
          );
        }
      },

      clear: () => set({ user: null, loading: false, error: null }, false, "clear"),

      // Selectors
      isAuthenticated: () => get().user !== null,

      getUserId: () => get().user?.id,
    }),
    { name: "UserStore" }
  )
);