import React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Layers,
  Clock,
  CheckCircle2,
  Users,
  ArrowRight,
} from "lucide-react";

export default function TechnicianDashboardPage() {
  // Key Operational Metrics
  const metrics = [
    {
      label: "Pending Tests",
      value: "14",
      description: "Awaiting result entry",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label: "Completed Today",
      value: "32",
      description: "Successfully processed",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Active Visits",
      value: "8",
      description: "Patients in queue",
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
  ];

  // Primary Workflows
  const modules = [
    {
      title: "Patient Visits",
      description: "Log patient admissions, view the active queue, and update encounter details.",
      href: "/dashboard/technician/visits",
      icon: CalendarDays,
      actionText: "Manage Visits",
    },
    {
      title: "Lab Results Entry",
      description: "Record laboratory measurements, catalog quantitative values, and file test reports.",
      href: "/dashboard/technician/results",
      icon: Layers,
      actionText: "Enter Results",
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Technician Workspace</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track active patient encounters and manage laboratory test entries.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">{metric.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{metric.value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{metric.description}</p>
              </div>
              <div className={`p-3 rounded-xl border ${metric.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Core Workflows Grid */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Core Workflows
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between group space-y-6"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Link
                    href={mod.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-4 py-2 rounded-xl border border-blue-100 transition-colors"
                  >
                    <span>{mod.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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