"use client";

import React from "react";
import { 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Users2, 
  SlidersHorizontal, 
  Database, 
  BarChart3 
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen w-full bg-[#F4F2EC] text-stone-900 font-sans selection:bg-green-800 selection:text-white antialiased relative overflow-hidden flex flex-col p-6 sm:p-10 md:p-12">
      
      {/* Premium Ambient Background Textures */}
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-100/40 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[30%] w-[50vw] h-[50vw] bg-amber-100/30 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* DYNAMIC CONTENT WORKSPACE HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 mb-8 border-b border-stone-200/60 relative z-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-stone-900 font-normal tracking-tight">
            Executive <span className="italic">Overview</span>
          </h1>
          <p className="text-xs text-stone-400 tracking-wide font-light max-w-xl">
            Monitor real-time laboratory performance, financial indices, and operational bottlenecks.
          </p>
        </div>

        {/* User Account Capsule Menu */}
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-stone-200/50 p-2 pl-4 pr-3.5 rounded-2xl shadow-xs">
          <div className="text-right">
            <span className="block text-[10px] font-black uppercase tracking-wider text-stone-400 leading-none">User</span>
            <span className="text-xs font-medium text-stone-700">karkianish873@gmail.com</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#F4F2EC] border border-stone-200 flex items-center justify-center font-mono font-bold text-xs text-stone-600">
            U
          </div>
        </div>
      </header>

      {/* FOUR CARD METRIC ROW GRID SEGMENT */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8 relative z-10">
        {[
          { label: "Active Visits", val: "128", stat: "+12% from last cycle", icon: Calendar, accent: "text-blue-600 bg-blue-50 border-blue-100/50", trendUp: true },
          { label: "Total Revenue", val: "Rs. 2,45,000", stat: "+8.2% from last cycle", icon: TrendingUp, accent: "text-emerald-600 bg-emerald-50 border-emerald-100/50", trendUp: true },
          { label: "Pending Results", val: "42", stat: "Alert from last cycle", icon: AlertTriangle, accent: "text-rose-600 bg-rose-50 border-rose-100/50", trendUp: false },
          { label: "Registered Doctors", val: "85", stat: "+3 from last cycle", icon: Users2, accent: "text-purple-600 bg-purple-50 border-purple-100/50", trendUp: true },
        ].map((card, i) => (
          <div key={i} className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 border border-stone-200/40 shadow-[0_10px_30px_rgba(15,55,30,0.02)] space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400 block">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${card.accent}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-serif text-stone-900 font-normal tracking-tight">{card.val}</h3>
              <p className={`text-[11px] font-bold tracking-wide ${card.trendUp ? "text-emerald-600" : "text-rose-600"}`}>
                {card.stat}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* BOTTOM TWIN-COLUMN INTERFACE SECTION GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start relative z-10">
        
        {/* Department Throughput Chart Box (Takes 2 Columns) */}
        <div className="xl:col-span-2 bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(15,55,30,0.03)] border border-stone-200/50 space-y-6">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">Departmental Throughput</h4>
            <div className="h-px w-full bg-stone-100" />
          </div>
          
          {/* Visual Canvas Block */}
          <div className="h-72 border-2 border-dashed border-stone-200/70 rounded-2xl flex items-center justify-center bg-stone-50/50 p-6">
            <span className="text-xs text-stone-400 font-mono tracking-wider text-center max-w-sm">
              [Integrated Bar/Line Chart component mapping visit counts per department]
            </span>
          </div>
        </div>

        {/* Quick System Actions Column */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(15,55,30,0.03)] border border-stone-200/50 space-y-6">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">Quick System Actions</h4>
            <div className="h-px w-full bg-stone-100" />
          </div>

          {/* Actions Menu Stack */}
          <div className="space-y-3">
            {[
              { title: "Configure Catalog", icon: SlidersHorizontal },
              { title: "Update Lab Metadata", icon: Database },
              { title: "Generate Analytics Report", icon: BarChart3 },
            ].map((act, idx) => (
              <button
                key={idx}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-stone-200/60 bg-stone-50/40 hover:bg-white hover:border-green-700/40 hover:shadow-md transition-all text-left cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-green-700 group-hover:border-green-100 transition-colors shrink-0">
                  <act.icon className="h-4 w-4 stroke-[1.8]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 group-hover:text-stone-900 transition-colors">
                  {act.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}