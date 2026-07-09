"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

// Matching schema: 'departments'
interface Department {
  id: number;
  name: string;
  description?: string;
}

// Matching schema: 'test_catalog' & 'panels'
interface CatalogItem {
  id: number;
  name: string;
  code: string;
  sample_type: string;
  price: number;
  turnaround_hours: number;
  is_active: boolean;
  department_id: number;
  type: "single" | "panel";
}

export default function TestCatalogPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [selectedDept, setSelectedDept] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalogData() {
      try {
        setIsLoading(true);
        const [deptData, catalogData] = await Promise.all([
          apiClient<Department[]>("/departments"),
          apiClient<CatalogItem[]>("/test-catalog"),
        ]);
        setDepartments(deptData);
        setCatalog(catalogData);
      } catch (err: any) {
        setError(err.message || "Failed to load test catalog options.");
      } finally {
        setIsLoading(false);
      }
    }
    loadCatalogData();
  }, []);

  // Filter matrix execution
  const filteredCatalog = catalog.filter((item) => {
    const matchesDept = selectedDept === "all" || item.department_id === selectedDept;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Catalog</h1>
          <p className="text-sm text-muted-foreground">Manage departments, active panel builds, and parameter listings</p>
        </div>
      </div>

      {/* Filter and Search Bar Ecosystem */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search test name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid Inventory Layout */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-muted-foreground font-medium">
                <th className="p-4">Code</th>
                <th className="p-4">Test/Panel Name</th>
                <th className="p-4">Sample Specimen</th>
                <th className="p-4">TAT</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCatalog.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No active tests found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredCatalog.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-xs text-primary">{item.code}</td>
                    <td className="p-4">
                      <div>
                        <span className="font-medium text-foreground">{item.name}</span>
                        <span className={`ml-2 inline-block text-[10px] uppercase font-extrabold px-1.5 py-px rounded ${
                          item.type === "panel" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {item.type}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground capitalize">{item.sample_type}</td>
                    <td className="p-4">{item.turnaround_hours} hrs</td>
                    <td className="p-4 font-medium">Rs. {item.price}</td>
                    <td className="p-4">
                      <span className={`inline-block h-2 w-2 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-zinc-300"}`} />
                      <span className="ml-2 text-xs capitalize text-muted-foreground">
                        {item.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}