"use client";

import React from "react";
import UserForm from "./_components/UserForm";
import { Users2 } from "lucide-react";

export default function AdminUsersGovernancePage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Users2 className="h-4 w-4 text-blue-600" />
          Operator Profile Provisioning Ledger
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Deploy and configure functional cryptographic system operators accessing local network target nodes.
        </p>
      </div>

      <div className="max-w-3xl">
        <UserForm />
      </div>
    </div>
  );
}