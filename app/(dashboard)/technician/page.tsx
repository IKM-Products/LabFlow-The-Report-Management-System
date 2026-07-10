"use client";

import React from "react";
import { 
  Activity, 
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

// Mock operational metrics
const TECH_METRICS = [
  { title: "Pending Orders", value: "18", trend: "Needs attention", icon: ClipboardList, color: "text-amber-600" },
  { title: "Completed Today", value: "34", trend: "Steady", icon: CheckCircle, color: "text-emerald-600" },
  { title: "TAT Alerts", value: "3", trend: "Urgent", icon: AlertCircle, color: "text-rose-600" },
  { title: "Active Samples", value: "22", trend: "Processing", icon: FlaskConical, color: "text-blue-600" },
];

export default function TechnicianDashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-serif">Operations Hub</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Monitor your active queues, pending results, and daily processing targets.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TECH_METRICS.map((stat, index) => (
          <Card key={index} className="rounded-2xl border-neutral-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-[10px] font-bold text-neutral-500 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-neutral-700">Quick Workflow Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/technician/order-queue">
              <Button variant="outline" className="w-full justify-between h-14 rounded-xl text-left border-neutral-200 hover:border-emerald-200 hover:bg-emerald-50">
                <span>View Order Queue</span>
                <ClipboardList className="h-4 w-4 text-emerald-600" />
              </Button>
            </Link>
            <Link href="/technician/reports">
              <Button variant="outline" className="w-full justify-between h-14 rounded-xl text-left border-neutral-200 hover:border-emerald-200 hover:bg-emerald-50">
                <span>Verification & Printing</span>
                <FileText className="h-4 w-4 text-emerald-600" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-neutral-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-neutral-700">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { time: "10 min ago", action: "Result verified for patient: John Doe" },
              { time: "45 min ago", action: "Sample accessioned for order: #9902" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 items-start text-sm">
                <Clock className="h-4 w-4 text-neutral-400 mt-0.5" />
                <div>
                  <p className="text-neutral-900 font-medium">{activity.action}</p>
                  <p className="text-xs text-neutral-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}