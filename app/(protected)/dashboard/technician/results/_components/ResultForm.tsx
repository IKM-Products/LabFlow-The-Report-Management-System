"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { departmentService } from "@/services/department.service";
import { testCatalogService } from "@/services/test-catalog.service";
import { testParameterService } from "@/services/test-parameter.service";
import { resultService } from "@/services/result.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const extractArray = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.catalogs)) return res.catalogs;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

export type FlagType = "low" | "normal" | "high" | "critical" | "na" | "";

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
  open?: boolean;
  isOpen?: boolean; 
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void; 
  onSuccess?: () => void;
  showTrigger?: boolean;
}

export default function ResultForm({
  defaultOrderId,
  orderId,
  technicianId,
  technicianName = "Technician",
  open: externalOpen,
  isOpen: legacyIsOpen,
  onOpenChange: externalOnOpenChange,
  onClose: legacyOnClose,
  onSuccess,
  showTrigger = true,
}: ResultFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = externalOpen !== undefined || legacyIsOpen !== undefined;
  const isOpen = externalOpen ?? legacyIsOpen ?? internalOpen;

  const setIsOpen = (value: boolean) => {
    if (isControlled) {
      externalOnOpenChange?.(value);
      if (!value && legacyOnClose) {
        legacyOnClose();
      }
    } else {
      setInternalOpen(value);
    }
  };

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
      flag: "",
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
        setErrorMsg("Failed to load departments. Please try again later.");
      } finally {
        setLoadingDepts(false);
      }
    };

    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  const resetParameterRows = () => {
    setParameterRows([
      {
        id: `row-${Date.now()}`,
        parameter_id: "",
        parameter_name: "",
        unit: "",
        result_value: "",
        flag: "",
        remarks: "",
      },
    ]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setSelectedDeptId("");
    setSelectedCatalogId("");
    setTestCatalogs([]);
    setAvailableParameters([]);
    resetParameterRows();
    if (legacyOnClose) legacyOnClose();
  };

  const handleOpenModal = () => {
    if (!activeOrderId) {
      toast.error("Please select a Work Order before adding diagnostic results.");
      return;
    }
    setIsOpen(true);
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
          flag: "",
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
        flag: "",
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

    const invalidRow = parameterRows.find(
      (r) => !r.parameter_id || !r.result_value.trim() || !r.flag
    );
    if (invalidRow) {
      setErrorMsg(
        "Please ensure all parameter rows have a parameter, result value, and result status selected."
      );
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
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
      {showTrigger && !isControlled && (
        <Button
          type="button"
          onClick={handleOpenModal}
          className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl font-medium shadow-xs text-sm h-10 px-4 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Result</span>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
        <DialogContent className="sm:max-w-4xl bg-white rounded-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
                  Add New Result
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Enter the required information to create a new result in the system.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-2">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2.5 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2.5 text-emerald-600 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  Department
                </Label>
                <select
                  value={selectedDeptId}
                  onChange={handleDepartmentChange}
                  disabled={loadingDepts}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white text-slate-900 cursor-pointer disabled:bg-slate-100"
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
                <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  Test Catalog
                </Label>
                <select
                  value={selectedCatalogId}
                  onChange={handleCatalogChange}
                  disabled={!selectedDeptId || loadingCatalogs}
                  className="w-full h-10 px-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white text-slate-800 cursor-pointer disabled:bg-slate-100"
                >
                  <option value="">
                    {!selectedDeptId
                      ? "Select a Department First"
                      : loadingCatalogs
                      ? "Loading Test Catalogs..."
                      : testCatalogs.length === 0
                      ? "No test catalogs found"
                      : "Select a Test Catalog"}
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleAddRow}
                  disabled={!selectedCatalogId || loadingParams}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                <div className="space-y-4">
                  {parameterRows.map((row, index) => (
                    <div
                      key={row.id}
                      className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Diagnostic Details #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(row.id)}
                          disabled={parameterRows.length === 1}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Row 1: Test Parameter & Result Value */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-700">
                            Test Parameter
                          </Label>
                          <select
                            value={row.parameter_id}
                            onChange={(e) => handleRowChange(row.id, "parameter_id", e.target.value)}
                            disabled={availableParameters.length === 0}
                            className="w-full h-9 px-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white text-slate-800 cursor-pointer disabled:bg-slate-100"
                          >
                            <option value="">
                              {availableParameters.length === 0
                                ? "Select a Test Catalog First"
                                : "Select a Test Parameter"}
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

                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-700">
                            Result Value
                          </Label>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Result value"
                              value={row.result_value}
                              onChange={(e) => handleRowChange(row.id, "result_value", e.target.value)}
                              className="h-9 text-xs font-medium rounded-xl border-slate-200 bg-white text-slate-800 pr-12"
                            />
                            {row.unit && (
                              <span className="absolute right-3 top-2 text-[11px] font-mono text-slate-400 pointer-events-none">
                                {row.unit}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Flag & Remarks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-700">
                            Result Status
                          </Label>
                          <select
                            value={row.flag}
                            onChange={(e) => handleRowChange(row.id, "flag", e.target.value as FlagType)}
                            className="w-full h-9 px-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white text-slate-800 cursor-pointer"
                          >
                            <option value="">Select a Result Status</option>
                            <option value="normal">Normal</option>
                            <option value="low">Low</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                            <option value="na">N/A</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-slate-700">
                            Remarks
                          </Label>
                          <Input
                            type="text"
                            placeholder="Remarks"
                            value={row.remarks}
                            onChange={(e) => handleRowChange(row.id, "remarks", e.target.value)}
                            className="h-9 text-xs font-medium rounded-xl border-slate-200 bg-white text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={submitting}
                className="rounded-xl text-xs h-10 px-5"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={submitting || !selectedCatalogId || loadingParams}
                className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl text-xs h-10 px-6 font-bold shadow-xs min-w-28"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}