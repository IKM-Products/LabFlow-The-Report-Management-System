"use client";

import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6 shadow-sm">
      <button 
        onClick={toggleSidebar} 
        className="rounded p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      >
        ☰
      </button>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.full_name || "Lab User"}</p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role_name || "Operator"}</p>
        </div>
        <button 
          onClick={logout} 
          className="rounded bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}