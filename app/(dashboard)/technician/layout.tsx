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
  User,
  FlaskConical
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LogoutButton from "./components/LogoutButton";

// 🟢 FIXED: Import the decoupled authOptions object instead of the executable handler
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface TechnicianLayoutProps {
  children: React.ReactNode;
}

export default async function TechnicianLayout({ children }: TechnicianLayoutProps) {
  // 1. SECURE SERVER-SIDE SESSION VALIDATION
  // 🟢 FIXED: Reference the decoupled configuration options explicitly
  const session = await getServerSession(authOptions);
  
  const rawRole = session?.user?.role || "";
  const userRole = String(rawRole).toLowerCase().replace("role_", "").trim();

  // 2. HARD FORCE DIRECT EVICTION WALL
  if (!session || userRole !== "technician") {
    redirect("/login?error=UnauthorizedTechnicianPortal");
  }

  const techNavItems = [
    { href: "/technician", label: "Operations Hub", icon: Activity },
    { href: "/technician/patients", label: "Patient Registry", icon: Users },
    { href: "/technician/order-queue", label: "Order Queue", icon: ClipboardList },
    { href: "/technician/reports", label: "Finalized Reports", icon: FileText },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-neutral-200 font-sans">
      <div className="h-16 flex items-center px-6 border-b border-neutral-100 gap-2.5">
        <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
          <FlaskConical className="h-5 w-5" />
        </div>
        <div>
          <span className="font-serif font-bold text-lg tracking-tight text-neutral-900 block leading-none">LabFlow</span>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mt-0.5">Technician Portal</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {techNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-all duration-200"
            >
              <Icon className="h-4 w-4 text-neutral-400" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-100">
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-neutral-50/50">
      <aside className="hidden md:block w-64 sticky top-0 h-screen z-20 shadow-xs">
        <SidebarContent />
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-4 md:hidden">
            <Sheet>
              <SheetTrigger className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors focus-visible:outline-hidden">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right">
              <span className="block text-xs font-bold text-neutral-900 leading-none">{session?.user?.name || "Lab Technician"}</span>
              <span className="text-[10px] text-neutral-500 mt-0.5 block"> {session?.user?.email || "Active Session"}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
              <User className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}