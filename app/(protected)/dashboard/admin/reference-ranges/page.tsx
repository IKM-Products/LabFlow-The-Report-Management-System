"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Edit2,
  Loader2,
  AlertCircle,
  ShieldAlert,
  RefreshCw,
  UserCheck,
  FileText,
  Building2,
  BookOpen,
  SlidersHorizontal,
} from "lucide-react";

import { referenceRangeService } from "@/services/reference-range.service";
import { departmentService } from "@/services/department.service";
import { testCatalogService } from "@/services/test-catalog.service";
import { testParameterService } from "@/services/test-parameter.service";

import { ReferenceRangeItem } from "@/types/reference-range.types";
import ReferenceRangeForm from "./_components/ReferenceRangeForm";
import EditReferenceRange from "./_components/EditReferenceRange";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Option Types ---
interface DepartmentOption {
  id: string;
  name: string;
}

interface TestCatalogOption {
  id: string;
  departmentId?: string;
  name: string;
}

interface ParameterOption {
  id: string;
  catalogId?: string;
  name: string;
}

// Helper to safely extract arrays from flat OR deeply nested API responses
const extractArrayData = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res)) return res;

  if (typeof res === "object") {
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.catalogs)) return res.catalogs;
    if (Array.isArray(res.testCatalogs)) return res.testCatalogs;
    if (Array.isArray(res.departments)) return res.departments;
    if (Array.isArray(res.parameters)) return res.parameters;
    if (Array.isArray(res.testParameters)) return res.testParameters;
    if (Array.isArray(res.items)) return res.items;
    if (Array.isArray(res.result)) return res.result;

    if (res.data && typeof res.data === "object") {
      if (Array.isArray(res.data.catalogs)) return res.data.catalogs;
      if (Array.isArray(res.data.testCatalogs)) return res.data.testCatalogs;
      if (Array.isArray(res.data.departments)) return res.data.departments;
      if (Array.isArray(res.data.parameters)) return res.data.parameters;
      if (Array.isArray(res.data.testParameters)) return res.data.testParameters;
      if (Array.isArray(res.data.items)) return res.data.items;
      if (Array.isArray(res.data.result)) return res.data.result;
    }
  }

  return [];
};

export default function ReferenceRangePage() {
  // Cascading Dropdown Selection States
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedCatalog, setSelectedCatalog] = useState<string>("");
  const [parameterId, setParameterId] = useState<string>("");

  // Options List States
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [availableCatalogs, setAvailableCatalogs] = useState<TestCatalogOption[]>([]);
  const [availableParameters, setAvailableParameters] = useState<ParameterOption[]>([]);

  // Dropdown Loading States
  const [loadingDepartments, setLoadingDepartments] = useState<boolean>(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState<boolean>(false);
  const [loadingParameters, setLoadingParameters] = useState<boolean>(false);

  // Main Table & Editing States
  const [references, setReferences] = useState<ReferenceRangeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<ReferenceRangeItem | null>(null);

  // Get current parameter name
  const selectedParamName = availableParameters.find((p) => p.id === parameterId)?.name || parameterId;

  // --- 1. Fetch Departments on Mount ---
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const res = await departmentService.getDepartments();
        const list = extractArrayData(res);
        setDepartments(
          list.map((dept: any, index: number) => ({
            id: String(
              dept.id ??
              dept.dept_id ??
              dept.department_id ??
              dept.deptId ??
              dept.departmentId ??
              dept._id ??
              index
            ),
            name:
              dept.name ||
              dept.dept_name ||
              dept.department_name ||
              dept.deptName ||
              dept.departmentName ||
              "Unnamed Department",
          }))
        );
      } catch (err: any) {
        console.error("Failed to fetch departments:", err);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // --- 2. Fetch Catalogs when Department changes ---
  useEffect(() => {
    if (!selectedDepartment) {
      setAvailableCatalogs([]);
      setSelectedCatalog("");
      setParameterId("");
      return;
    }

    const fetchCatalogs = async () => {
      setLoadingCatalogs(true);
      try {
        const res = await testCatalogService.getCatalogByDeptId(selectedDepartment);
        const list = extractArrayData(res);

        setAvailableCatalogs(
          list.map((cat: any, index: number) => ({
            id: String(
              cat.id ??
              cat.catalog_id ??
              cat.catalogId ??
              cat.test_catalog_id ??
              cat.testCatalogId ??
              cat.test_id ??
              cat.testId ??
              cat.code ??
              cat._id ??
              index
            ),
            name:
              cat.name ||
              cat.catalog_name ||
              cat.catalogName ||
              cat.test_name ||
              cat.testName ||
              cat.title ||
              "Unnamed Test",
          }))
        );
      } catch (err: any) {
        console.error("Failed to fetch test catalogs:", err);
        setAvailableCatalogs([]);
      } finally {
        setLoadingCatalogs(false);
      }
    };

    fetchCatalogs();
    setSelectedCatalog("");
    setParameterId("");
  }, [selectedDepartment]);

  // --- 3. Fetch Parameters when Catalog changes ---
  useEffect(() => {
    if (!selectedCatalog) {
      setAvailableParameters([]);
      setParameterId("");
      return;
    }

    const fetchParameters = async () => {
      setLoadingParameters(true);
      try {
        const res = await testParameterService.getParametersByTestId(selectedCatalog);
        const list = extractArrayData(res);

        setAvailableParameters(
          list.map((param: any, index: number) => ({
            id: String(
              param.id ??
              param.parameter_id ??
              param.parameterId ??
              param.param_id ??
              param.paramId ??
              param.test_parameter_id ??
              param.testParameterId ??
              param.code ??
              param._id ??
              index
            ),
            name:
              param.name ||
              param.parameter_name ||
              param.parameterName ||
              param.param_name ||
              param.paramName ||
              param.title ||
              "Unnamed Parameter",
          }))
        );
      } catch (err: any) {
        console.error("Failed to fetch parameters:", err);
        setAvailableParameters([]);
      } finally {
        setLoadingParameters(false);
      }
    };

    fetchParameters();
    setParameterId("");
  }, [selectedCatalog]);

  // --- 4. Fetch Reference Ranges when Parameter changes ---
  const fetchReferences = useCallback(async (idToFetch?: string) => {
    const queryId = idToFetch || parameterId;
    if (!queryId.trim()) {
      setReferences([]);
      return;
    }

    setLoading(true);
    setSearched(true);
    setErrorMsg(null);
    try {
      const res = await referenceRangeService.getReferenceByParameterId(queryId.trim());
      if (res && (res.success || Array.isArray(res) || res.data)) {
        const data = Array.isArray(res) ? res : res.data || [];
        setReferences(data);
      } else {
        setReferences([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch reference ranges:", err);
      setReferences([]);
      setErrorMsg(Array.isArray(err) ? err.join(", ") : err.toString());
    } finally {
      setLoading(false);
    }
  }, [parameterId]);

  useEffect(() => {
    if (parameterId.trim()) {
      fetchReferences(parameterId);
    } else {
      setReferences([]);
      setSearched(false);
    }
  }, [parameterId, fetchReferences]);

  return (
    <div className="space-y-8 p-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Laboratory Reference Range
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage laboratory test reference ranges by test parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchReferences()}
            disabled={loading || !parameterId.trim()}
            className="rounded-xl h-10 border-slate-200 text-slate-600 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <ReferenceRangeForm
            defaultParameterId={parameterId}
            onSuccess={() => fetchReferences()}
          />
        </div>
      </div>

      {/* Cascading Search Dropdowns Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Department Dropdown */}
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              disabled={loadingDepartments}
              className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
            >
              <option value="">
                {loadingDepartments ? "Loading departments..." : "Select a Department..."}
              </option>
              {departments.map((dept, index) => (
                <option key={dept.id || `dept-${index}`} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Test Catalog Dropdown */}
          <div className="relative">
            <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
            <select
              value={selectedCatalog}
              onChange={(e) => setSelectedCatalog(e.target.value)}
              disabled={!selectedDepartment || loadingCatalogs}
              className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
            >
              <option value="">
                {loadingCatalogs
                  ? "Loading test catalogs..."
                  : !selectedDepartment
                  ? "Select a Department First"
                  : "Select a Test Catalog"}
              </option>
              {availableCatalogs.map((cat, index) => (
                <option key={cat.id || `cat-${index}`} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Parameter Dropdown */}
          <div className="relative">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
            <select
              value={parameterId}
              onChange={(e) => setParameterId(e.target.value)}
              disabled={!selectedCatalog || loadingParameters}
              className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
            >
              <option value="">
                {loadingParameters
                  ? "Loading parameters..."
                  : !selectedCatalog
                  ? "Select a Test Catalog First"
                  : "Select a Test Parameter"}
              </option>
              {availableParameters.map((param, index) => (
                <option key={param.id || `param-${index}`} value={param.id}>
                  {param.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error View */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading or Data Table View */}
      {loading ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 bg-white border border-slate-200 rounded-2xl gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          <span>Loading reference range data...</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              {searched && parameterId
                ? `List of all Test Reference Ranges for ${selectedParamName}.`
                : "Select a department, test catalog, and test parameter above to view test reference range."}
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-16 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">Gender</TableHead>
                <TableHead className="font-bold text-slate-600">Age Group</TableHead>
                <TableHead className="font-bold text-slate-600">Test Reference Range</TableHead>
                <TableHead className="font-bold text-slate-600">Text Value</TableHead>
                <TableHead className="w-20 text-right font-bold text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {references.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        {searched
                          ? "No reference ranges found for selected parameter"
                          : "Select a department, test catalog, and test parameter above to view test reference range."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                references.map((item, index) => {
                  return (
                    <TableRow key={item.ref_id || `ref-${index}`} className="hover:bg-slate-50/60 transition-colors group">
                      <TableCell className="font-mono text-xs text-slate-400">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <span className="px-2.5 py-1 bg-emerald-50 text-slate-600 rounded-md text-[11px] font-medium">
                          {item.gender}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600">
                        {item.age || "All ages"}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-emerald-600">
                        {item.value || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {item.text_range || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Reference Range"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Controlled Edit Reference Modal */}
      {editingItem && (
        <EditReferenceRange
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            fetchReferences();
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}