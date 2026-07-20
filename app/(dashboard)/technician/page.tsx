// app/(dashboard)/technician/page.tsx

import React from "react";
import Link from "next/link";
import { Layers, CalendarDays, Activity, ArrowRight, Terminal, CheckCircle2, AlertCircle } from "lucide-react";

export default function TechnicianDashboardPage() {
  const metrics = [
    {
      label: "Active System Channels",
      value: "2 / 2",
      description: "Visits & Results modules operational",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "API Gateway Latency",
      value: "14ms",
      description: "Connection to 192.168.1.90 stable",
      icon: Activity,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Node Pipeline Status",
      value: "Nominal",
      description: "No data structural exceptions reported",
      icon: Terminal,
      color: "text-slate-600 bg-slate-50 border-slate-200/60",
    },
  ];

  const modules = [
    {
      title: "Encounter Admission Registry",
      description: "Query, log, and update active institutional visits tracking dynamic patient diagnostic streams.",
      href: "/dashboard/technician/visits",
      icon: CalendarDays,
      actionText: "Open Registry Matrix",
    },
    {
      title: "Clinical Analysis Ledger",
      description: "Verify and catalog multi-parameter quantitative data entry collections indexing laboratory workflows.",
      href: "/dashboard/technician/results",
      icon: Layers,
      actionText: "Open Ledger Matrix",
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Welcome & Context Strip */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Operational Workspace Control Panel
        </h1>
        <p className="text-xs text-slate-500 max-w-2xl">
          Welcome to the telemetry management dashboard. Select a tracking subsystem module below to process operational records or check systemic node diagnostics.
        </p>
      </div>

      {/* Metrics Systemic Grid Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, i) => {
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

      {/* Section Divider */}
      <div className="border-t border-slate-200/60 pt-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core Operational Modules</h2>
        
        {/* Module Subsystem Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all group">
                <div className="space-y-3">
                  <div className="h-10 w-10 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                  <Link 
                    href={mod.href} 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-3.5 h-9 rounded-xl border border-blue-100/50 transition-all"
                  >
                    <span>{mod.actionText}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}