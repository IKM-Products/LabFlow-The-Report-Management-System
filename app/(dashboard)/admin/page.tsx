"use client";

import React from "react";
import { 
  BarChart3, 
  Users, 
  FlaskConical, 
  TrendingUp, 
  AlertTriangle,
  Building2,
  CalendarCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock metrics mapping your core database tables (visits, order_items, users, etc.)
const METRICS = [
  { title: "Active Visits", value: "128", trend: "+12%", icon: CalendarCheck, color: "text-blue-600" },
  { title: "Total Revenue", value: "Rs. 2,45,000", trend: "+8.2%", icon: TrendingUp, color: "text-emerald-600" },
  { title: "Pending Results", value: "42", trend: "Alert", icon: AlertTriangle, color: "text-rose-600" },
  { title: "Registered Doctors", value: "85", trend: "+3", icon: Users, color: "text-violet-600" },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Executive Header */}
      <div>
        <h1 className="text-3xl font-serif font-normal italic tracking-tight text-neutral-900">
          Executive Overview
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Monitor real-time laboratory performance, financial indices, and operational bottlenecks.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((stat, index) => (
          <Card key={index} className="rounded-2xl border-neutral-200/60 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
              <p className={`text-[10px] font-bold mt-1 ${stat.trend === "Alert" ? "text-rose-600" : "text-emerald-600"}`}>
                {stat.trend} from last cycle
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Visualization Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl border-neutral-200/60 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-neutral-700">Departmental Throughput</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center border-2 border-dashed border-neutral-100 rounded-xl m-6 text-neutral-400 text-sm">
            [Integrated Bar/Line Chart component mapping visit counts per department]
          </CardContent>
        </Card>

        {/* Quick Actions / Recent Activity */}
        <Card className="rounded-2xl border-neutral-200/60 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-neutral-700">Quick System Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Configure Catalog", icon: FlaskConical },
              { label: "Update Lab Metadata", icon: Building2 },
              { label: "Generate Analytics Report", icon: BarChart3 },
            ].map((action, i) => (
              <button 
                key={i} 
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left group"
              >
                <div className="p-2 rounded-lg bg-neutral-100 text-neutral-500 group-hover:bg-emerald-50 group-hover:text-emerald-600">
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-neutral-700">{action.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}