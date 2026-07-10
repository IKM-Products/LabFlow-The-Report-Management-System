"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Search, 
  Printer, 
  CheckCircle2, 
  Calendar,
  Eye,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data reflecting the 'reports' table and link to 'visits'
const MOCK_REPORTS = [
  { id: "REP-2026-001", patient: "John Doe", visit_id: 101, date: "2026-07-08", status: "Verified", technician: "Tech A" },
  { id: "REP-2026-002", patient: "Jane Smith", visit_id: 102, date: "2026-07-09", status: "Printed", technician: "Tech B" },
  { id: "REP-2026-003", patient: "Ram Bahadur", visit_id: 103, date: "2026-07-10", status: "Draft", technician: "Tech A" },
];

export default function ReportsRegistryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = MOCK_REPORTS.filter(report => 
    report.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Reports Registry</h1>
          <p className="text-sm text-neutral-500">Archive of finalized diagnostics and print history</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
          <FileText className="mr-2 h-4 w-4" /> New Batch Export
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400" />
          <Input 
            placeholder="Search by Report ID or Patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 bg-white border-neutral-200 rounded-xl"
          />
        </div>
        <Button variant="outline" className="h-11 rounded-xl px-4">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50/70 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase">
            <tr>
              <th className="px-6 py-4">Report ID</th>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Date Finalized</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-neutral-50/50">
                <td className="px-6 py-4 font-mono font-medium">{report.id}</td>
                <td className="px-6 py-4 text-neutral-900 font-semibold">{report.patient}</td>
                <td className="px-6 py-4 text-neutral-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neutral-400" /> {report.date}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={report.status === "Verified" ? "default" : "secondary"}>
                    {report.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-emerald-600">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-emerald-600">
                    <Printer className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}