// app/(dashboard)/admin/panel-components/page.tsx
"use client";

import React, { useState } from "react";
import {
  Layers,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FlaskConical,
  Info,
  Sliders,
  Sparkles,
  Terminal,
  TrendingUp,
  ShieldCheck,
  Eye
} from "lucide-react";

export default function PanelComponentsPage() {
  const [activeTab, setActiveTab] = useState("cards");
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50/50 min-h-screen">
      
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs tracking-wider uppercase">
          <Layers className="w-3.5 h-3.5" />
          <span>System Design System</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Panel Components</h1>
        <p className="text-sm font-medium text-slate-500">
          A centralized reference playground for LabFlow's modular layouts, interactive widgets, and unified status indicators.
        </p>
      </div>

      {/* Interface Tab Controllers */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold overflow-x-auto pb-px">
        {[
          { id: "cards", label: "Analytical Widgets" },
          { id: "badges", label: "Status Indicators" },
          { id: "alerts", label: "System Feedback" },
          { id: "specialized", label: "Lab Specifics" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-600 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-600 font-medium"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Panels */}
      <div className="space-y-6">
        
        {/* TAB 1: CARD COMPONENT VARIANTS */}
        {activeTab === "cards" && (
          <div className="space-y-6">
            <div className="bg-white p-5 border border-slate-100 rounded-xl">
              <h3 className="text-sm font-bold text-slate-800 mb-1">Telemetry & Metric Configurations</h3>
              <p className="text-xs text-slate-400 font-medium">Standard data widgets built to track linear operations and volumetric statistics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Variant A: Metric with Positive Trend Indicator */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs relative overflow-hidden group">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Turnaround Delta</p>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">24.8 min</h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3" /> -12% optimized
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Variant B: Interactive Focus Component */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between group">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Device Calibration</p>
                    <h4 className="font-bold text-slate-900">Beckman Coulter A1</h4>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50 animate-pulse" />
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Next Routine: 48h</span>
                  <button 
                    onClick={() => setShowDemoModal(true)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect Matrix
                  </button>
                </div>
              </div>

              {/* Variant C: Warning/Threshold State Card */}
              <div className="bg-white border border-amber-100 rounded-2xl p-6 shadow-xs relative overflow-hidden bg-linear-to-br from-white to-amber-50/20">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Critical Inventory Alert</p>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">3 Reagents</h3>
                    <p className="text-xs text-amber-600 font-medium">Approaching minimum reserve capacities.</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STATUS BADGE PILLS */}
        {activeTab === "badges" && (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">System Wide Lifecycle Badges</h3>
              <p className="text-xs text-slate-400 font-medium">Uniform state indicator badges for tracking records, orders, samples, and users.</p>
            </div>

            <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 bg-slate-50/20">
              {/* Row 1 */}
              <div className="p-4 sm:flex items-center justify-between gap-4">
                <div className="space-y-0.5 mb-2 sm:mb-0">
                  <p className="text-sm font-semibold text-slate-800">Success / Completed State</p>
                  <p className="text-xs text-slate-400">Used when a pipeline resolves normally without pathology warnings.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Pass
                </span>
              </div>
              
              {/* Row 2 */}
              <div className="p-4 sm:flex items-center justify-between gap-4">
                <div className="space-y-0.5 mb-2 sm:mb-0">
                  <p className="text-sm font-semibold text-slate-800">Pending / Processing Queue</p>
                  <p className="text-xs text-slate-400">Indicates an ongoing calculation or background validation loop.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                  <Clock className="w-3.5 h-3.5" /> Analysis Queued
                </span>
              </div>

              {/* Row 3 */}
              <div className="p-4 sm:flex items-center justify-between gap-4">
                <div className="space-y-0.5 mb-2 sm:mb-0">
                  <p className="text-sm font-semibold text-slate-800">Alert / Pathological Flag State</p>
                  <p className="text-xs text-slate-400">Indicates metrics out of biological reference bounds or failure thresholds.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Variant
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ALERTS & SYSTEM FEEDBACK */}
        {activeTab === "alerts" && (
          <div className="space-y-6">
            {/* Inline Banner Informational */}
            <div className="p-4 border border-blue-100 bg-blue-50/40 text-blue-800 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold">Scheduled Server Synchronization</p>
                <p className="text-xs text-blue-600 font-medium">
                  Central pathology indices will perform a scheduled data synchronization sequence at 02:00 UTC. Expect transient lag profiles during structural re-indexing.
                </p>
              </div>
            </div>

            {/* Terminal Command Utility Strip */}
            <div className="p-5 bg-slate-950 text-slate-100 rounded-xl border border-slate-900 font-mono text-xs space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-500 font-bold">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                  <span>LabFlow Micro-Kernel Shell</span>
                </div>
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded">v4.2.0-prod</span>
              </div>
              <p className="text-slate-400"><span className="text-emerald-500">lf-admin$</span> system-check --environment production</p>
              <p className="text-emerald-400">✓ Cryptographic connection links verified with cloud database vault.</p>
              <p className="text-emerald-400">✓ All 12 peripheral automated analyzers sending baseline heartbeat metrics.</p>
            </div>
          </div>
        )}

        {/* TAB 4: LABORATORY SPECIFIC COMPONENTS */}
        {activeTab === "specialized" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Component: Lab Specimen Progress Matrix */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Sample Tracking Bar</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Batch #B-90412</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  EDTA-TUBE
                </span>
              </div>

              {/* Visual Multi-step Progression Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span className="text-emerald-600">Accessioning</span>
                  <span className="text-emerald-600">Centrifugation</span>
                  <span className="text-slate-700">Analyzer Run</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500 w-1/3 border-r border-white" />
                  <div className="h-full bg-emerald-500 w-1/3 border-r border-white animate-pulse" />
                  <div className="h-full bg-slate-200 w-1/3" />
                </div>
              </div>
            </div>

            {/* Component: Compliance Framework Signature Stamp */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Validation Protocol Verification</span>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Confirms that all data objects render matching standard ISO 15189 compliance architecture before direct dispatch to electronic medical records integrations.
                </p>
              </div>
              
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex items-center justify-between text-xs font-semibold text-slate-500">
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Validated Cryptographically By</p>
                  <p className="text-slate-700 font-bold">LabFlow Automated Gatekeeper</p>
                </div>
                <span className="bg-emerald-100/60 text-emerald-800 px-2 py-1 rounded font-mono text-[10px] border border-emerald-200">
                  SECURE SIGN-OFF
                </span>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL SIMULATOR POPUP BACKDROP */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-slate-100 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Modal Matrix Simulator</h3>
                <p className="text-xs text-slate-400 font-medium">Standard popover panel variant layout.</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              This structural element triggers when contextual deep dives, record editing pipelines, or administrative authorization credentials overrides are required by users.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowDemoModal(false)}
                className="h-9 px-4 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
              >
                Dismiss View
              </button>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="h-9 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
              >
                Commit Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}