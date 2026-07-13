import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { 
  ClipboardList, 
  Users, 
  FileText, 
  Activity, 
  Menu,
  FlaskConical
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LogoutButton from "./components/LogoutButton";

// 🟢 Explicit Auth Options Configuration Mapping
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface TechnicianLayoutProps {
  children: React.ReactNode;
}

export default async function TechnicianLayout({ children }: TechnicianLayoutProps) {
  // 1. SECURE SERVER-SIDE SESSION VALIDATION
  const session = await getServerSession(authOptions);
  
  // Normalize checking strategy to capture variations cleanly ("TECHNICIAN", "ROLE_TECHNICIAN", etc.)
  const rawRole = session?.user?.role || "";
  const userRole = String(rawRole).toLowerCase().replace("role_", "").trim();

  // 2. RE-ROUTING COMPLIANCE CHECK
  if (!session || userRole !== "technician") {
    redirect("/login?error=UnauthorizedTechnicianPortal");
  }

  const techNavItems = [
    { href: "/technician", label: "Operations Hub", icon: Activity },
    { href: "/technician/patients", label: "Patient Registry", icon: Users },
    { href: "/technician/order-queue", label: "Order Queue", icon: ClipboardList },
    { href: "/technician/reports", label: "Finalized Reports", icon: FileText },
  ];

  // SHARED COMPONENT: Sidebar Shell Architecture matching premium design rules
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-linear-to-br from-green-800 via-green-700 to-emerald-900 text-white relative overflow-hidden">
      {/* Subtle Luxury Dot Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[32px_32px] opacity-[0.06] pointer-events-none" />

      {/* Brand Architecture Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/10 relative z-10 select-none">
        <div className="flex items-center gap-3 cursor-default group">
          <div className="w-9 h-9 rounded-xl border border-white/20 flex items-center justify-center bg-white/10 shadow-lg backdrop-blur-md relative overflow-hidden shrink-0">
            <span className="absolute inset-0 bg-linear-to-t from-emerald-400/20 to-transparent animate-pulse" />
            <FlaskConical className="w-4 h-4 text-emerald-300 fill-emerald-400/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-[0.4em] uppercase font-mono">
              Lab<span className="text-emerald-300 font-light">Flow</span>
            </span>
            <span className="text-[8px] font-sans font-bold tracking-[0.18em] text-emerald-200/50 uppercase">
              Technician Workspace
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Stack Links */}
      <nav className="flex-1 space-y-1.5 p-4 relative z-10">
        {techNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center rounded-xl px-4 py-3 text-xs font-bold tracking-wider uppercase text-green-100/70 hover:bg-white/5 hover:text-white transition-all group select-none"
            >
              <Icon className="h-4 w-4 shrink-0 mr-3.5 text-green-200/50 group-hover:text-white/90 transition-colors" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Fixed Action Triggers */}
      <div className="p-4 border-t border-white/10 bg-black/10 relative z-10">
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F4F2EC] font-sans antialiased selection:bg-green-800 selection:text-white relative">
      
      {/* Structural Permanent Desktop Sidebar viewport */}
      <aside className="hidden md:block w-64 shrink-0 sticky top-0 h-screen z-20 shadow-[12px_0_60px_rgba(15,55,30,0.05)]">
        <SidebarContent />
      </aside>
      
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        
        {/* Floating Minimal Mobile Hamburger Switch Trigger (Hidden on Desktop) */}
        <div className="md:hidden fixed top-4 left-4 z-40">
          <Sheet>
            <SheetTrigger className="p-2.5 text-stone-500 bg-white/90 backdrop-blur-md hover:text-green-700 hover:bg-green-50 rounded-xl transition-all border border-stone-200/60 shadow-xs focus-visible:outline-hidden cursor-pointer">
              <Menu className="h-5 w-5 stroke-2" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r-0 bg-transparent">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Main Content Workspace Viewport execution rendering flow */}
        <main className="flex-1 relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}