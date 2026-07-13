import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { 
  LayoutDashboard, 
  Layers, 
  FlaskConical, 
  Building2, 
  Settings, 
  ShieldAlert,
  User,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LogoutButton from "./components/LogoutButton"; 

// 🟢 FIXED: Import the decoupled authOptions object instead of the executable handler
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // 1. SECURE SERVER-SIDE SESSION VALIDATION
  // 🟢 FIXED: Reference the decoupled configuration options explicitly
  const session = await getServerSession(authOptions);
  
  const rawRole = session?.user?.role || "";
  const userRole = String(rawRole).toLowerCase().replace("role_", "").trim();

  // 2. HARD FORCE DIRECT EVICTION WALL
  if (!session || userRole !== "admin") {
    redirect("/login?error=UnauthorizedAdminPortal");
  }

  const adminNavItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/departments", label: "Departments", icon: Layers },
    { href: "/admin/tests-catalog", label: "Tests & Panels", icon: FlaskConical },
    { href: "/admin/clinics-doctors", label: "Referrals & Network", icon: Building2 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-neutral-900 text-neutral-200 font-sans">
      <div className="h-16 flex items-center px-6 border-b border-neutral-800 gap-2.5">
        <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <span className="font-serif font-bold text-lg tracking-tight text-white block leading-none">LabFlow</span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mt-0.5">Admin Workspace</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 border border-transparent transition-all duration-200 group"
            >
              <Icon className="h-4 w-4 text-neutral-400 group-hover:text-neutral-200 transition-transform duration-200 group-hover:scale-105" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800 bg-neutral-950/40">
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-neutral-50/50 font-sans">
      {/* Desktop Sidebar Layout */}
      <aside className="hidden md:block w-64 border-r border-neutral-200 shrink-0 sticky top-0 h-screen z-20 shadow-sm">
        <SidebarContent />
      </aside>
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Floating Control Bar */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors focus-visible:outline-hidden">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold text-neutral-800 leading-none">{session?.user?.name || "System Admin"}</span>
              <span className="text-[10px] text-neutral-400 font-medium mt-0.5 block">{session?.user?.email || "Root Authorization"}</span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>
        
        {/* Render Workspace Content Viewports */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}