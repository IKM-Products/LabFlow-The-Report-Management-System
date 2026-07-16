import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  userId: string | null;
  userType: string | null;
  sessionId: string | null;
  setAuthSession: (userId: string, userType: string, sessionId: string) => void;
  clearAuthSession: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      userType: null,
      sessionId: null,
      setAuthSession: (userId, userType, sessionId) =>
        set({ userId, userType, sessionId }),
      clearAuthSession: () => set({ userId: null, userType: null, sessionId: null }),
    }),
    {
      name: "telemetry-user-storage",
    }
  )
);