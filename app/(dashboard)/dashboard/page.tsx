"use client";

import { useSession } from "next-auth/react";
import React from "react";

export default function DashboardLayoutEntry() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="h-6 w-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif italic text-neutral-900">Welcome Back, Operator</h1>
        <p className="text-xs font-sans font-bold text-neutral-400 uppercase tracking-widest mt-1">
          Authorized Stream: {session?.user?.email} ({session?.user?.role})
        </p>
      </div>

      {/* Grid analytics framework layout container block metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-neutral-200/60 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Queue Status</span>
          <h3 className="text-xl font-serif italic text-neutral-800 mt-0.5">Pending Samples</h3>
          <p className="text-4xl font-black text-emerald-600 mt-2">12</p>
        </div>
      </div>
    </div>
  );
}