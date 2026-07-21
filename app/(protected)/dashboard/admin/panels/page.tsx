"use client";

import React, { useState } from "react";
import { panelService } from "@/services/panel.service";
import { PanelListItem } from "@/types/panel.types";
import PanelForm from "./_components/PanelForm";
import EditPanel from "./_components/EditPanel";
import PanelComponentForm from "./_components/PanelComponentForm";
import { 
  FlaskConical, 
  Search, 
  Plus, 
  Edit3, 
  Layers, 
  Loader2, 
  AlertCircle,
  FolderSearch
} from "lucide-react";

export default function PanelsPage() {
  const [deptIdSearch, setDeptIdSearch] = useState("");
  const [activeDeptId, setActiveDeptId] = useState("");
  const [panels, setPanels] = useState<PanelListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals state management
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPanelForEdit, setSelectedPanelForEdit] = useState<PanelListItem | null>(null);
  const [selectedPanelForCatalog, setSelectedPanelForCatalog] = useState<PanelListItem | null>(null);

  const fetchPanels = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await panelService.getPanelsByDeptId(idToFetch.trim());
      if (response.success) {
        setPanels(response.data || []);
        setActiveDeptId(idToFetch.trim());
      }
    } catch (err: any) {
      setPanels([]);
      setErrorMsg(Array.isArray(err) ? err.join(", ") : err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPanels(deptIdSearch);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600" />
            Lab Panels Management
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Search panels by Department ID and manage associated test catalogs.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="h-10 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Create New Panel
        </button>
      </div>

      {/* Department Search Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={deptIdSearch}
            onChange={(e) => setDeptIdSearch(e.target.value)}
            placeholder="Enter Department ID (e.g. DEPT-01)"
            className="w-full h-10 pl-10 pr-4 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !deptIdSearch.trim()}
          className="h-10 px-5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch Panels"}
        </button>
      </form>

      {/* Error View */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Panels Data Table View */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-xs font-medium">Fetching panels matrix...</span>
          </div>
        ) : panels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
            <FolderSearch className="w-8 h-8 text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">
              {activeDeptId ? `No panels found for department "${activeDeptId}"` : "Enter a Department ID above to view panel records."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Panel ID</th>
                  <th className="py-3.5 px-6">Code</th>
                  <th className="py-3.5 px-6">Panel Name</th>
                  <th className="py-3.5 px-6">Dept ID</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {panels.map((panel) => (
                  <tr key={panel.panel_id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">{panel.panel_id}</td>
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-mono text-[10px]">
                        {panel.panel_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">{panel.panel_name}</td>
                    <td className="py-3.5 px-6 text-slate-400">{panel.dept_id}</td>
                    <td className="py-3.5 px-6 font-semibold text-emerald-600">${panel.panel_price.toFixed(2)}</td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedPanelForCatalog(panel)}
                          className="px-3 h-8 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          Components
                        </button>
                        <button
                          onClick={() => setSelectedPanelForEdit(panel)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Panel"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals Mounting */}
      {isCreateOpen && (
        <PanelForm
          defaultDeptId={activeDeptId}
          onSuccess={() => activeDeptId && fetchPanels(activeDeptId)}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {selectedPanelForEdit && (
        <EditPanel
          panel={selectedPanelForEdit}
          onSuccess={() => activeDeptId && fetchPanels(activeDeptId)}
          onClose={() => setSelectedPanelForEdit(null)}
        />
      )}

      {selectedPanelForCatalog && (
        <PanelComponentForm
          panelId={selectedPanelForCatalog.panel_id}
          panelName={selectedPanelForCatalog.panel_name}
          onClose={() => setSelectedPanelForCatalog(null)}
        />
      )}
    </div>
  );
}