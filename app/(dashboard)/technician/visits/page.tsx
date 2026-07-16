// app/dashboard/technician/visits/page.tsx

"use client";

import React, { useState } from "react";
import { Loader2, Search, CalendarDays, Contact2 } from "lucide-react";

import { visitService } from "@/services/visit.service";
import { VisitListItem } from "@/types/visit.types";

import VisitForm from "./_components/VisitForm";
import EditVisit from "./_components/EditVisit";

export default function VisitsPage() {
  const [visits, setVisits] = useState<VisitListItem[]>([]);
  const [patientQueryInput, setPatientQueryInput] = useState("");
  const [activeQueryKey, setActiveQueryKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const executeDataRetrievalPipeline = async (targetPatientId: string) => {
    if (!targetPatientId.trim()) return;
    setIsLoading(true);
    try {
      const response = await visitService.getVisitsByPatientId(targetPatientId.trim());
      if (response.success) {
        setVisits(response.data);
        setActiveQueryKey(targetPatientId.trim());
      }
    } catch (error) {
      console.error("Critical tracking collection extraction processing broken:", error);
      setVisits([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeDataRetrievalPipeline(patientQueryInput);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2 tracking-tight">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            Encounter Admission Registry Ledger
          </h1>
          <p className="text-xs text-slate-500">
            Query and catalog active institutional consultations mapping dynamic patient diagnostic streams.
          </p>
        </div>
        <VisitForm defaultPatientId={activeQueryKey} onSuccess={() => executeDataRetrievalPipeline(activeQueryKey)} />
      </div>

      <form onSubmit={handleQueryFormSubmit} className="flex items-center gap-2 max-w-md bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 flex-1 px-2 text-slate-400">
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="text"
            value={patientQueryInput}
            onChange={(e) => setPatientQueryInput(e.target.value)}
            placeholder="Search encounter history by Patient ID sequence..."
            className="w-full text-xs text-slate-900 bg-transparent border-none outline-hidden placeholder:text-slate-400"
          />
        </div>
        <button type="submit" disabled={isLoading} className="bg-slate-900 hover:bg-slate-800 text-white px-3 h-8 text-[11px] font-bold rounded-lg transition-colors shadow-xs disabled:opacity-50">
          Search Ledger
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-400 font-medium tracking-wide">Syncing encounter datasets...</p>
          </div>
        ) : !activeQueryKey ? (
          <div className="flex flex-col items-center justify-center text-center p-16 text-slate-400 text-xs font-medium gap-2">
            <Contact2 className="h-8 w-8 text-slate-300 stroke-1" />
            Supply a valid Patient Reference tracking key to load active encounter registries.
          </div>
        ) : visits.length === 0 ? (
          <div className="text-center p-16 text-slate-400 text-xs font-medium">
            No matching record structures located for the selected patient entity matrix.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-4">Visit Number</th>
                  <th className="p-4">Subject identity</th>
                  <th className="p-4">Attending Practitioner</th>
                  <th className="p-4">Encounter Tracking Status</th>
                  <th className="p-4">Telemetry Timeline</th>
                  <th className="p-4 text-right">Actions Matrix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {visits.map((visit) => (
                  <tr key={visit.visit_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{visit.visit_no}</td>
                    <td className="p-4 font-medium text-slate-800">{visit.patient_name}</td>
                    <td className="p-4 font-medium text-slate-700">{visit.doctor_name}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        visit.status === "completed"
                          ? "bg-slate-50 text-slate-600 border-slate-200"
                          : visit.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100 animate-pulse"
                          : visit.status === "cancelled"
                          ? "bg-rose-50 text-rose-700 border-rose-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {visit.status || "registered"}
                      </span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="text-slate-400 font-mono text-[10px]">{visit.visit_date}</div>
                      <div className="text-slate-500 font-medium text-[10px]">Logged by: {visit.registered_by}</div>
                    </td>
                    <td className="p-4 text-right">
                      {/* Passing active tracking fields to satisfy dependency architecture metrics parameters cleanly */}
                      <EditVisit 
                        visit={visit} 
                        initialPatientId={activeQueryKey} 
                        initialDoctorId="SYSTEM_REF" 
                        onSuccess={() => executeDataRetrievalPipeline(activeQueryKey)} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}