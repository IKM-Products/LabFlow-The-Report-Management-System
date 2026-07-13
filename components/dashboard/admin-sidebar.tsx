"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Settings, 
  FileSpreadsheet, 
  FlaskConical 
} from "lucide-react";

const adminNavigationItems = [
  { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "System Logs", href: "/admin/logs", icon: ShieldCheck },
  { name: "Report Templates", href: "/admin/templates", icon: FileSpreadsheet },
  { name: "Global Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isOpen = useUIStore((state) => state.isSidebarOpen);

  return (
    <aside 
      className={cn(
        "h-screen bg-linear-to-br from-green-800 via-green-700 to-emerald-900 text-white shadow-[12px_0_60px_rgba(15,55,30,0.15)] transition-all duration-300 flex flex-col relative overflow-hidden z-20 shrink-0",
        isOpen ? "w-64" : "w-0 -translate-x-full md:w-20 md:translate-x-0"
      )}
    >
      {/* Premium Subtle Dot Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[32px_32px] opacity-[0.06] pointer-events-none" />

      {/* HEADER: Brand Architecture with LIVE Glowing Flask Logo */}
      <div className={cn(
        "flex h-20 items-center border-b border-white/10 relative z-10 select-none transition-all duration-300",
        isOpen ? "px-6" : "justify-center px-0"
      )}>
        <div className="flex items-center gap-3 cursor-default group">
          <div className="w-9 h-9 rounded-xl border border-white/20 flex items-center justify-center bg-white/10 shadow-lg backdrop-blur-md relative overflow-hidden shrink-0">
            <span className="absolute inset-0 bg-linear-to-t from-emerald-400/20 to-transparent animate-pulse" />
            <FlaskConical className="w-4 h-4 text-emerald-300 fill-emerald-400/20" />
          </div>
          
          {isOpen && (
            <div className="flex flex-col animate-in fade-in duration-300">
              <span className="text-sm font-black tracking-[0.4em] uppercase font-mono">
                Lab<span className="text-emerald-300 font-light">Flow</span>
              </span>
              <span className="text-[8px] font-sans font-bold tracking-[0.18em] text-emerald-200/50 uppercase">
                Admin Workspace
              </span>
            </div>
          )}
        </div>
      </div>

      {/* NAVIGATION: Floating Glass-morphic Item Anchors */}
      <nav className="flex-1 space-y-1.5 p-4 relative z-10">
        {adminNavigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-xl px-3.5 py-3 text-xs font-bold tracking-wider uppercase transition-all group select-none relative",
                isActive 
                  ? "bg-white text-green-900 shadow-md font-black scale-[1.01]" 
                  : "text-green-100/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon 
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors", 
                  isOpen ? "mr-3.5" : "mx-auto",
                  isActive ? "text-green-700" : "text-green-200/50 group-hover:text-white/90"
                )} 
              />
              
              {isOpen && <span className="animate-in fade-in duration-300">{item.name}</span>}
              
              {/* Optional Minimal Micro-indicator pill for minimized view */}
              {!isOpen && isActive && (
                <div className="absolute left-0 top-1/4 h-1/2 w-1 bg-white rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}