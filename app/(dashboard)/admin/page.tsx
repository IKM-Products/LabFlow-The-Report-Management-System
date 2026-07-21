import React from "react";
import Link from "next/link";
import {
  Users,
  Stethoscope,
  Building2,
  TestTubes,
  SlidersHorizontal,
  Settings,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function AdminDashboardPage() {
  // Overview Stats
  const stats = [
    {
      label: "Total Doctors",
      value: "24",
      icon: Stethoscope,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Departments",
      value: "8",
      icon: Building2,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      label: "Laboratories",
      value: "12",
      icon: TestTubes,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label: "Active Users",
      value: "148",
      icon: Users,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  // Core Navigation Modules
  const adminModules = [
    {
      title: "User Management",
      description: "Manage platform accounts, active system operators, and permissions.",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Doctor Directory",
      description: "View and edit medical staff credentials, assignments, and statuses.",
      icon: Stethoscope,
      href: "/admin/doctors",
    },
    {
      title: "Department Hub",
      description: "Manage hospital divisions, clinics, and organizational wings.",
      icon: Building2,
      href: "/admin/departments",
    },
    {
      title: "Laboratory Setup",
      description: "Configure physical labs, testing profiles, and equipment.",
      icon: TestTubes,
      href: "/admin/labs",
    },
    {
      title: "Reference Ranges",
      description: "Set test parameters, min/max values, gender and age bounds.",
      icon: SlidersHorizontal,
      href: "/admin/reference-range",
    },
    {
      title: "Roles & Access Control",
      description: "Define administrative permission levels and clearance groups.",
      icon: ShieldCheck,
      href: "/admin/roles",
    },
    {
      title: "System Settings",
      description: "Manage global application preferences and routing settings.",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Overview</h1>
        <p className="text-xs text-slate-500 mt-1">
          Quick summary of system metrics and access controls.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl border ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Management Modules Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Management Controls
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminModules.map((module, i) => {
            const Icon = module.icon;
            return (
              <Link
                key={i}
                href={module.href}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between group cursor-pointer space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-xs font-semibold text-emerald-600 gap-1 pt-2">
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}