"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users2, FlaskConical, ClipboardCheck, BookOpen } from "lucide-react";

const technicianNavigationItems = [
  { name: "Dashboard", href: "/technician", icon: LayoutDashboard },
  { name: "Patients", href: "/technician/patients", icon: Users2 },
  { name: "Test Orders", href: "/technician/orders", icon: FlaskConical },
  { name: "Result Entry", href: "/technician/results", icon: ClipboardCheck },
  { name: "Test Catalog", href: "/technician/catalog", icon: BookOpen },
];

export function TechnicianSidebar() {
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
        <span className={cn("font-bold text-lg text-emerald-600 tracking-wide transition-opacity", !isOpen && "md:opacity-0")}>
          LabFlow <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-sans uppercase font-bold tracking-normal">Tech</span>
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {technicianNavigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/technician" && pathname.startsWith(item.href));
          
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