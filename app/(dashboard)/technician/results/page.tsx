// app/dashboard/technician/results/page.tsx

"use client";

import React, { useState } from "react";
import { Loader2, Search, Layers, ClipboardList } from "lucide-react";

import { resultService } from "@/services/result.service";
import { ResultItem } from "@/types/result.types";

import ResultForm from "./_components/ResultForm";
import EditResult from "./_components/EditResult";

export default function ResultsPage() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [orderQueryInput, setOrderQueryInput] = useState("");
  const [activeQueryKey, setActiveQueryKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const executeDataRetrievalPipeline = async (targetOrderId: string) => {
    if (!targetOrderId.trim()) return;
    setIsLoading(true);
    try {
      const response = await resultService.getResultsByOrderId(targetOrderId.trim());
      if (response.success) {
        setResults(response.data);
        setActiveQueryKey(targetOrderId.trim());
      }
    } catch (error) {
      console.error("Critical tracking collection extraction processing broken:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeDataRetrievalPipeline(orderQueryInput);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2 tracking-tight">
            <Layers className="h-5 w-5 text-blue-600" />
            Clinical Analysis Ledger Matrix
          </h1>
          <p className="text-xs text-slate-500">
            Verify and catalog multi-parameter quantitative telemetry entries indexing transactional workflows.
          </p>
        </div>
        <ResultForm defaultOrderId={activeQueryKey} onSuccess={() => executeDataRetrievalPipeline(activeQueryKey)} />
      </div>

      <form onSubmit={handleQueryFormSubmit} className="flex items-center gap-2 max-w-md bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 flex-1 px-2 text-slate-400">
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="text"
            value={orderQueryInput}
            onChange={(e) => setOrderQueryInput(e.target.value)}
            placeholder="Execute search query by Work Order Reference ID..."
            className="w-full text-xs text-slate-900 bg-transparent border-none outline-hidden placeholder:text-slate-400"
          />
        </div>
        <button type="submit" disabled={isLoading} className="bg-slate-900 hover:bg-slate-800 text-white px-3 h-8 text-[11px] font-bold rounded-lg transition-colors shadow-xs disabled:opacity-50">
          Query Map
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-400 font-medium tracking-wide">Extracting verified dataset arrays...</p>
          </div>
        ) : !activeQueryKey ? (
          <div className="flex flex-col items-center justify-center text-center p-16 text-slate-400 text-xs font-medium gap-2">
            <ClipboardList className="h-8 w-8 text-slate-300 stroke-1" />
            Please supply a valid operational Work Order tracking sequence to build indexing matrices.
          </div>
        ) : results.length === 0 ? (
          <div className="text-center p-16 text-slate-400 text-xs font-medium">
            No tracked data telemetry payloads located within index for entity match sequence.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-4">Parameter Ref</th>
                  <th className="p-4">Result Metric</th>
                  <th className="p-4">Operational Severity Flag</th>
                  <th className="p-4">Clinical Observations / Remarks</th>
                  <th className="p-4">Tracking Stamps</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {results.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{item.parameter_id}</td>
                    <td className="p-4 font-medium text-slate-800">{item.result_value}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        item.flag === "normal"
                          ? "bg-slate-50 text-slate-600 border-slate-200"
                          : item.flag === "critical"
                          ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {item.flag || "normal"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 max-w-xs truncate">{item.remarks}</td>
                    <td className="p-4 space-y-0.5">
                      <div className="text-slate-400 font-mono text-[10px]">{item.performed_at}</div>
                      <div className="text-slate-500 font-medium text-[10px]">Verifier: {item.verified_by}</div>
                    </td>
                    <td className="p-4 text-right">
                      <EditResult result={item} onSuccess={() => executeDataRetrievalPipeline(activeQueryKey)} />
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