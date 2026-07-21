// app/(dashboard)/admin/panels/page.tsx
"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  Plus,
  Search,
  Filter,
  Monitor,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Cpu,
  Eye,
  Settings2,
  ArrowUpRight
} from "lucide-react";

// Mock Data for Lab Monitoring Panels
const initialPanels = [
  {
    id: "PNL-801",
    name: "Critical STAT & ER Backlog Monitor",
    department: "Emergency Diagnostics",
    targetDisplay: "Control Room Screen 01",
    refreshInterval: "5s",
    activeAnalyzers: 4,
    status: "ACTIVE",
    loadFactor: "High",
    lastSynced: "Just now",
  },
  {
    id: "PNL-802",
    name: "Hematology Routine Throughput",
    department: "Core Hematology",
    targetDisplay: "Main Lab Station B",
    refreshInterval: "15s",
    activeAnalyzers: 6,
    status: "ACTIVE",
    loadFactor: "Normal",
    lastSynced: "2 min ago",
  },
  {
    id: "PNL-803",
    name: "Molecular Virology Sequencing Matrix",
    department: "Genetics & Virology",
    targetDisplay: "Supervisor Tablet Interface",
    refreshInterval: "30s",
    activeAnalyzers: 2,
    status: "DRAFT",
    loadFactor: "Low",
    lastSynced: "1h ago",
  },
  {
    id: "PNL-804",
    name: "Calibrations & Quality Control Ledger",
    department: "Quality Assurance",
    targetDisplay: "Overhead Display East",
    refreshInterval: "60s",
    activeAnalyzers: 12,
    status: "MAINTENANCE",
    loadFactor: "Normal",
    lastSynced: "10 min ago",
  },
];

export default function AdminPanelsPage() {
  const [panels, setPanels] = useState(initialPanels);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");

  // Filtering Logic
  const filteredPanels = panels.filter((panel) => {
    const matchesSearch =
      panel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      panel.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      panel.targetDisplay.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = deptFilter === "ALL" || panel.department === deptFilter;

    return matchesSearch && matchesDept;
  });

  // Extract unique departments for filtering options
  const departments = ["ALL", ...new Set(panels.map((p) => p.department))];

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50/50 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs tracking-wider uppercase">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Infrastructure Management</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Display Panels</h1>
          <p className="text-sm font-medium text-slate-500">
            Configure target hardware display outputs, provision data sync telemetry, and supervise live terminal feeds.
          </p>
        </div>

        <button className="h-11 px-5 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 text-white font-semibold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/10 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Provision Panel</span>
        </button>
      </div>

      {/* Analytics Widget Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Terminals</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">14 Monitors</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% hardware uptime link
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Monitor className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aggregated Feed Rates</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">24.2k <span className="text-sm font-normal text-slate-400">ops/sec</span></h3>
            <p className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin-slow" /> Core network state stable
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Cpu className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resource Footprint</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">1.84 GB</h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Cached analytical buffers
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600">
            <Sliders className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Actions and Sorting Controls Sub-Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-100 rounded-2xl shadow-xs">
        
        {/* Search Input Bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search panels or display targets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm font-medium rounded-full border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white transition-all"
          />
        </div>

        {/* Dynamic Horizontal Department Categorization Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full text-xs font-semibold text-slate-600">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  deptFilter === dept
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                {dept === "ALL" ? "All Departments" : dept}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Grid View of Configured Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPanels.length > 0 ? (
          filteredPanels.map((panel) => (
            <div 
              key={panel.id} 
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6 group hover:border-slate-200/80 transition-all"
            >
              {/* Card Meta & Header Structure */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded tracking-wide font-mono">
                      {panel.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors pt-1.5">
                      {panel.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400">{panel.department}</p>
                  </div>
                  
                  {/* Lifecyle Configuration Badges */}
                  <div>
                    {panel.status === "ACTIVE" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        Live Feed
                      </span>
                    )}
                    {panel.status === "DRAFT" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
                        Staged Draft
                      </span>
                    )}
                    {panel.status === "MAINTENANCE" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                        Config Lock
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-grid parameter description mapping */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/50 text-xs font-medium">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Display Target</p>
                    <p className="text-slate-700 font-semibold truncate flex items-center gap-1 mt-0.5">
                      <Monitor className="w-3 h-3 text-slate-400 shrink-0" /> {panel.targetDisplay}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Sync Details</p>
                    <p className="text-slate-700 font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" /> every {panel.refreshInterval} • <span className="text-slate-400 font-normal">{panel.lastSynced}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Operation Footer Action Control Panel Elements */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-xs font-semibold">
                <div className="flex items-center gap-4">
                  <div className="text-slate-500">
                    Analyzers Linked: <span className="font-bold text-slate-800">{panel.activeAnalyzers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-normal">System Overhead:</span>
                    <span className={`font-bold ${
                      panel.loadFactor === "High" ? "text-amber-600" : panel.loadFactor === "Normal" ? "text-emerald-600" : "text-slate-500"
                    }`}>
                      {panel.loadFactor}
                    </span>
                  </div>
                </div>

                {/* Action button triggers */}
                <div className="flex items-center gap-1.5">
                  <button className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 hover:text-slate-700 transition-colors cursor-pointer" title="Panel Settings">
                    <Settings2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="h-8 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer">
                    <span>Launch</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          ))
        ) : (
          /* Empty Data Warning Layout Container */
          <div className="col-span-1 lg:col-span-2 py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-white text-slate-400 font-medium italic flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-6 h-6 text-slate-300" />
            <span>No administrative interface display panels match your ongoing query constraints.</span>
          </div>
        )}
      </div>

    </div>
  );
}