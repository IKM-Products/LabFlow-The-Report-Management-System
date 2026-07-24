"use client";

import React from "react";
import UserForm from "./_components/UserForm";

export default function AdminUsersGovernancePage() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Operator Profile Provisioning Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Deploy and configure functional cryptographic system operators accessing local network target nodes.
          </p>
        </div>
      </div>

      <div className="max-w-3xl">
        <UserForm />
      </div>
    </div>
  );
}