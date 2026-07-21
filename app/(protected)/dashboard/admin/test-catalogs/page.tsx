"use client";

import React, { useState } from "react";
import { testCatalogService } from "@/services/test-catalog.service";
import { TestCatalogItem } from "@/types/test-catalog.types";
import TestCatalogForm from "./_components/TestCatalogForm";
import EditTestCatalog from "./_components/EditTestCatalog";
import { Search, Plus, Edit2, Loader2, FlaskConical, Clock, DollarSign } from "lucide-react";

export default function TestCatalogPage() {
  const [deptId, setDeptId] = useState("");
  const [catalogs, setCatalogs] = useState<TestCatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TestCatalogItem | null>(null);

  const fetchCatalogs = async (idToFetch?: string) => {
    const queryId = idToFetch || deptId;
    if (!queryId.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await testCatalogService.getCatalogByDeptId(queryId);
      if (res.success) {
        setCatalogs(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch test catalog:", err);
      setCatalogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCatalogs();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Test Catalog Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">View and manage diagnostic laboratory test catalogs</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Test Catalog
        </button>
      </div>

      {/* Filter / Search Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            placeholder="Enter Department ID (e.g. DEPT-BIO)..."
            className="w-full h-10 pl-10 pr-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !deptId.trim()}
          className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Fetch Catalog"}
        </button>
      </form>

      {/* Table Data */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Catalog ID</th>
                <th className="px-5 py-3.5">Test Code</th>
                <th className="px-5 py-3.5">Test Name</th>
                <th className="px-5 py-3.5">Sample Type</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Turnaround Time</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
                    Loading catalog items...
                  </td>
                </tr>
              ) : catalogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FlaskConical className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    {searched ? "No test catalog items found for this department." : "Enter a Department ID above to view catalog tests."}
                  </td>
                </tr>
              ) : (
                catalogs.map((item) => (
                  <tr key={item.test_catalog_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-slate-500">{item.test_catalog_id}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{item.test_code}</td>
                    <td className="px-5 py-3.5">{item.test_name}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px] font-semibold">
                        {item.sample_type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-emerald-600 font-bold">
                      <span className="flex items-center gap-0.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        {item.test_price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {item.turnaround_time} hrs
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Item"
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
        <TestCatalogForm
          defaultDeptId={deptId}
          onSuccess={() => fetchCatalogs()}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingItem && (
        <EditTestCatalog
          item={editingItem}
          onSuccess={() => fetchCatalogs()}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}