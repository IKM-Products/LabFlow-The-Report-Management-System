"use client";

import React, { useState } from "react";
import { testParameterService } from "@/services/test-parameter.service";
import { TestParameterItem } from "@/types/test-parameter.types";
import TestParameterForm from "./_components/TestParameterForm";
import EditTestParameter from "./_components/EditTestParameter";
import { Search, Plus, Edit2, Loader2, Sliders, Hash, Tag } from "lucide-react";

export default function TestParametersPage() {
  const [testId, setTestId] = useState("");
  const [parameters, setParameters] = useState<TestParameterItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TestParameterItem | null>(null);

  const fetchParameters = async (idToFetch?: string) => {
    const queryId = idToFetch || testId;
    if (!queryId.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await testParameterService.getParametersByTestId(queryId);
      if (res.success) {
        setParameters(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch test parameters:", err);
      setParameters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchParameters();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Test Parameter Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure result fields, units, and parameters for diagnostic tests
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Parameter
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
            value={testId}
            onChange={(e) => setTestId(e.target.value)}
            placeholder="Enter Test Catalog ID (e.g. TST-CBC)..."
            className="w-full h-10 pl-10 pr-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !testId.trim()}
          className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch Parameters"}
        </button>
      </form>

      {/* Table Data */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 w-16">Seq #</th>
                <th className="px-5 py-3.5">Parameter ID</th>
                <th className="px-5 py-3.5">Parameter Name</th>
                <th className="px-5 py-3.5">Result Type</th>
                <th className="px-5 py-3.5">Unit</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
                    Loading parameters...
                  </td>
                </tr>
              ) : parameters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Sliders className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    {searched
                      ? "No test parameters found for this Test Catalog ID."
                      : "Enter a Test Catalog ID above to view parameters."}
                  </td>
                </tr>
              ) : (
                parameters.map((item) => (
                  <tr key={item.parameter_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 font-bold text-[11px] flex items-center justify-center">
                        #{item.sequence_no}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500">{item.parameter_id}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{item.parameter_name}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[11px] font-semibold flex items-center gap-1 w-fit border border-emerald-100">
                        <Tag className="w-3 h-3" />
                        {item.result_type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600">{item.unit || "—"}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Parameter"
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
        <TestParameterForm
          defaultTestId={testId}
          nextSequenceNo={parameters.length + 1}
          onSuccess={() => fetchParameters()}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingItem && (
        <EditTestParameter
          item={editingItem}
          onSuccess={() => fetchParameters()}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}