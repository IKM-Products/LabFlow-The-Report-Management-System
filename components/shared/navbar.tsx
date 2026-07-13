"use client";

import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { Menu, LogOut } from "lucide-react";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="flex h-20 items-center justify-between border-b border-stone-200/60 bg-white/80 backdrop-blur-md px-6 sm:px-10 relative z-30 select-none">
      
      {/* Sidebar Toggle Trigger Button */}
      <button 
        onClick={toggleSidebar} 
        className="p-2.5 text-stone-400 hover:text-green-700 hover:bg-green-50/50 rounded-xl transition-all active:scale-[0.95] border border-transparent hover:border-stone-200/40 cursor-pointer group"
      >
        <Menu className="h-5 w-5 stroke-2 transition-transform group-hover:rotate-180 duration-500" />
      </button>

      {/* User Session Matrix & Identity Capsule */}
      <div className="flex items-center gap-4">
        
        {/* Editorial Profile Description Tag */}
        <div className="text-right hidden sm:block">
          <span className="block text-[9px] font-black uppercase tracking-wider text-stone-400 leading-none mb-1">
            {user?.role_name || "Operator"}
          </span>
          <span className="text-xs font-bold text-stone-700 tracking-wide">
            {user?.full_name || "Lab User"}
          </span>
        </div>

        {/* Dynamic Avatar Initials Placeholder */}
        <div className="w-9 h-9 rounded-xl bg-[#F4F2EC] border border-stone-200 flex items-center justify-center font-mono font-bold text-xs text-stone-600 shadow-xs">
          {(user?.full_name || "L").charAt(0).toUpperCase()}
        </div>

        {/* Elegant Accent Splitter Line */}
        <div className="h-5 w-px bg-stone-200/80 mx-1" />

        {/* Modern Minimalist Logout Trigger Action */}
        <button 
          onClick={logout} 
          className="h-9 px-3.5 bg-rose-50/60 hover:bg-rose-100/70 border border-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 active:scale-[0.98] cursor-pointer group shadow-2xs"
        >
          <LogOut className="h-3.5 w-3.5 stroke-2 transition-transform group-hover:translate-x-0.5" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}