// app/(dashboard)/admin/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Stethoscope,
  Building2,
  TestTubes,
  Loader2,
  Plus,
  Activity,
  CheckCircle2,
  Clock,
  RefreshCw,
  FlaskConical
} from "lucide-react";

interface DashboardCounts {
  doctors: number;
  departments: number;
  labs: number;
  users: number;
}

interface ActivityItem {
  id: string;
  action: string;
  target: string;
  category: "doctor" | "department" | "lab" | "user" | "system";
  timestamp: string;
  status: "completed" | "pending" | "info";
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<DashboardCounts>({
    doctors: 0,
    departments: 0,
    labs: 0,
    users: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Fetch live stats from API endpoints
  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      const [doctorsRes, departmentsRes, labsRes, usersRes] = await Promise.allSettled([
        fetch("/api/doctors"),
        fetch("/api/departments"),
        fetch("/api/labs"),
        fetch("/api/users"),
      ]);

      const parseCount = async (res: PromiseSettledResult<Response>) => {
        if (res.status === "fulfilled" && res.value.ok) {
          const data = await res.value.json();
          if (Array.isArray(data)) return data.length;
          if (typeof data?.count === "number") return data.count;
          if (typeof data?.total === "number") return data.total;
          if (Array.isArray(data?.data)) return data.data.length;
        }
        return 0;
      };

      const doctorsCount = await parseCount(doctorsRes);
      const departmentsCount = await parseCount(departmentsRes);
      const labsCount = await parseCount(labsRes);
      const usersCount = await parseCount(usersRes);

      setCounts({
        doctors: doctorsCount,
        departments: departmentsCount,
        labs: labsCount,
        users: usersCount,
      });
    } catch (error) {
      console.error("Failed to load dashboard metrics:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardStats();
  };

  // Dynamic Overview Stats
  const stats = [
    {
      label: "Doctors",
      value: counts.doctors,
      icon: Stethoscope,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Departments",
      value: counts.departments,
      icon: Building2,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      label: "Laboratories",
      value: counts.labs,
      icon: FlaskConical,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label: "Active Users",
      value: counts.users,
      icon: Users,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  // Recent system activity audit log
  const recentActivities: ActivityItem[] = [
    {
      id: "act-1",
      action: "New Department Registered",
      target: "Haematology Wing B",
      category: "department",
      timestamp: "10 mins ago",
      status: "completed",
    },
    {
      id: "act-2",
      action: "Doctor Profile Updated",
      target: "Dr. Sarah Jenkins",
      category: "doctor",
      timestamp: "45 mins ago",
      status: "completed",
    },
    {
      id: "act-3",
      action: "User Credentials Granted",
      target: "lab_tech_north",
      category: "user",
      timestamp: "5 hours ago",
      status: "completed",
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      
      {/* Header & Global Refresh Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Summary of system activity and key metrics.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={isLoading || isRefreshing}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-2xs cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Quick Administrative Action Bar */}
      <div className="bg-linear-to-r from-emerald-700 to-teal-700 rounded-2xl p-6 text-white shadow-lg space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-lg font-bold">Quick Actions</h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">Quickly add new entries to the system.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10 pt-1">
          <Link
            href="/dashboard/admin/doctors"
            className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold transition-all group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add Doctor</span>
          </Link>

          <Link
            href="/dashboard/admin/departments"
            className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold transition-all group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <span>Add Department</span>
          </Link>

          <Link
            href="/dashboard/admin/labs"
            className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold transition-all group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-4 h-4" />
            </div>
            <span>Configure Lab</span>
          </Link>

          <Link
            href="/dashboard/admin/users"
            className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold transition-all group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <span>Register User</span>
          </Link>
        </div>
      </div>

      {/* Primary Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  ) : (
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  )}
                </div>
              </div>
              <div className={`p-3.5 rounded-xl border ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit Trail & Recent Operational Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">Recent System Activity</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Last updated</span>
        </div>

        <div className="space-y-4">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-lg bg-white border border-slate-200 text-emerald-600 shadow-2xs">
                  {act.category === "doctor" && <Stethoscope className="w-4 h-4 text-blue-600" />}
                  {act.category === "department" && <Building2 className="w-4 h-4 text-purple-600" />}
                  {act.category === "lab" && <TestTubes className="w-4 h-4 text-amber-600" />}
                  {act.category === "user" && <Users className="w-4 h-4 text-emerald-600" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{act.action}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{act.target}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {act.timestamp}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}