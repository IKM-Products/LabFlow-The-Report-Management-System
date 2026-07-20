// app/(dashboard)/admin/page.tsx

import React from "react";
import { 
  ShieldAlert, 
  Users, 
  Database, 
  HardDrive, 
  Settings, 
  Cpu, 
  Terminal, 
  ArrowUpRight, 
  Radio,
  Stethoscope,
  Building2,
  TestTubes,
  UserSquare2,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const adminMetrics = [
    {
      label: "System Operators",
      value: "12 Active",
      description: "Technicians & Practitioners online",
      icon: Users,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      label: "Database Integrity",
      value: "99.98%",
      description: "Sync stability for records storage",
      icon: Database,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Cluster Load Factor",
      value: "24.6%",
      description: "Operational throughput threshold",
      icon: Cpu,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  const adminControls = [
    {
      title: "User Management",
      description: "Manage system operators, accounts, and standard user configurations.",
      icon: Users,
      href: "/admin/users",
      badge: "Security",
    },
    {
      title: "Doctor Directory",
      description: "Oversee practitioner credentials, active duty statuses, and medical assignments.",
      icon: Stethoscope,
      href: "/admin/doctors",
      badge: "Staff",
    },
    {
      title: "Department Hub",
      description: "Configure organization structures, clinic wings, and specialized divisions.",
      icon: Building2,
      href: "/admin/departments",
      badge: "Infrastructure",
    },
    {
      title: "Laboratory Configurations",
      description: "Manage physical labs, analysis equipment profiles, and processing configurations.",
      icon: TestTubes,
      href: "/admin/labs",
      badge: "Operations",
    },
    {
      title: "Operator Profiles",
      description: "Audit detailed administrative profiles and cryptographic identities.",
      icon: UserSquare2,
      href: "/admin/profiles",
      badge: "Identity",
    },
    {
      title: "Access Control Roles",
      description: "Define granular permission levels, token authorizations, and security clearance groups.",
      icon: ShieldCheck,
      href: "/admin/roles",
      badge: "Policy",
    },
    {
      title: "Gateway Telemetry Config",
      description: "Configure environment routing, modify proxy channels, and target base infrastructure API pipelines.",
      icon: Settings,
      href: "/admin/settings",
      badge: "System Core",
    },
  ];

  const recentSystemLogs = [
    { id: "LOG-9821", event: "API Pipeline binding refresh successful", source: "192.168.1.90:8080", status: "success", time: "2 mins ago" },
    { id: "LOG-9819", event: "Encounter entry validation failure - missing patient_id", source: "VisitForm.tsx", status: "warning", time: "14 mins ago" },
    { id: "LOG-9814", event: "Patch sequence token authorization handshake approved", source: "EditVisit.tsx", status: "success", time: "1 hr ago" },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Admin Governance Header Context */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-4 -mr-4 opacity-5 pointer-events-none">
          <ShieldAlert className="w-48 h-48" />
        </div>
        <div className="space-y-1 relative z-10">
          <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
            <Radio className="h-4 w-4 text-rose-500 animate-pulse" />
            Core Infrastructure Administration Console
          </h1>
          <p className="text-slate-400 text-xs max-w-xl">
            Root node dashboard authority. Monitor low-level diagnostic structures, alter cluster routing matrices, and manage authorization levels across telemetry layers.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono font-bold bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl self-start md:self-auto">
          <Terminal className="h-3.5 w-3.5 text-rose-400 shrink-0" />
          <span className="text-slate-300">ROOT@NODE-ADMIN</span>
        </div>
      </div>

      {/* Admin Operations Metric Subgrid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {adminMetrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{metric.label}</p>
                <p className="text-lg font-extrabold text-slate-900 tracking-tight">{metric.value}</p>
                <p className="text-[10px] text-slate-500 font-medium">{metric.description}</p>
              </div>
              <div className={`p-2 rounded-xl border ${metric.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Administrative Controls Panels Mapping */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Governance & Control Zones</h2>
          <div className="grid grid-cols-1 gap-4">
            {adminControls.map((control, index) => {
              const Icon = control.icon;
              return (
                <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {control.title}
                        </h3>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200/50">
                          {control.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                        {control.description}
                      </p>
                    </div>
                  </div>
                  <Link 
                    href={control.href}
                    className="self-end sm:self-auto h-8 w-8 rounded-lg border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 text-slate-400 hover:text-emerald-600 flex items-center justify-center shrink-0 transition-all"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Realtime Node Pipeline Event Diagnostics Terminal */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <HardDrive className="h-3 w-3" />
            Live Pipeline Diagnostics
          </h2>
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 font-mono text-[11px] leading-relaxed text-slate-300 shadow-sm space-y-3 h-52.5 overflow-y-auto">
            {recentSystemLogs.map((log) => (
              <div key={log.id} className="border-b border-slate-800 pb-2 last:border-none last:pb-0 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-bold">{log.id}</span>
                  <span className={`text-[9px] px-1 rounded-sm uppercase font-bold ${
                    log.status === "success" ? "bg-emerald-950 text-emerald-400" : "bg-amber-950 text-amber-400"
                  }`}>
                    {log.status}
                  </span>
                </div>
                <p className="text-slate-200 truncate">{log.event}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>SRC: {log.source}</span>
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}