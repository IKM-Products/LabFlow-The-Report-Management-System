"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FlaskConical,
  AlertCircle,
  ShieldAlert,
  RefreshCw,
  Building2,
  Clock,
  Tag,
  Grid,
} from "lucide-react";

import { testCatalogService } from "@/services/test-catalog.service";
import { departmentService } from "@/services/department.service";
import { panelService } from "@/services/panel.service";
import { TestCatalogItem, PanelCatalogDetails } from "@/types/test-catalog.types";
import { Department } from "@/types/department.types";
import { PanelListItem } from "@/types/panel.types";

import TestCatalogForm from "./_components/TestCatalogForm";
import EditTestCatalog from "./_components/EditTestCatalog";

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

type ViewMode = "department" | "panel";

// Helper to safely format error messages including network timeouts
const formatApiError = (err: any, fallbackContext: string): string => {
  const isTimeout = err?.code === "ECONNABORTED" || err?.message?.includes("timeout");
  if (isTimeout) {
    return `${fallbackContext}: Server took too long to respond (Request Timed Out). Please verify your backend server is active and try again.`;
  }

  const rawMessage = err?.response?.data?.messages || err?.response?.data?.message || err?.message;
  if (Array.isArray(rawMessage)) {
    return `${fallbackContext}: ${rawMessage.join(", ")}`;
  }
  if (typeof rawMessage === "string" && rawMessage.trim()) {
    return `${fallbackContext}: ${rawMessage}`;
  }
  return `${fallbackContext}: An unexpected error occurred.`;
};

export default function TestCatalogPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("department");

  // Common Department List State
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  // Mode 1: Department View State
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [activeDeptId, setActiveDeptId] = useState("");
  const [deptCatalogs, setDeptCatalogs] = useState<TestCatalogItem[]>([]);
  const [loadingDeptCatalogs, setLoadingDeptCatalogs] = useState(false);

  // Mode 2: Panel View State (Dept -> Panel -> Catalog)
  const [panelDeptId, setPanelDeptId] = useState("");
  const [panels, setPanels] = useState<PanelListItem[]>([]);
  const [loadingPanels, setLoadingPanels] = useState(false);
  const [selectedPanelId, setSelectedPanelId] = useState("");
  const [activePanelId, setActivePanelId] = useState("");
  const [panelDetails, setPanelDetails] = useState<PanelCatalogDetails | null>(null);
  const [loadingPanelCatalog, setLoadingPanelCatalog] = useState(false);

  // Common Error State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active department name helper for department view
  const activeDeptName = departments.find((d) => d.dept_id === activeDeptId)?.dept_name;

  // Fetch departments list with safe timeout error capture
  const fetchDepartments = useCallback(async () => {
    setLoadingDepts(true);
    setErrorMsg(null);
    try {
      const departmentsResponse = await departmentService.getDepartments();
      if (Array.isArray(departmentsResponse)) {
        setDepartments(departmentsResponse);
      } else {
        setDepartments([]);
      }
    } catch (err: any) {
      console.error("Failed to load departments:", err);
      setDepartments([]);
      setErrorMsg(formatApiError(err, "Failed to load departments"));
    } finally {
      setLoadingDepts(false);
    }
  }, []);

  // Fetch departments on initial mount
  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      if (isMounted) {
        await fetchDepartments();
      }
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, [fetchDepartments]);

  // Fetch catalog items by Department ID
  const fetchCatalogsByDept = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoadingDeptCatalogs(true);
    setErrorMsg(null);
    try {
      const response = await testCatalogService.getCatalogByDeptId(idToFetch.trim());
      if (Array.isArray(response)) {
        setDeptCatalogs(response);
        setActiveDeptId(idToFetch.trim());
      } else {
        setDeptCatalogs([]);
        setErrorMsg("Unexpected catalog response format from server.");
      }
    } catch (err: any) {
      setDeptCatalogs([]);
      setErrorMsg(formatApiError(err, "Failed to load catalog by department"));
    } finally {
      setLoadingDeptCatalogs(false);
    }
  };

  // Fetch catalog details by Panel ID
  const fetchCatalogByPanel = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoadingPanelCatalog(true);
    setErrorMsg(null);
    try {
      const details = await testCatalogService.getCatalogByPanelId(idToFetch.trim());
      setPanelDetails(details);
      setActivePanelId(idToFetch.trim());
    } catch (err: any) {
      setPanelDetails(null);
      setErrorMsg(formatApiError(err, "Failed to load catalog by panel"));
    } finally {
      setLoadingPanelCatalog(false);
    }
  };

  // Handler: Department Selection (Department View Mode)
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setSelectedDeptId(deptId);
    if (deptId) {
      fetchCatalogsByDept(deptId);
    } else {
      setDeptCatalogs([]);
      setActiveDeptId("");
    }
  };

  // Handler: Department Selection (Panel View Mode) -> Fetch Panels
  const handlePanelDeptChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setPanelDeptId(deptId);
    setSelectedPanelId("");
    setPanelDetails(null);
    setActivePanelId("");
    setPanels([]);

    if (!deptId) return;

    setLoadingPanels(true);
    setErrorMsg(null);
    try {
      const panelsData = await panelService.getPanelsByDeptId(deptId);
      if (Array.isArray(panelsData)) {
        setPanels(panelsData);
      } else {
        setPanels([]);
      }
    } catch (err: any) {
      setPanels([]);
      setErrorMsg(formatApiError(err, "Failed to load panels for department"));
    } finally {
      setLoadingPanels(false);
    }
  };

  // Handler: Panel Selection -> Fetch Catalog
  const handlePanelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const panelId = e.target.value;
    setSelectedPanelId(panelId);
    if (panelId) {
      fetchCatalogByPanel(panelId);
    } else {
      setPanelDetails(null);
      setActivePanelId("");
    }
  };

  // Unified Refresh Handler
  const handleRefresh = () => {
    if (departments.length === 0) {
      fetchDepartments();
    }
    if (viewMode === "department" && activeDeptId) {
      fetchCatalogsByDept(activeDeptId);
    } else if (viewMode === "panel" && activePanelId) {
      fetchCatalogByPanel(activePanelId);
    }
  };

  const isLoading = loadingDepts || loadingDeptCatalogs || loadingPanelCatalog || loadingPanels;

  return (
    <div className="space-y-8 p-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Laboratory Test Catalogs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage laboratory test catalogs by department or test panel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="rounded-xl h-10 border-slate-200 text-slate-600"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <TestCatalogForm
            defaultDeptId={activeDeptId}
            onSuccess={() => activeDeptId && fetchCatalogsByDept(activeDeptId)}
          />
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          type="button"
          onClick={() => {
            setViewMode("department");
            setErrorMsg(null);
          }}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            viewMode === "department"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Building2 className="w-4 h-4" />
          By Department
        </button>
        <button
          type="button"
          onClick={() => {
            setViewMode("panel");
            setErrorMsg(null);
          }}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            viewMode === "panel"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Grid className="w-4 h-4" />
          By Test Panel
        </button>
      </div>

      {/* Filter Control Bar */}
      {viewMode === "department" ? (
        /* Department Direct Lookup */
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="relative flex-1">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
            <select
              value={selectedDeptId}
              onChange={handleDepartmentChange}
              disabled={loadingDepts}
              className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 cursor-pointer disabled:bg-slate-50"
            >
              <option value="">
                {loadingDepts
                  ? "Loading departments..."
                  : departments.length === 0
                  ? "No departments loaded (Click Refresh to retry)"
                  : "Select a Department"}
              </option>
              {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_id}>
                  {dept.dept_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        /* Cascading Lookup: Select Department -> Select Panel */
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
          {/* Step 1: Select Department */}
          <div className="relative flex-1 w-full">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
            <select
              value={panelDeptId}
              onChange={handlePanelDeptChange}
              disabled={loadingDepts}
              className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 cursor-pointer disabled:bg-slate-50"
            >
              <option value="">
                {loadingDepts
                  ? "Loading departments..."
                  : departments.length === 0
                  ? "No departments loaded (Click Refresh to retry)"
                  : "Select a Department"}
              </option>
              {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_id}>
                  {dept.dept_name}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Panel */}
          <div className="relative flex-1 w-full">
            <Grid className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
            <select
              value={selectedPanelId}
              onChange={handlePanelChange}
              disabled={!panelDeptId || loadingPanels}
              className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!panelDeptId
                  ? "Select a Department First"
                  : loadingPanels
                  ? "Loading panels..."
                  : panels.length === 0
                  ? "No panels found for department"
                  : "Select a Test Panel"}
              </option>
              {panels.map((p) => (
                <option key={p.panel_id} value={p.panel_id}>
                  {p.panel_name} {p.panel_code ? `(${p.panel_code})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Error View */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between gap-3 text-rose-700 text-xs font-medium">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-rose-700 border-rose-200 hover:bg-rose-100 h-7 text-[11px] shrink-0"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Department Mode Content */}
      {viewMode === "department" && (
        <>
          {loadingDeptCatalogs ? (
            <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border rounded-2xl">
              Loading test catalog data...
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
              <Table>
                <TableCaption className="text-xs text-slate-400 pb-4">
                  {activeDeptName
                    ? `List of all Test Catalogs for ${activeDeptName}.`
                    : "Select a department above to view test catalogs."}
                </TableCaption>
                <TableHeader>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <TableHead className="w-20 font-bold text-slate-600">S.N.</TableHead>
                    <TableHead className="font-bold text-slate-600">Test Catalog Code</TableHead>
                    <TableHead className="font-bold text-slate-600">Test Catalog Name</TableHead>
                    <TableHead className="font-bold text-slate-600">Sample Type</TableHead>
                    <TableHead className="font-bold text-slate-600">Price</TableHead>
                    <TableHead className="font-bold text-slate-600">Turnaround Time</TableHead>
                    <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
                  </tr>
                </TableHeader>
                <TableBody className="divide-y divide-slate-150">
                  {deptCatalogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-sm text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <ShieldAlert className="h-6 w-6 text-slate-300" />
                          <p className="font-medium text-slate-500">
                            {activeDeptName
                              ? `No test catalog items found for department "${activeDeptName}"`
                              : "Select a department above to view test catalogs."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    deptCatalogs.map((item, idx) => (
                      <TableRow key={item.test_catalog_id} className="hover:bg-slate-50/60 transition-colors group">
                        <TableCell className="font-mono text-xs text-slate-400">{idx + 1}</TableCell>
                        <TableCell>
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-mono text-[10px] font-semibold">
                            {item.test_code}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">{item.test_name}</TableCell>
                        <TableCell>
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium">
                            {item.sample_type}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-emerald-600">${item.test_price.toFixed(2)}</TableCell>
                        <TableCell className="text-slate-500">
                          <span className="flex items-center gap-1 text-xs">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {item.turnaround_time} hrs
                          </span>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <EditTestCatalog
                              item={item}
                              onSuccess={() => activeDeptId && fetchCatalogsByDept(activeDeptId)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Panel Mode Content */}
      {viewMode === "panel" && (
        <>
          {loadingPanelCatalog ? (
            <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border rounded-2xl">
              Loading panel catalog details...
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
              <Table>
                <TableCaption className="text-xs text-slate-400 pb-4">
                  {panelDetails
                    ? `List all Test Catalogs for Test Panel "${panelDetails.panel_name}".`
                    : "Select a department and test panel above to view test catalogs."}
                </TableCaption>
                <TableHeader>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <TableHead className="w-16 font-bold text-slate-600">S.N.</TableHead>
                    <TableHead className="font-bold text-slate-600">Test Panel Code</TableHead>
                    <TableHead className="font-bold text-slate-600">Test Panel Name</TableHead>
                    <TableHead className="font-bold text-slate-600">Test Panel Price</TableHead>
                    <TableHead className="font-bold text-slate-600">Test Catalog Code</TableHead>
                    <TableHead className="font-bold text-slate-600">Test Catalog Name</TableHead>
                    <TableHead className="font-bold text-slate-600">Price</TableHead>
                  </tr>
                </TableHeader>
                <TableBody className="divide-y divide-slate-150">
                  {!panelDetails ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-sm text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <ShieldAlert className="h-6 w-6 text-slate-300" />
                          <p className="font-medium text-slate-500">
                            Select a department and test panel above to view test catalogs.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : panelDetails.test_catalog_items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-sm text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <ShieldAlert className="h-6 w-6 text-slate-300" />
                          <p className="font-medium text-slate-500">
                            No test catalog items assigned to this panel.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    panelDetails.test_catalog_items.map((item, idx) => (
                      <TableRow key={item.test_catalog_id} className="hover:bg-slate-50/60 transition-colors">
                        <TableCell className="font-mono text-xs text-slate-400">{idx + 1}</TableCell>
                        <TableCell>
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-mono text-[10px] font-semibold">
                            {panelDetails.panel_code}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">{panelDetails.panel_name}</TableCell>
                        <TableCell className="font-semibold text-emerald-600">
                          ${panelDetails.panel_price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-mono text-[10px] font-semibold">
                            {item.test_catalog_code}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">{item.test_catalog_name}</TableCell>
                        <TableCell className="font-semibold text-emerald-600">
                          ${item.test_catalog_price.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}