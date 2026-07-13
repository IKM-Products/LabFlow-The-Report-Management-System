"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Layers, 
  FlaskConical, 
  Building2, 
  Settings, 
  LogOut, 
  ShieldAlert,
  User,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  // Navigation schema targeting your admin sub-routes
  const adminNavItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/departments", label: "Departments", icon: Layers },
    { href: "/admin/tests-catalog", label: "Tests & Panels", icon: FlaskConical },
    { href: "/admin/clinics-doctors", label: "Referrals & Network", icon: Building2 },
    { href: "/admin/settings", label: "System Settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-neutral-900 text-neutral-200 font-sans">
      {/* Brand Identity Branding Header */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-800 gap-2.5">
        <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <span className="font-serif font-bold text-lg tracking-tight text-white block leading-none">LabFlow</span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mt-0.5">Admin Workspace</span>
        </div>
      </div>

      {/* Navigational Links Group Matrix */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20" 
                  : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50 border border-transparent"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 transition-transform duration-200 group-hover:scale-105",
                isActive ? "text-emerald-400" : "text-neutral-400 group-hover:text-neutral-200"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Persistent User Profile & Disconnection Area */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950/40">
        <Button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          variant="ghost" 
          className="w-full justify-start gap-3 h-11 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl font-semibold text-sm transition-colors group"
        >
          <LogOut className="h-4 w-4 text-neutral-400 group-hover:text-rose-400 transition-colors" />
          Terminate Session
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-neutral-50/50 font-sans">
      {/* Desktop Persistent Rail Sidebar Layout */}
      <aside className="hidden md:block w-64 border-r border-neutral-200 shrink-0 sticky top-0 h-screen z-20 shadow-xs">
        <SidebarContent />
      </aside>

      {/* Right Column Core Body Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Horizontal Action Workspace Header */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-4">
            {/* Mobile Sheet Trigger Menu */}
            <Sheet>
              {/* SheetTrigger does not accept an 'asChild' prop in this implementation */}
              <SheetTrigger>
                <Button variant="ghost" size="icon" className="md:hidden rounded-lg text-neutral-500 hover:bg-neutral-100">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Right Header Navigation Profile Avatar Context Info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-bold text-neutral-800 leading-none">System Admin</span>
              <span className="text-[10px] text-neutral-400 font-medium mt-0.5 block">Root Authorization</span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>

        {/* Dynamic Routing Content Sub-Node Base Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}