import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function SignupPlaceholderPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-6">
        <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-xs animate-pulse">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Isolated Registry Protocols</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            Operator profile generation controls are isolated to explicit administrative routing nodes to avoid unauthorized environmental exposure.
          </p>
        </div>
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50/50 px-4 h-9 rounded-xl border border-blue-100/50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Entry Node Gate</span>
        </Link>
      </div>
    </div>
  );
}