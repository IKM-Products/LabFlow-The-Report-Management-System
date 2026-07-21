"use client";

import React from "react";
import RoleForm from "./_components/RoleForm";
import { ShieldCheck, Info } from "lucide-react";

export default function AdminRolesGovernancePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            Identity Matrix Framework & Access Layouts
          </h1>
          <p className="text-xs text-slate-500">Inject security tokens mapping permissions across tracking workflows</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <RoleForm />
        </div>
        
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-3 items-start">
          <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-blue-900">Topology Specifications</h4>
            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
              Roles created through this controller interface map permissions explicitly across environmental access contexts. Avoid redundant tokens to limit configuration overlapping anomalies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}