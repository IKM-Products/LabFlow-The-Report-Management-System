"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  ClipboardList, 
  Users, 
  FileText, 
  LogOut, 
  Activity, 
  Menu,
  User,
  FlaskConical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface TechnicianLayoutProps {
  children: React.ReactNode;
}

export default function TechnicianLayout({ children }: TechnicianLayoutProps) {
  const pathname = usePathname();

  // Navigation schema for operational laboratory tasks
  const techNavItems = [
    { href: "/technician", label: "Operations Hub", icon: Activity },
    { href: "/technician/patients", label: "Patient Registry", icon: Users },
    { href: "/technician/order-queue", label: "Order Queue", icon: ClipboardList },
    { href: "/technician/reports", label: "Finalized Reports", icon: FileText },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200 font-sans">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-100 gap-2.5">
        <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
          <FlaskConical className="h-5 w-5" />
        </div>
        <div>
          <span className="font-serif font-bold text-lg tracking-tight text-neutral-900 block leading-none">LabFlow</span>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mt-0.5">Technician Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {techNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-emerald-50 text-emerald-700" 
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-emerald-600" : "text-neutral-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-100">
        <Button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          variant="ghost" 
          className="w-full justify-start gap-3 h-11 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-semibold text-sm"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-neutral-50/50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 sticky top-0 h-screen z-20 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 md:hidden">
            <Sheet>
                <SheetTrigger>
                  <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64"><SidebarContent /></SheetContent>
              </Sheet>
          </div>
          
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right">
              <span className="block text-xs font-bold text-neutral-900 leading-none">Lab Technician</span>
              <span className="text-[10px] text-neutral-500 mt-0.5 block">Active Session</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
              <User className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}