"use client";

import React from "react";
import { 
  ClipboardList, 
  Clock, 
  FileText, 
  FlaskConical, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock operational metrics with premium design styling maps
const TECH_METRICS = [
  { title: "Pending Orders", value: "18", trend: "Needs attention", icon: ClipboardList, color: "text-amber-600 bg-amber-500/10 border-amber-500/20" },
  { title: "Completed Today", value: "34", trend: "Steady running", icon: CheckCircle, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  { title: "TAT Alerts", value: "3", trend: "Urgent action", icon: AlertCircle, color: "text-rose-600 bg-rose-500/10 border-rose-500/20" },
  { title: "Active Samples", value: "22", trend: "In processing", icon: FlaskConical, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
];

export default function TechnicianDashboardPage() {
  return (
    // Compensate padding-left on mobile for the floating action menu switch button space
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-10 font-sans pl-20 md:pl-10 selection:bg-green-800 selection:text-white">
      
      {/* Page Layout Header Architecture */}
      <div className="border-b border-stone-200/60 pb-6 select-none">
        <span className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1.5">
          System Core Viewport
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tight text-stone-800 font-mono sm:text-3xl">
          Operations Hub
        </h1>
        <p className="text-xs text-stone-500 font-medium mt-1">
          Monitor your active queues, pending results, and real-time laboratory processing targets.
        </p>
      </div>

      {/* Metrics Data View Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TECH_METRICS.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="rounded-2xl border-stone-200/80 bg-white shadow-xs overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:border-stone-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-[10px] font-black uppercase tracking-wider text-stone-400 font-sans">
                  {stat.title}
                </CardTitle>
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${stat.color} transition-transform duration-300 group-hover:scale-105`}>
                  <Icon className="h-4 w-4 stroke-[2.5]" />
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="text-3xl font-black tracking-tight text-stone-800 font-mono">{stat.value}</div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-1 h-1 rounded-full bg-stone-300 animate-pulse" />
                  <p className="text-[10px] font-bold text-stone-500 tracking-wide uppercase">{stat.trend}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Primary Workflow Access & Event Triggers Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Workflows Routing Card Block */}
        <Card className="rounded-2xl border-stone-200/80 bg-white shadow-xs lg:col-span-5 flex flex-col justify-between">
          <CardHeader className="border-b border-stone-100/80 pb-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              Quick Workflow Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5 flex-1">
            <Link href="/technician/order-queue" className="block group">
              <Button 
                variant="outline" 
                className="w-full justify-between h-16 rounded-xl text-left border-stone-200 bg-white text-stone-700 px-5 text-xs font-bold tracking-wider uppercase shadow-xs transition-all duration-200 group-hover:border-green-600/30 group-hover:bg-green-50/30 cursor-pointer"
              >
                <span>View Order Queue</span>
                <ClipboardList className="h-4 w-4 text-stone-400 group-hover:text-green-700 transition-colors" />
              </Button>
            </Link>
            <Link href="/technician/reports" className="block group">
              <Button 
                variant="outline" 
                className="w-full justify-between h-16 rounded-xl text-left border-stone-200 bg-white text-stone-700 px-5 text-xs font-bold tracking-wider uppercase shadow-xs transition-all duration-200 group-hover:border-green-600/30 group-hover:bg-green-50/30 cursor-pointer"
              >
                <span>Verification & Printing</span>
                <FileText className="h-4 w-4 text-stone-400 group-hover:text-green-700 transition-colors" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Real-time Logger Stream Activities Container */}
        <Card className="rounded-2xl border-stone-200/80 bg-white shadow-xs lg:col-span-7">
          <CardHeader className="border-b border-stone-100/80 pb-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-stone-400">
              Recent Activity Stream
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-stone-100/80 pt-2">
            {[
              { time: "10 min ago", action: "Result verified for patient: John Doe" },
              { time: "45 min ago", action: "Sample accessioned for order: #9902" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 items-center py-4 first:pt-2 last:pb-2 group">
                <div className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-center shrink-0">
                  <Clock className="h-3.5 w-3.5 text-stone-400 group-hover:text-stone-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-700 truncate">{activity.action}</p>
                  <p className="text-[10px] text-stone-400 font-mono mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}