"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Patients", href: "/patients" },
  { name: "Test Orders", href: "/orders" },
  { name: "Result Entry", href: "/results" },
  { name: "Test Catalog", href: "/catalog" },
];

export function Sidebar() {
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
        <span className={cn("font-bold text-lg text-primary tracking-wide transition-opacity", !isOpen && "md:opacity-0")}>
          LabFlow
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className={cn(isOpen ? "mr-3" : "mx-auto text-base")}>
                {item.name[0]}
              </span>
              {isOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}