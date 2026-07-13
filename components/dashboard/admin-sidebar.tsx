"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, ShieldCheck, Settings, FileSpreadsheet } from "lucide-react";

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
        "h-screen border-r bg-card text-card-foreground shadow-sm transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-0 -translate-x-full md:w-16 md:translate-x-0 overflow-hidden"
      )}
    >
      <div className="flex h-16 items-center px-6 border-b">
        <span className={cn("font-bold text-lg text-emerald-700 tracking-wide transition-opacity flex items-center gap-2", !isOpen && "md:opacity-0")}>
          LabFlow <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-sans uppercase font-black tracking-wider">Admin</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {adminNavigationItems.map((item) => {
          const Icon = item.icon;
          // Exact match logic or sub-route match checks
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors group",
                isActive 
                  ? "bg-emerald-600 text-white" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0 transition-transform", isOpen ? "mr-3" : "mx-auto")} />
              {isOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}