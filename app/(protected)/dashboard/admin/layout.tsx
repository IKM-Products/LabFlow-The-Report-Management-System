"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Stethoscope, 
  FlaskConical,
  Microscope, 
  Contact, 
  LogOut,
  Grid,
  BookOpen,
  Scale,
  Sliders,
  AlertTriangle
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const navigationGroups = [
    {
      groupName: "Dashboard",
      items: [
        { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard }
      ]
    },
    {
      groupName: "Organization",
      items: [
        { name: "Departments", href: "/dashboard/admin/departments", icon: Building2 },
        { name: "Doctors", href: "/dashboard/admin/doctors", icon: Stethoscope },
        { name: "Labs", href: "/dashboard/admin/labs", icon: Microscope },
      ]
    },
    {
      groupName: "Laboratory Configuration",
      items: [
        { name: "Panels", href: "/dashboard/admin/panels", icon: Grid },
        { name: "Test Catalogs", href: "/dashboard/admin/test-catalogs", icon: BookOpen },
        { name: "Test Parameters", href: "/dashboard/admin/test-parameters", icon: Sliders },
        { name: "Reference Ranges", href: "/dashboard/admin/reference-ranges", icon: Scale },
      ]
    },
    {
      groupName: "User Management",
      items: [
        { name: "Profiles", href: "/dashboard/admin/profiles", icon: Contact },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      setIsLogoutDialogOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Critical error during session termination lifecycle:", error);
    }
  };

  const renderNavLinks = () => {
    return navigationGroups.map((group) => (
      <div key={group.groupName} className="space-y-1 pt-4 first:pt-0">
        <h4 className="px-4 text-[10px] font-bold tracking-wider uppercase text-slate-400 select-none">
          {group.groupName}
        </h4>
        <div className="space-y-0.5 mt-1">
          {group.items.map((item) => {
            const isActive = item.href === "/dashboard/admin" 
              ? pathname === "/dashboard/admin" 
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
              
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`group flex items-center justify-between rounded-xl px-4 h-10 text-xs font-semibold transition-all duration-150 ${
                  isActive 
                    ? "text-emerald-700 bg-emerald-50 bg-opacity-80 shadow-xs" 
                    : "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 hover:bg-opacity-80 hover:shadow-xs"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    className={`h-4 w-4 transition-colors duration-150 ${
                      isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"
                    }`} 
                  />
                  <span className="transition-colors duration-150">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    ));
  };

  return (
    <div className="flex min-h-screen w-screen bg-slate-50 text-slate-800 font-sans antialiased overflow-x-hidden">
      
      {/* ================= SIDEBAR: PERSISTENT DESKTOP PANEL ================= */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-slate-200/60 bg-white shadow-xs">
        {/* LabFlow Branding Header */}
        <div className="flex h-16 items-center border-b border-slate-100 px-6 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer select-none group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
              <div className="absolute inset-0 rounded-xl bg-emerald-400/40 blur-md animate-pulse" />
              <FlaskConical className="relative w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 animate-bounce" />
            </div>

            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              LabFlow
            </span>
          </div>
        </div>
        
        {/* Dynamic Desktop Routing Core */}
        <nav className="flex-1 space-y-4 px-4 py-6 overflow-y-auto">
          {renderNavLinks()}
        </nav>

        {/* Action Controls Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/40 flex flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsLogoutDialogOpen(true)}
            className="w-full flex items-center gap-3 px-4 h-11 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all duration-200 cursor-pointer text-left"
          >
            <LogOut className="h-4 w-4 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= PRIMARY WORKSPACE VIEWPORT ================= */}
      <div className="flex flex-1 flex-col pl-64 min-w-0">
        
        {/* Upper Pipeline Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-xs shrink-0">
          
          <div className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
            <span className="text-slate-700 font-bold text-lg italic capitalize">
              {pathname === "/dashboard/admin" ? "Admin Workspace" : pathname.split("/").pop()?.replace("-", " ")}
            </span>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            {/* Account Identity Segment */}
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-emerald-600/10 select-none">
                IKM
              </div>
              <div className="block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">Ismael Karki Manaay</p>
                <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* ================= CONFIRMATION MODAL DIALOG ================= */}
      {isLogoutDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Confirm Sign Out</h3>
                <p className="text-xs text-slate-500 mt-0.5">Are you sure you want to sign out?</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsLogoutDialogOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm shadow-rose-600/20 transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}