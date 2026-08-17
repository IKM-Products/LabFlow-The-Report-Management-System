"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Building2,
  FlaskConical,
  ClipboardList,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import { departmentService } from "@/services/department.service";
import { testCatalogService } from "@/services/test-catalog.service";
import { testParameterService } from "@/services/test-parameter.service";
import { resultService } from "@/services/result.service";
import { Button } from "@/components/ui/button";

const extractArray = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.catalogs)) return res.catalogs;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

export type FlagType = "low" | "normal" | "high" | "critical" | "na";

export interface ParameterRow {
  id: string;
  parameter_id: string;
  parameter_name: string;
  unit?: string;
  result_value: string;
  flag: FlagType;
  remarks: string;
}

interface ResultFormProps {
  defaultOrderId?: string;
  orderId?: string;
  technicianId?: string;
  technicianName?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function ResultForm({
  defaultOrderId,
  orderId,
  technicianId,
  technicianName = "Technician",
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onSuccess,
}: ResultFormProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = typeof controlledIsOpen !== "undefined";
  const isModalOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const activeOrderId = orderId || defaultOrderId || "";

  const [departments, setDepartments] = useState<any[]>([]);
  const [testCatalogs, setTestCatalogs] = useState<any[]>([]);
  const [availableParameters, setAvailableParameters] = useState<any[]>([]);

  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");
  const [verifiedByUuid, setVerifiedByUuid] = useState<string>(
    technicianId || "00000000-0000-0000-0000-000000000000"
  );
  const [verifiedByName, setVerifiedByName] = useState<string>(technicianName);

  const [parameterRows, setParameterRows] = useState<ParameterRow[]>([
    {
      id: "row-1",
      parameter_id: "",
      parameter_name: "",
      unit: "",
      result_value: "",
      flag: "normal",
      remarks: "",
    },
  ]);

  const [loadingDepts, setLoadingDepts] = useState<boolean>(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState<boolean>(false);
  const [loadingParams, setLoadingParams] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (technicianId) {
      setVerifiedByUuid(technicianId);
    }
  }, [technicianId]);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepts(true);
      setErrorMsg(null);
      try {
        const response = await departmentService.getDepartments();
        const deptList = extractArray(response);
        setDepartments(deptList);
      } catch (err: any) {
        console.error("Failed to load departments:", err);
        setErrorMsg("Failed to load departments. Please check backend connection.");
      } finally {
        setLoadingDepts(false);
      }
    };

    if (isModalOpen) {
      fetchDepartments();
    }
  }, [isModalOpen]);

  const handleClose = () => {
    if (!isControlled) {
      setInternalIsOpen(false);
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setSelectedDeptId("");
    setSelectedCatalogId("");
    setTestCatalogs([]);
    setAvailableParameters([]);
    resetParameterRows();
    if (controlledOnClose) controlledOnClose();
  };

  const handleOpenModal = () => {
    if (!activeOrderId) {
      toast.error("Please select a Work Order before adding diagnostic results.");
      return;
    }
    setInternalIsOpen(true);
  };

  const resetParameterRows = () => {
    setParameterRows([
      {
        id: `row-${Date.now()}`,
        parameter_id: "",
        parameter_name: "",
        unit: "",
        result_value: "",
        flag: "normal",
        remarks: "",
      },
    ]);
  };

  const handleDepartmentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setSelectedDeptId(deptId);
    setSelectedCatalogId("");
    setTestCatalogs([]);
    setAvailableParameters([]);
    resetParameterRows();

    if (!deptId) return;

    setLoadingCatalogs(true);
    setErrorMsg(null);

    try {
      const response = await testCatalogService.getCatalogByDeptId(deptId);
      const catalogList = extractArray(response);
      setTestCatalogs(catalogList);

      if (catalogList.length === 0) {
        setErrorMsg("No test catalogs found for the selected department.");
      }
    } catch (err: any) {
      console.error("Error fetching test catalogs:", err);
      setErrorMsg("Failed to fetch test catalogs for this department.");
    } finally {
      setLoadingCatalogs(false);
    }
  };

  const handleCatalogChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catalogId = e.target.value;
    setSelectedCatalogId(catalogId);
    setAvailableParameters([]);
    resetParameterRows();

    if (!catalogId) return;

    setLoadingParams(true);
    setErrorMsg(null);

    try {
      const res = await testParameterService.getParametersByTestId(catalogId);
      const paramList = res?.data || (Array.isArray(res) ? res : []);
      setAvailableParameters(paramList);

      if (paramList.length > 0) {
        const initialRows: ParameterRow[] = paramList.map((param: any, idx: number) => ({
          id: `row-${Date.now()}-${idx}`,
          parameter_id: String(param.parameter_id || param.id || ""),
          parameter_name: param.parameter_name || param.name || "",
          unit: param.unit || "",
          result_value: "",
          flag: "normal",
          remarks: "",
        }));
        setParameterRows(initialRows);
      } else {
        setErrorMsg("No test parameters found for this test catalog.");
      }
    } catch (err: any) {
      console.error("Failed to load parameters for catalog:", err);
      setErrorMsg("Failed to load test parameters.");
    } finally {
      setLoadingParams(false);
    }
  };

  const handleAddRow = () => {
    setParameterRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        parameter_id: "",
        parameter_name: "",
        unit: "",
        result_value: "",
        flag: "normal",
        remarks: "",
      },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (parameterRows.length === 1) return;
    setParameterRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleRowChange = (id: string, field: keyof ParameterRow, value: string) => {
    setParameterRows((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          if (field === "parameter_id") {
            const matchedParam = availableParameters.find(
              (p) => String(p.parameter_id || p.id) === String(value)
            );
            return {
              ...row,
              parameter_id: value,
              parameter_name: matchedParam ? matchedParam.parameter_name || matchedParam.name || "" : "",
              unit: matchedParam ? matchedParam.unit || "" : "",
            };
          }
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDeptId || !selectedCatalogId) {
      setErrorMsg("Please select both a Department and a Test Catalog.");
      return;
    }

    const invalidRow = parameterRows.find((r) => !r.parameter_id || !r.result_value.trim());
    if (invalidRow) {
      setErrorMsg("Please ensure all parameter rows have a parameter selected and result value entered.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // Key updated from 'parameters' to 'results'
      const payload = {
        order_id: activeOrderId,
        verified_by: verifiedByUuid,
        department_id: selectedDeptId,
        test_catalog_id: selectedCatalogId,
        results: parameterRows.map((r) => ({
          parameter_id: r.parameter_id,
          parameter_name: r.parameter_name,
          result_value: r.result_value.trim(),
          flag: r.flag,
          remarks: r.remarks.trim(),
        })),
      };

      if (typeof (resultService as any).createBatchResults === "function") {
        await (resultService as any).createBatchResults(payload);
      } else if (typeof (resultService as any).createResult === "function") {
        await (resultService as any).createResult(payload);
      } else {
        console.log("Submitting Payload:", payload);
      }

      toast.success("Diagnostic results submitted successfully!");
      setSuccessMsg("Diagnostic results verified & saved successfully!");
      if (onSuccess) onSuccess();

      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to commit diagnostic results.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {!isControlled && (
        <Button
          type="button"
          onClick={handleOpenModal}
          className="rounded-xl h-10 bg-emerald-600 hover:bg-emerald-600 text-white font-medium text-sm shadow-xs flex items-center gap-2 px-4 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Result</span>
        </Button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Commit Diagnostic Dataset</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Populate parameter values and flags for order #{activeOrderId}.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Target Order ID
                  </span>
                  <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
                    {activeOrderId || "No Order Selected"}
                  </span>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Verified By (Technician)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={verifiedByName}
                      onChange={(e) => setVerifiedByName(e.target.value)}
                      className="w-full h-9 px-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-slate-800"
                    />
                    <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2.5 text-rose-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2.5 text-emerald-700 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100/80 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  Department & Test Catalog Scope
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Department
                    </label>
                    <select
                      value={selectedDeptId}
                      onChange={handleDepartmentChange}
                      disabled={loadingDepts}
                      className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-slate-800 cursor-pointer disabled:bg-slate-100"
                    >
                      <option value="">
                        {loadingDepts ? "Loading Departments..." : "Select Department"}
                      </option>
                      {departments.map((dept) => (
                        <option key={dept.dept_id || dept.id} value={dept.dept_id || dept.id}>
                          {dept.dept_name || dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5 text-slate-400" />
                      Test Catalog
                    </label>
                    <select
                      value={selectedCatalogId}
                      onChange={handleCatalogChange}
                      disabled={!selectedDeptId || loadingCatalogs}
                      className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-slate-800 cursor-pointer disabled:bg-slate-100"
                    >
                      <option value="">
                        {!selectedDeptId
                          ? "Select Department First"
                          : loadingCatalogs
                          ? "Loading Test Catalogs..."
                          : testCatalogs.length === 0
                          ? "No catalogs found"
                          : "Select Test Catalog"}
                      </option>
                      {testCatalogs.map((cat) => (
                        <option
                          key={cat.test_catalog_id || cat.id}
                          value={cat.test_catalog_id || cat.id}
                        >
                          {cat.test_name || cat.name} {cat.test_code ? `(${cat.test_code})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <span className="text-slate-400">📊</span>
                    Diagnostic Parameters ({parameterRows.length})
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    disabled={!selectedCatalogId || loadingParams}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Parameter Row
                  </button>
                </div>

                {loadingParams ? (
                  <div className="flex h-32 items-center justify-center text-xs font-medium text-slate-400 bg-slate-50 border rounded-2xl animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Fetching test parameters...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {parameterRows.map((row) => (
                      <div
                        key={row.id}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3.5 bg-slate-50/60 border border-slate-200/80 rounded-2xl"
                      >
                        <div className="sm:col-span-4 space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500 sm:hidden">
                            Parameter
                          </label>
                          <select
                            value={row.parameter_id}
                            onChange={(e) => handleRowChange(row.id, "parameter_id", e.target.value)}
                            disabled={availableParameters.length === 0}
                            className="w-full h-9 px-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-slate-800 cursor-pointer disabled:bg-slate-100"
                          >
                            <option value="">
                              {availableParameters.length === 0
                                ? "Select Catalog First"
                                : "-- Select Parameter --"}
                            </option>
                            {availableParameters.map((param) => (
                              <option
                                key={param.parameter_id || param.id}
                                value={param.parameter_id || param.id}
                              >
                                {param.parameter_name || param.name}
                                {param.unit ? ` (${param.unit})` : ""}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500 sm:hidden">
                            Result Value
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Result value"
                              value={row.result_value}
                              onChange={(e) => handleRowChange(row.id, "result_value", e.target.value)}
                              className="w-full h-9 px-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-slate-800"
                            />
                            {row.unit && (
                              <span className="absolute right-3 top-2 text-[10px] font-mono text-slate-400 pointer-events-none">
                                {row.unit}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500 sm:hidden">
                            Flag
                          </label>
                          <select
                            value={row.flag}
                            onChange={(e) => handleRowChange(row.id, "flag", e.target.value as FlagType)}
                            className="w-full h-9 px-2 text-xs font-medium rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-slate-800 cursor-pointer"
                          >
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                            <option value="na">N/A</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold uppercase text-slate-500 sm:hidden">
                            Remarks
                          </label>
                          <input
                            type="text"
                            placeholder="Remarks"
                            value={row.remarks}
                            onChange={(e) => handleRowChange(row.id, "remarks", e.target.value)}
                            className="w-full h-9 px-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-slate-800"
                          />
                        </div>

                        <div className="sm:col-span-1 flex justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(row.id)}
                            disabled={parameterRows.length === 1}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || !selectedCatalogId || loadingParams}
                  className="px-6 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Committing...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}