"use client";

import React, { useState } from "react";
import { referenceRangeService } from "@/services/reference-range.service";
import { ReferenceRangeItem } from "@/types/reference-range.types";
import ReferenceRangeForm from "./_components/ReferenceRangeForm";
import EditReferenceRange from "./_components/EditReferenceRange";
import { Search, Plus, Edit2, Loader2, Gauge, UserCheck, FileText } from "lucide-react";

export default function ReferenceRangePage() {
  const [parameterId, setParameterId] = useState("");
  const [references, setReferences] = useState<ReferenceRangeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ReferenceRangeItem | null>(null);

  const fetchReferences = async (idToFetch?: string) => {
    const queryId = idToFetch || parameterId;
    if (!queryId.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await referenceRangeService.getReferenceByParameterId(queryId);
      if (res.success) {
        setReferences(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch reference ranges:", err);
      setReferences([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReferences();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Reference Range Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure normal reference values and ranges based on age and gender
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Reference Range
        </button>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={parameterId}
            onChange={(e) => setParameterId(e.target.value)}
            placeholder="Enter Test Parameter ID (e.g. PRM-HB)..."
            className="w-full h-10 pl-10 pr-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !parameterId.trim()}
          className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch Ranges"}
        </button>
      </form>

      {/* Table Data */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Reference ID</th>
                <th className="px-5 py-3.5">Gender</th>
                <th className="px-5 py-3.5">Age Range</th>
                <th className="px-5 py-3.5">Normal Value Range</th>
                <th className="px-5 py-3.5">Text Range</th>
                <th className="px-5 py-3.5">Note</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
                    Loading reference ranges...
                  </td>
                </tr>
              ) : references.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Gauge className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    {searched
                      ? "No reference ranges found for this parameter ID."
                      : "Enter a Test Parameter ID above to view reference ranges."}
                  </td>
                </tr>
              ) : (
                references.map((item) => (
                  <tr key={item.ref_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-slate-500">{item.ref_id}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold flex items-center gap-1 w-fit">
                        <UserCheck className="w-3 h-3 text-slate-500" />
                        {item.gender}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono">{item.age || "All ages"}</td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600 font-mono">{item.value || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-600">{item.text_range || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate" title={item.note}>
                      {item.note ? (
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3 shrink-0 text-slate-400" />
                          {item.note}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Reference Range"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <ReferenceRangeForm
          defaultParameterId={parameterId}
          onSuccess={() => fetchReferences()}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingItem && (
        <EditReferenceRange
          item={editingItem}
          onSuccess={() => fetchReferences()}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}