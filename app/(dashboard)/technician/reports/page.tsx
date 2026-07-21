// app/(dashboard)/technician/reports/page.tsx
"use client";

import React, { useState } from "react";
import { Loader2, FileSpreadsheet, Search } from "lucide-react";

import { reportService } from "@/services/report.service";
import { Report } from "@/types/report.types";

import ReportForm from "./_components/ReportForm";
import EditReport from "./_components/EditReport";
import ReportPrint from "./_components/ReportPrint";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [visitIdInput, setVisitIdInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = async (targetId: string) => {
    if (!targetId.trim()) return;
    setIsLoading(true);
    try {
      const response = await reportService.getReportsByVisitId(targetId.trim());
      if (response.success) {
        setReports(response.data);
        setActiveQuery(targetId.trim());
      }
    } catch (error) {
      console.error("Critical tracking collection extraction processing broken:", error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(visitIdInput);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            Diagnostic Reporting Matrix
          </h1>
          <p className="text-xs text-slate-500">
            Provisioning framework verifying records indexing arrays across structural workflows.
          </p>
        </div>
        <ReportForm defaultVisitId={activeQuery} onSuccess={() => fetchReports(activeQuery)} />
      </div>

      <form onSubmit={handleSearchTrigger} className="flex items-center gap-2 max-w-md bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 flex-1 px-2 text-slate-400">
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="text"
            value={visitIdInput}
            onChange={(e) => setVisitIdInput(e.target.value)}
            placeholder="Search by exact Visit Mapping ID..."
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
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Extracting related payload data arrays...</p>
          </div>
        ) : !activeQuery ? (
          <div className="text-center p-16 text-slate-400 text-xs font-medium">
            Please input an active Visit Identifier sequence above to execute indexing rules.
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center p-16 text-slate-400 text-xs font-medium">
            No active metrics data sheets located inside tracking context for this entity.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-4">Report Reference</th>
                  <th className="p-4">Visit Map Link</th>
                  <th className="p-4">Workflow Phase</th>
                  <th className="p-4">Storage File Target</th>
                  <th className="p-4">Generation Stamps</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{report.report_no}</td>
                    <td className="p-4 font-mono text-slate-500 text-[11px]">{report.visit_id}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        report.status === "verified" || report.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : report.status === "cancelled"
                          ? "bg-rose-50 text-rose-700 border border-rose-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {report.status || "draft"}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400 text-[11px] max-w-xs truncate">
                      {report.pdf_path || "Unassigned Repository Path"}
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="text-slate-500 font-mono text-[11px]">{report.generated_at}</div>
                      <div className="text-slate-400 text-[10px]">Author: {report.generated_by}</div>
                    </td>
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      <ReportPrint reportId={report.id} reportNo={report.report_no} />
                      <EditReport report={report} onSuccess={() => fetchReports(activeQuery)} />
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