// store/ui.store.ts

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  selectedProfileId: string | null;

  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSelectedProfileId: (id: string | null) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  selectedProfileId: null,

  setSidebarOpen: (sidebarOpen) =>
    set({ sidebarOpen }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  setSelectedProfileId: (selectedProfileId) =>
    set({ selectedProfileId }),
}));