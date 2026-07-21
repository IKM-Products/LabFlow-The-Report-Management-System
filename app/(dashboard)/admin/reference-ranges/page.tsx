// app/(dashboard)/admin/reference-ranges/page.tsx
"use client";

import React, { useState } from "react";
import {
  Scale,
  Plus,
  Search,
  FlaskConical,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  History,
  MoreVertical,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Dna
} from "lucide-react";

// Mock Data for Laboratory Test Reference Ranges
const initialRanges = [
  {
    id: "REF-HGB",
    analyteName: "Hemoglobin (HGB)",
    department: "Hematology",
    specimenType: "Whole Blood (EDTA)",
    gender: "MALE",
    ageRange: "Adult (18-65y)",
    normalRange: "13.8 - 17.2",
    criticalLow: "< 11.0",
    criticalHigh: "> 20.0",
    unit: "g/dL",
    status: "VERIFIED"
  },
  {
    id: "REF-HGB-F",
    analyteName: "Hemoglobin (HGB)",
    department: "Hematology",
    specimenType: "Whole Blood (EDTA)",
    gender: "FEMALE",
    ageRange: "Adult (18-65y)",
    normalRange: "12.1 - 15.1",
    criticalLow: "< 10.0",
    criticalHigh: "> 18.0",
    unit: "g/dL",
    status: "VERIFIED"
  },
  {
    id: "REF-CRE",
    analyteName: "Serum Creatinine",
    department: "Biochemistry",
    specimenType: "Serum",
    gender: "UNIVERSAL",
    ageRange: "Adult (>12y)",
    normalRange: "0.74 - 1.35",
    criticalLow: "No baseline",
    criticalHigh: "> 2.00",
    unit: "mg/dL",
    status: "VERIFIED"
  },
  {
    id: "REF-TSH",
    analyteName: "Thyroid Stimulating Hormone (TSH)",
    department: "Immunology",
    specimenType: "Serum/Plasma",
    gender: "UNIVERSAL",
    ageRange: "Adult (>18y)",
    normalRange: "0.45 - 4.50",
    criticalLow: "< 0.10",
    criticalHigh: "> 10.00",
    unit: "mIU/L",
    status: "PENDING_REVIEW"
  },
  {
    id: "REF-WBC",
    analyteName: "White Blood Cell Count (WBC)",
    department: "Hematology",
    specimenType: "Whole Blood (EDTA)",
    gender: "UNIVERSAL",
    ageRange: "Adult (>18y)",
    normalRange: "4.5 - 11.0",
    criticalLow: "< 2.0",
    criticalHigh: "> 30.0",
    unit: "x10^3/µL",
    status: "VERIFIED"
  }
];

export default function ReferenceRangesPage() {
  const [ranges, setRanges] = useState(initialRanges);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState<typeof initialRanges[0] | null>(null);

  // Filter evaluation matrix
  const filteredRanges = ranges.filter((item) => {
    const matchesSearch =
      item.analyteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = deptFilter === "ALL" || item.department === deptFilter;

    return matchesSearch && matchesDept;
  });

  const departments = ["ALL", "Hematology", "Biochemistry", "Immunology"];

  const handleOpenEdit = (rangeItem: typeof initialRanges[0]) => {
    setSelectedRange(rangeItem);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50/50 min-h-screen">
      
      {/* Upper Navigation / Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs tracking-wider uppercase">
            <Scale className="w-3.5 h-3.5" />
            <span>Pathology Core Index</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reference Ranges</h1>
          <p className="text-sm font-medium text-slate-500">
            Establish expected biometric thresholds, flag limits, and diagnostic criteria configurations.
          </p>
        </div>

        <button className="h-11 px-5 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 text-white font-semibold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/10 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Add New Matrix</span>
        </button>
      </div>

      {/* Statistical Metric Overview Summary Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Active Analytes</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">184 Parameters</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Fully mapped variables
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <FlaskConical className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Expert Reviews</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">3 Profiles</h3>
            <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Awaiting sign-off validation
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Trigger Audits</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">100% Secure</h3>
            <p className="text-[11px] text-slate-400 font-medium">
              EHR panic alerts linked active
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Control Filters Strip */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-100 rounded-2xl shadow-xs">
        
        {/* Live Search Form Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search analyte or system ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm font-medium rounded-full border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white transition-all"
          />
        </div>

        {/* Sorting Categories Navigation Tab Strip */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full text-xs font-semibold text-slate-600">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  deptFilter === dept
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                {dept === "ALL" ? "All Sections" : dept}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Core Reference Ranges Data Table Layer */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Analyte / Variable</th>
                <th className="py-4 px-6">Demographic Profile</th>
                <th className="py-4 px-6 text-center">Standard Baseline Range</th>
                <th className="py-4 px-6 text-center text-rose-600">Panic Thresholds</th>
                <th className="py-4 px-6">Indexing State</th>
                <th className="py-4 px-6 text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredRanges.length > 0 ? (
                filteredRanges.map((range) => (
                  <tr key={range.id} className="hover:bg-slate-50/40 transition-colors group">
                    
                    {/* Column 1: Analyte info */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {range.analyteName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold text-[10px] font-mono">
                            {range.id}
                          </span>
                          <span>{range.specimenType}</span>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Demographic Rule Profile mapping */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5 text-xs">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                          range.gender === "MALE" ? "bg-blue-50 text-blue-700" :
                          range.gender === "FEMALE" ? "bg-pink-50 text-pink-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {range.gender}
                        </span>
                        <p className="text-slate-400 font-normal pt-0.5">{range.ageRange}</p>
                      </div>
                    </td>

                    {/* Column 3: Biometric Target values ranges */}
                    <td className="py-4 px-6 text-center">
                      <div className="inline-block bg-slate-50 border border-slate-100 px-3 py-1 rounded-xl">
                        <span className="font-bold text-slate-800">{range.normalRange}</span>
                        <span className="text-slate-400 text-xs font-normal ml-1">{range.unit}</span>
                      </div>
                    </td>

                    {/* Column 4: Panic and High Variant Bounds */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2 text-xs text-center">
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-100/60">
                          Low: {range.criticalLow}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-100/60">
                          High: {range.criticalHigh}
                        </span>
                      </div>
                    </td>

                    {/* Column 5: Deployment Life Cycle State */}
                    <td className="py-4 px-6">
                      {range.status === "VERIFIED" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100 animate-pulse">
                          <History className="w-3 h-3" /> Evaluating
                        </span>
                      )}
                    </td>

                    {/* Column 6: Edit Trigger Node Handle */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(range)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Modify Reference Bounds"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                /* Empty Dataset Response Matrix Container */
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium italic bg-slate-50/20">
                    No biometric reference profiles match your search criteria queries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Sub-Footer Panel Strip */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 bg-slate-50/30">
          <span>Showing {filteredRanges.length} of {ranges.length} mapped variables</span>
          <div className="flex items-center gap-2">
            <button disabled className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Previous</button>
            <button disabled className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Next</button>
          </div>
        </div>

      </div>

      {/* MODAL WINDOW INTERACTIVE DRAW LAYOUT SUB-SYSTEM */}
      {showEditModal && selectedRange && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 border border-slate-100 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Dna className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Modify Calibration Thresholds</h3>
                <p className="text-xs text-slate-400 font-medium">Configuring rules architecture for {selectedRange.analyteName}</p>
              </div>
            </div>

            {/* Modal Inputs Framework */}
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-600">
              <div className="space-y-1">
                <label>Normal Bounds Lower Target</label>
                <input 
                  type="text" 
                  defaultValue={selectedRange.normalRange.split(" - ")[0]} 
                  className="w-full h-10 px-3 font-medium border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label>Normal Bounds Upper Target</label>
                <input 
                  type="text" 
                  defaultValue={selectedRange.normalRange.split(" - ")[1]} 
                  className="w-full h-10 px-3 font-medium border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label>Panic Low Rule Filter</label>
                <input 
                  type="text" 
                  defaultValue={selectedRange.criticalLow} 
                  className="w-full h-10 px-3 font-medium border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label>Panic High Rule Filter</label>
                <input 
                  type="text" 
                  defaultValue={selectedRange.criticalHigh} 
                  className="w-full h-10 px-3 font-medium border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900"
                />
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50">
              <button
                onClick={() => setShowEditModal(false)}
                className="h-9 px-4 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
              >
                Cancel Re-calibration
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="h-9 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
              >
                Commit Variable Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}