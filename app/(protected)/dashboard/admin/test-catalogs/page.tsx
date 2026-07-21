// app/(dashboard)/admin/test-catalogs/page.tsx
"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Activity,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Edit2,
  AlertCircle,
  Beaker,
  ShieldCheck
} from "lucide-react";

// Mock Data for the Laboratory Test Catalog
const initialCatalogs = [
  {
    id: "TST-CBC",
    name: "Complete Blood Count (CBC)",
    shortName: "CBC with Differential",
    department: "Hematology",
    methodology: "Automated Impedance / Flow Cytometry",
    basePrice: 45.00,
    targetTat: "2 hours",
    status: "ACTIVE",
    specimenRequired: "Whole Blood (EDTA)"
  },
  {
    id: "TST-HBA1C",
    name: "Hemoglobin A1c (HbA1c)",
    shortName: "HbA1c Glycated Hemoglobin",
    department: "Biochemistry",
    methodology: "High-Performance Liquid Chromatography (HPLC)",
    basePrice: 65.00,
    targetTat: "4 hours",
    status: "ACTIVE",
    specimenRequired: "Whole Blood (EDTA)"
  },
  {
    id: "TST-LIPID",
    name: "Lipid Profile Panel",
    shortName: "Lipid Panel (Fasting)",
    department: "Biochemistry",
    methodology: "Spectrophotometry / Enzymatic Assay",
    basePrice: 80.00,
    targetTat: "3 hours",
    status: "ACTIVE",
    specimenRequired: "Serum"
  },
  {
    id: "TST-PCR-COVID",
    name: "SARS-CoV-2 Real-Time PCR",
    shortName: "COVID-19 RT-PCR",
    department: "Molecular Biology",
    methodology: "Qualitative Real-Time RT-PCR",
    basePrice: 120.00,
    targetTat: "6 hours",
    status: "INACTIVE",
    specimenRequired: "Nasopharyngeal Swab"
  },
  {
    id: "TST-URINE-RO",
    name: "Urinalysis Routine & Microscopic",
    shortName: "Urine R/E",
    department: "Urinalysis",
    methodology: "Automated Test Strip / Digital Microscopy",
    basePrice: 25.00,
    targetTat: "1.5 hours",
    status: "ACTIVE",
    specimenRequired: "Random Clean-Catch Urine"
  }
];

export default function TestCatalogsPage() {
  const [catalogs, setCatalogs] = useState(initialCatalogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<typeof initialCatalogs[0] | null>(null);

  // Filtering System Configuration
  const filteredCatalogs = catalogs.filter((test) => {
    const matchesSearch =
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.methodology.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = deptFilter === "ALL" || test.department === deptFilter;

    return matchesSearch && matchesDept;
  });

  const departments = ["ALL", "Hematology", "Biochemistry", "Molecular Biology", "Urinalysis"];

  const handleOpenEdit = (item: typeof initialCatalogs[0]) => {
    setEditingItem(item);
    setShowFormModal(true);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50/50 min-h-screen">
      
      {/* Upper Layout Branding / Interactive Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs tracking-wider uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Master Laboratory Compendium</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Test Catalog</h1>
          <p className="text-sm font-medium text-slate-500">
            Configure available diagnostic variables, base fee matrices, technical execution methods, and standard processing metrics.
          </p>
        </div>

        <button 
          onClick={() => { setEditingItem(null); setShowFormModal(true); }}
          className="h-11 px-5 bg-linear-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-semibold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/10 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Catalog Item</span>
        </button>
      </div>

      {/* Analytical Telemetry Dashboard Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric Widget 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Services Offered</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">142 Assays</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Online & orderable in EHR
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Beaker className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Widget 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Global Average Target TAT</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">3.2 hours</h3>
            <p className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" /> Standard deviation optimized
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Widget 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Financial Index Audit</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">$67.50 <span className="text-xs font-medium text-slate-400">avg</span></h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Base operational list cost
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* System Strip Action Filtering Interface Panels */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 border border-slate-100 rounded-2xl shadow-xs">
        
        {/* Search Parameter Context Box */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search test profiles, systems, methods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm font-medium rounded-full border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white transition-all"
          />
        </div>

        {/* Categorization Tab Navigation Links */}
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
                {dept === "ALL" ? "All Specialties" : dept}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Structural Layout Data Matrix Table View */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Assay Identification</th>
                <th className="py-4 px-6">Department & Method</th>
                <th className="py-4 px-6">Specimen Matrix</th>
                <th className="py-4 px-6 text-right">Base Listing Cost</th>
                <th className="py-4 px-6 text-center">Target TAT</th>
                <th className="py-4 px-6">State</th>
                <th className="py-4 px-6 text-center">Modify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredCatalogs.length > 0 ? (
                filteredCatalogs.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50/40 transition-colors group">
                    
                    {/* Col 1: Name and Index Identification info codes */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {test.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold text-[10px] font-mono">
                            {test.id}
                          </span>
                          <span className="truncate max-w-45">{test.shortName}</span>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Specialty / Methodology descriptors */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5 text-xs">
                        <p className="text-slate-800 font-bold">{test.department}</p>
                        <p className="text-slate-400 font-normal truncate max-w-55">{test.methodology}</p>
                      </div>
                    </td>

                    {/* Col 3: Bio Matrix Specimen collection properties */}
                    <td className="py-4 px-6 font-normal text-xs text-slate-500">
                      <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60 text-slate-600 font-medium text-[11px]">
                        {test.specimenRequired}
                      </span>
                    </td>

                    {/* Col 4: Base Pricing models */}
                    <td className="py-4 px-6 text-right font-bold text-slate-900">
                      ${test.basePrice.toFixed(2)}
                    </td>

                    {/* Col 5: Processing Turnaround times values */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {test.targetTat}
                      </span>
                    </td>

                    {/* Col 6: Deployment States badges */}
                    <td className="py-4 px-6">
                      {test.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3" /> Orderable
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                          <XCircle className="w-3 h-3" /> Suspended
                        </span>
                      )}
                    </td>

                    {/* Col 7: Edit Form drawer selectors handles controls */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(test)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Edit Configuration Data"
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
                /* Empty Dataset Response Visual Window Wrapper Container */
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium italic bg-slate-50/20">
                    No diagnostics catalog profiles found mapping the search criteria inputs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls Footer Navigation Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 bg-slate-50/30">
          <span>Showing {filteredCatalogs.length} of {catalogs.length} entries registered</span>
          <div className="flex items-center gap-2">
            <button disabled className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Previous</button>
            <button disabled className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Next</button>
          </div>
        </div>

      </div>

      {/* FORM OVERLAY INTERACTIVE DRAWER MODAL COMPONENT WINDOW GRID */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 border border-slate-100 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Drawer Banner Header info title */}
            <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingItem ? "Update Catalog Parameter" : "Register Diagnostic Profile"}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {editingItem ? `Editing active dataset for ${editingItem.id}` : "Initialize profile architecture records"}
                </p>
              </div>
            </div>

            {/* Modal Input Framework Grid Components UI */}
            <div className="space-y-4 text-xs font-bold text-slate-600">
              <div className="space-y-1">
                <label>Test Official Nomenclature / Primary Name</label>
                <input
                  type="text"
                  defaultValue={editingItem?.name || ""}
                  placeholder="e.g., Fasting Blood Glucose"
                  className="w-full h-10 px-3 font-medium border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label>Base Processing Price ($)</label>
                  <input
                    type="number"
                    defaultValue={editingItem?.basePrice || ""}
                    placeholder="0.00"
                    className="w-full h-10 px-3 font-medium border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label>Target Turnaround Time</label>
                  <input
                    type="text"
                    defaultValue={editingItem?.targetTat || ""}
                    placeholder="e.g., 2.5 hours"
                    className="w-full h-10 px-3 font-medium border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label>Technical Methodology / Device Array Setup</label>
                <input
                  type="text"
                  defaultValue={editingItem?.methodology || ""}
                  placeholder="e.g., Chemiluminescent Immunoassay (CLIA)"
                  className="w-full h-10 px-3 font-medium border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Modal Action Footnotes Controls Triggers Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50">
              <button
                onClick={() => setShowFormModal(false)}
                className="h-9 px-4 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
              >
                Dismiss View
              </button>
              <button
                onClick={() => setShowFormModal(false)}
                className="h-9 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors cursor-pointer shadow-xs"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}