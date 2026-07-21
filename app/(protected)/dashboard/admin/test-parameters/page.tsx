// app/(dashboard)/admin/test-parameters/page.tsx
"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Search,
  Sliders,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Edit2,
  MoreVertical,
  Activity,
  Binary,
  FileText,
  BookmarkCheck
} from "lucide-react";

// Mock Data for Diagnostic Test Component Parameters
const initialParameters = [
  {
    id: "PAR-HGB",
    name: "Hemoglobin Concentration",
    parentTest: "Complete Blood Count (CBC)",
    valueType: "NUMERIC",
    unitOfMeasure: "g/dL",
    loincCode: "718-7",
    defaultValue: "---",
    status: "ACTIVE"
  },
  {
    id: "PAR-WBC",
    name: "White Blood Cell Count",
    parentTest: "Complete Blood Count (CBC)",
    valueType: "NUMERIC",
    unitOfMeasure: "x10^3/µL",
    loincCode: "6690-2",
    defaultValue: "---",
    status: "ACTIVE"
  },
  {
    id: "PAR-PLT",
    name: "Platelet Count",
    parentTest: "Complete Blood Count (CBC)",
    valueType: "NUMERIC",
    unitOfMeasure: "x10^3/µL",
    loincCode: "777-3",
    defaultValue: "---",
    status: "ACTIVE"
  },
  {
    id: "PAR-HBA1C",
    name: "HbA1c Fraction",
    parentTest: "Hemoglobin A1c (HbA1c)",
    valueType: "NUMERIC",
    unitOfMeasure: "%",
    loincCode: "4548-4",
    defaultValue: "---",
    status: "ACTIVE"
  },
  {
    id: "PAR-UR-GLU",
    name: "Urine Glucose Level",
    parentTest: "Urinalysis Routine",
    valueType: "QUALITATIVE",
    unitOfMeasure: "N/A",
    loincCode: "5792-7",
    defaultValue: "Negative",
    status: "ACTIVE"
  },
  {
    id: "PAR-MIC-BACT",
    name: "Microscopic Bacteria Observation",
    parentTest: "Urinalysis Routine",
    valueType: "TEXT / NARRATIVE",
    unitOfMeasure: "N/A",
    loincCode: "5799-2",
    defaultValue: "None Observed",
    status: "PENDING_VALIDATION"
  }
];

export default function TestParametersPage() {
  const [parameters, setParameters] = useState(initialParameters);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedParam, setSelectedParam] = useState<typeof initialParameters[0] | null>(null);

  // Sorting and Filtering Matrix Evaluator
  const filteredParameters = parameters.filter((param) => {
    const matchesSearch =
      param.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      param.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      param.parentTest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      param.loincCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "ALL" || param.valueType === typeFilter;

    return matchesSearch && matchesType;
  });

  const valueTypes = ["ALL", "NUMERIC", "QUALITATIVE", "TEXT / NARRATIVE"];

  const handleOpenEdit = (paramItem: typeof initialParameters[0]) => {
    setSelectedParam(paramItem);
    setShowModal(true);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50/50 min-h-screen">
      
      {/* Upper branding layout / Primary system navigation header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs tracking-wider uppercase">
            <Layers className="w-3.5 h-3.5" />
            <span>Granular Lab Component Matrix</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Test Parameters</h1>
          <p className="text-sm font-medium text-slate-500">
            Define individual observation fields, variable constraints, metric units, and LOINC data interoperability standards.
          </p>
        </div>

        <button 
          onClick={() => { setSelectedParam(null); setShowModal(true); }}
          className="h-11 px-5 bg-linear-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-semibold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/10 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Configure Variable</span>
        </button>
      </div>

      {/* Operational Analytical Context Grid Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric Card 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Mapped Fields</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">412 Variables</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> System pipelines connected
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Sliders className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quantitative Fields</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">320 Metrics</h3>
            <p className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
              <Binary className="w-3 h-3" /> Bound to mathematical ranges
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interoperability Audit</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">98.4% LOINC</h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Standardized coding mapping rate
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Filtration Tools Control Element Strip */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-100 rounded-2xl shadow-xs">
        
        {/* Dynamic Parameter Search Processing */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search variables, profiles, LOINC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm font-medium rounded-full border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white transition-all"
          />
        </div>

        {/* Data Architecture Filter Controls tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full text-xs font-semibold text-slate-600">
            {valueTypes.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  typeFilter === type
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                {type === "ALL" ? "All Formats" : type}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Central Architecture Elements Data Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Observation Field</th>
                <th className="py-4 px-6">Parent Directory Profile</th>
                <th className="py-4 px-6">Data Format</th>
                <th className="py-4 px-6">Unit Mapping</th>
                <th className="py-4 px-6 font-mono text-center">LOINC ID</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Modify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredParameters.length > 0 ? (
                filteredParameters.map((param) => (
                  <tr key={param.id} className="hover:bg-slate-50/40 transition-colors group">
                    
                    {/* Column 1: Core Attribute nomenclature descriptor elements */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {param.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold font-mono">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 text-[10px]">
                            {param.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Structural context configuration */}
                    <td className="py-4 px-6 font-semibold text-slate-600">
                      {param.parentTest}
                    </td>

                    {/* Column 3: Format configurations UI state metrics */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                        param.valueType === "NUMERIC" ? "bg-blue-50 text-blue-700 border-blue-100" :
                        param.valueType === "QUALITATIVE" ? "bg-purple-50 text-purple-700 border-purple-100" :
                        "bg-amber-50 text-amber-800 border-amber-100"
                      }`}>
                        {param.valueType}
                      </span>
                    </td>

                    {/* Column 4: Scale evaluation metadata */}
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {param.unitOfMeasure === "N/A" ? (
                        <span className="text-slate-300 italic font-normal text-xs">Dimensionless</span>
                      ) : (
                        <span className="font-mono bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded text-slate-700 text-xs font-bold">
                          {param.unitOfMeasure}
                        </span>
                      )}
                    </td>

                    {/* Column 5: Healthcare systems structural LOINC standards code */}
                    <td className="py-4 px-6 text-center font-mono text-xs font-bold text-slate-900 bg-slate-50/30">
                      {param.loincCode}
                    </td>

                    {/* Column 6: System state controls markers */}
                    <td className="py-4 px-6">
                      {param.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" /> Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200 animate-pulse">
                          <SlidersHorizontal className="w-3 h-3" /> Validation
                        </span>
                      )}
                    </td>

                    {/* Column 7: Operational data row modification handles */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(param)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Edit Technical Scope Configuration"
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
                /* Empty Dataset Matrix Component Grid Fallback Window UI */
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium italic bg-slate-50/20">
                    No diagnostic testing component variables matches the filter queries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Operational Control Footnote Data Status Bar Wrapper */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 bg-slate-50/30">
          <span>Displaying {filteredParameters.length} of {parameters.length} analytical attributes</span>
          <div className="flex items-center gap-2">
            <button disabled className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Previous</button>
            <button disabled className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Next</button>
          </div>
        </div>

      </div>

      {/* OVERLAY INTERACTIVE SLIDEOVER SUB-MODAL COMPONENT DATA LAYOUT */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 border border-slate-100 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Heading Elements info banners */}
            <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedParam ? "Modify Field Constraints" : "Map New Diagnostic Variable"}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {selectedParam ? `Editing system structures for variable identifier ${selectedParam.id}` : "Configure analytical parameters profiles fields mappings records"}
                </p>
              </div>
            </div>

            {/* Modal Matrix Configuration Form Grid Structure Fields input */}
            <div className="space-y-4 text-xs font-bold text-slate-600">
              <div className="space-y-1">
                <label>Official Variable Component Name</label>
                <input
                  type="text"
                  defaultValue={selectedParam?.name || ""}
                  placeholder="e.g., Absolute Lymphocyte Count"
                  className="w-full h-10 px-3 font-medium border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label>Standardized LOINC Code Mapping</label>
                  <input
                    type="text"
                    defaultValue={selectedParam?.loincCode || ""}
                    placeholder="e.g., 26474-7"
                    className="w-full h-10 px-3 font-medium border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label>Unit of Measure Representation</label>
                  <input
                    type="text"
                    defaultValue={selectedParam?.unitOfMeasure || ""}
                    placeholder="e.g., mg/dL, %"
                    className="w-full h-10 px-3 font-medium border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label>Standard Default Reference Placeholder Value</label>
                <input
                  type="text"
                  defaultValue={selectedParam?.defaultValue || ""}
                  placeholder="e.g., Negative, ---"
                  className="w-full h-10 px-3 font-medium border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Modal Window Drawer Trigger Controls Buttons elements */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50">
              <button
                onClick={() => setShowModal(false)}
                className="h-9 px-4 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
              >
                Dismiss Settings
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="h-9 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
              >
                Save System Settings
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}