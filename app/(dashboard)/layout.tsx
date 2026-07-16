// app/(dashboard)/layout.tsx

import React from "react";
import Link from "next/link";
import { Layers, CalendarDays, Activity, LogOut, Terminal } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigationItems = [
    {
      label: "Results Ledger",
      href: "/dashboard/technician/results",
      icon: Layers,
    },
    {
      label: "Visits Registry",
      href: "/dashboard/technician/visits",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50/50 text-slate-900 font-sans antialiased">
      {/* Structural Sidebar Drawer */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white shadow-xs shrink-0">
        <div className="flex items-center gap-2.5 h-16 px-6 border-b border-slate-100 bg-linear-to-b from-white to-slate-50/30">
          <Activity className="h-5 w-5 text-blue-600 shrink-0" />
          <span className="font-bold text-sm tracking-tight text-slate-900">Clinical Telemetry System</span>
        </div>

        {/* Navigation Matrices Links Mapping */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 h-10 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 border border-transparent hover:border-blue-50/30 transition-all duration-200"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Identity Authorization Reference Matrix Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shadow-xs">
              IM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">Ismael M.</p>
              <p className="text-[10px] font-medium text-slate-400 truncate">System Technician</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame Shell */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Global Operational Header Control Strip */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-xs shrink-0 z-10">
          {/* Mobile Identity Handshake Display */}
          <div className="flex items-center gap-2.5 md:hidden">
            <Activity className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-xs tracking-tight text-slate-900">Clinical Telemetry</span>
          </div>

          {/* Active Baseline Environmental Network Telemetry Status */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-lg font-mono">
            <Terminal className="h-3.5 w-3.5 text-slate-400" />
            <span>CHANNEL HOST: 192.168.1.90:8080</span>
            <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse ml-1"></span>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Touch Navigation Shortcuts */}
            <div className="flex md:hidden items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-50"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:block h-4 w-px bg-slate-200" />
            
            <button 
              type="button" 
              className="flex items-center justify-center p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50/50 transition-colors border border-transparent hover:border-red-100/50"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Context Pipeline Render Workspace Layout Pane */}
        <main className="flex-1 overflow-y-auto bg-slate-50/40 relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}