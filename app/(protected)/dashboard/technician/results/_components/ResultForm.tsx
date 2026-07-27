"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FilePlus,
  Plus,
  Trash2,
  Loader2,
  Building2,
  FlaskConical,
  Sliders,
  AlertCircle,
  UserCheck,
  Wand2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createResultSchema, CreateResultFormValues } from "@/schemas/result.schema";
import { resultService } from "@/services/result.service";
import { departmentService } from "@/services/department.service";
import { testCatalogService } from "@/services/test-catalog.service";
import { testParameterService } from "@/services/test-parameter.service";

interface ResultFormProps {
  orderId?: string;
  defaultOrderId?: string;
  onSuccess: () => void;
}

interface SelectOption {
  id: string;
  name: string;
  subtext?: string;
}

// Helper to safely extract arrays from various API payload wrappers
const extractArray = (res: any): any[] => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.catalogs)) return res.catalogs;
  if (Array.isArray(res?.tests)) return res.tests;
  if (Array.isArray(res?.departments)) return res.departments;
  if (Array.isArray(res?.parameters)) return res.parameters;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.result)) return res.result;
  return [];
};

// Helper to safely find ID across common backend naming conventions
const extractId = (item: any, fallbackPrefix: string, index: number): string => {
  if (!item || typeof item !== "object") return `${fallbackPrefix}-${index}`;
  const possibleId =
    item.id ??
    item._id ??
    item.dept_id ??
    item.department_id ??
    item.departmentId ??
    item.catalog_id ??
    item.test_catalog_id ??
    item.catalogId ??
    item.parameter_id ??
    item.test_parameter_id ??
    item.parameterId;

  if (possibleId !== undefined && possibleId !== null && String(possibleId).trim() !== "") {
    return String(possibleId);
  }
  return `${fallbackPrefix}-${index}`;
};

// Helper to safely find display name across common backend naming conventions
const extractName = (item: any, fallback: string): string => {
  if (!item || typeof item !== "object") return fallback;
  return (
    item.dept_name ||
    item.department_name ||
    item.departmentName ||
    item.catalog_name ||
    item.test_catalog_name ||
    item.catalogName ||
    item.test_name ||
    item.parameter_name ||
    item.test_parameter_name ||
    item.parameterName ||
    item.name ||
    item.title ||
    fallback
  );
};

// Safe formatter for API errors & network timeouts
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

export default function ResultForm({
  orderId,
  defaultOrderId = "",
  onSuccess,
}: ResultFormProps) {
  const effectiveOrderId = orderId || defaultOrderId;

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cascading & Auto-Populated States
  const [departments, setDepartments] = useState<SelectOption[]>([]);
  const [catalogs, setCatalogs] = useState<SelectOption[]>([]);
  const [parameters, setParameters] = useState<SelectOption[]>([]);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedCatalogId, setSelectedCatalogId] = useState("");

  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(false);
  const [isLoadingParameters, setIsLoadingParameters] = useState(false);
  const [isLoadingOrderData, setIsLoadingOrderData] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateResultFormValues>({
    resolver: zodResolver(createResultSchema) as any,
    defaultValues: {
      order_id: effectiveOrderId,
      verified_by: "Technician",
      results: [{ flag: "normal", parameter_id: "", remarks: "", result_value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "results",
  });

  // Sync order_id state when prop updates
  useEffect(() => {
    if (effectiveOrderId) {
      setValue("order_id", effectiveOrderId, { shouldValidate: true });
    }
  }, [effectiveOrderId, setValue]);

  // Fetch Parameters for catalog IDs concurrently with deduplication
  const fetchParametersForCatalogs = useCallback(
    async (catalogIds: string[]): Promise<SelectOption[]> => {
      const validIds = catalogIds.filter((id) => Boolean(id && id.trim()));
      if (validIds.length === 0) {
        setParameters([]);
        return [];
      }

      setIsLoadingParameters(true);
      try {
        const results = await Promise.all(
          validIds.map(async (catId) => {
            try {
              const res = await testParameterService.getParametersByTestId(catId.trim());
              return extractArray(res);
            } catch (err) {
              console.error(`Error loading parameters for catalog ID ${catId}:`, err);
              return [];
            }
          })
        );

        const combinedRaw = results.flat();
        const seenIds = new Set<string>();
        const parsedParams: SelectOption[] = [];

        combinedRaw.forEach((p: any, idx: number) => {
          const id = extractId(p, "param", idx);
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            const unitStr = p.unit || p.test_unit ? `Unit: ${p.unit || p.test_unit}` : "";
            const catalogStr = p.catalog_name ? `Catalog: ${p.catalog_name}` : "";
            parsedParams.push({
              id,
              name: extractName(p, "Parameter Record"),
              subtext: [unitStr, catalogStr].filter(Boolean).join(" | "),
            });
          }
        });

        setParameters(parsedParams);
        return parsedParams;
      } catch (error) {
        console.error("Error aggregating parameters:", error);
        toast.error(formatApiError(error, "Failed to load test parameters"));
        return [];
      } finally {
        setIsLoadingParameters(false);
      }
    },
    []
  );

  // Load Initial Departments & Auto-fetch order details if orderId exists
  useEffect(() => {
    if (!isOpen) return;

    const initializeForm = async () => {
      setIsLoadingDepartments(true);

      try {
        // 1. Fetch available departments (with deduplication)
        const deptResponse: any = await departmentService.getDepartments();
        const rawDepts = extractArray(deptResponse);
        const seenDeptIds = new Set<string>();
        const parsedDepts: SelectOption[] = [];

        rawDepts.forEach((dept: any, idx: number) => {
          const id = extractId(dept, "dept", idx);
          if (id && !seenDeptIds.has(id)) {
            seenDeptIds.add(id);
            parsedDepts.push({
              id,
              name: extractName(dept, "Department"),
            });
          }
        });
        setDepartments(parsedDepts);

        // 2. If order ID exists, auto-fetch ordered catalogs
        if (effectiveOrderId) {
          setIsLoadingOrderData(true);
          try {
            const serviceAny = resultService as any;
            const orderRes: any = await (typeof serviceAny.getOrderDetails === "function"
              ? serviceAny.getOrderDetails(effectiveOrderId)
              : resultService.getResultsByOrderId(effectiveOrderId));

            const orderedCatalogs = extractArray(orderRes?.catalogs || orderRes?.tests || orderRes);

            if (orderedCatalogs.length > 0) {
              const seenCatIds = new Set<string>();
              const parsedCatalogs: SelectOption[] = [];
              const catalogIds: string[] = [];

              orderedCatalogs.forEach((c: any, idx: number) => {
                const id = extractId(c, "cat", idx);
                if (id && !seenCatIds.has(id)) {
                  seenCatIds.add(id);
                  catalogIds.push(id);
                  parsedCatalogs.push({
                    id,
                    name: extractName(c, "Test Catalog"),
                  });
                }
              });

              const deptId = orderedCatalogs[0]?.dept_id || orderedCatalogs[0]?.department_id || "";

              if (deptId) setSelectedDepartmentId(deptId);
              setCatalogs(parsedCatalogs);
              if (catalogIds.length > 0) {
                setSelectedCatalogId(catalogIds[0]);
              }

              // 3. Automatically fetch parameters and auto-fill parameter rows
              const loadedParams = await fetchParametersForCatalogs(catalogIds);
              if (loadedParams.length > 0) {
                reset((prev) => ({
                  ...prev,
                  order_id: effectiveOrderId,
                  results: loadedParams.map((param) => ({
                    parameter_id: param.id,
                    result_value: "",
                    flag: "normal" as const,
                    remarks: "",
                  })),
                }));
                toast.success(`Auto-loaded parameters from Order #${effectiveOrderId}`);
              }
            }
          } catch (orderErr) {
            console.warn("Could not auto-populate order catalogs:", orderErr);
          } finally {
            setIsLoadingOrderData(false);
          }
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error(formatApiError(error, "Failed to load department options"));
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    initializeForm();
  }, [isOpen, effectiveOrderId, fetchParametersForCatalogs, reset]);

  // Manual Department Change
  const handleDepartmentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setSelectedDepartmentId(deptId);
    setSelectedCatalogId("");
    setCatalogs([]);
    setParameters([]);

    if (!deptId) return;

    setIsLoadingCatalogs(true);
    try {
      const response: any = await testCatalogService.getCatalogByDeptId(deptId.trim());
      const rawCatalogs = extractArray(response);

      const seenCatIds = new Set<string>();
      const parsedCatalogs: SelectOption[] = [];

      rawCatalogs.forEach((c: any, idx: number) => {
        const id = extractId(c, "cat", idx);
        if (id && !seenCatIds.has(id)) {
          seenCatIds.add(id);
          parsedCatalogs.push({
            id,
            name: extractName(c, "Test Catalog"),
          });
        }
      });

      setCatalogs(parsedCatalogs);
    } catch (error) {
      console.error("Error loading test catalogs:", error);
      toast.error(formatApiError(error, "Failed to load test catalogs"));
    } finally {
      setIsLoadingCatalogs(false);
    }
  };

  // Manual Test Catalog Dropdown Change
  const handleCatalogChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = e.target.value;
    setSelectedCatalogId(catId);

    if (!catId) {
      setParameters([]);
      return;
    }

    await fetchParametersForCatalogs([catId]);
  };

  // Auto-populate parameter rows manually
  const handleAutoPopulateParameters = () => {
    if (parameters.length === 0) {
      toast.error("No parameters loaded. Select a test catalog first.");
      return;
    }

    const currentFormValues = getValues();
    reset({
      ...currentFormValues,
      results: parameters.map((param) => ({
        parameter_id: param.id,
        result_value: "",
        flag: "normal" as const,
        remarks: "",
      })),
    });

    toast.success(`Populated ${parameters.length} parameter row(s).`);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedDepartmentId("");
    setSelectedCatalogId("");
    setCatalogs([]);
    setParameters([]);
    reset({
      order_id: effectiveOrderId,
      verified_by: "Technician",
      results: [{ flag: "normal", parameter_id: "", remarks: "", result_value: "" }],
    });
  };

  const onSubmit = async (values: CreateResultFormValues) => {
    setIsSubmitting(true);
    try {
      await resultService.createResult(values);
      toast.success("Batch diagnostic payload processed successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(formatApiError(error, "Pipeline operation execution rejected"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => (!open ? handleClose() : setIsOpen(true))}>
      <DialogTrigger className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs h-10 px-4 shadow-sm cursor-pointer transition-colors">
        <FilePlus className="h-4 w-4 mr-2" />
        Batch Record Entry
      </DialogTrigger>

      <DialogContent className="w-full max-w-6xl sm:max-w-6xl bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <FilePlus className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
                  Commit Batch Diagnostics Dataset
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Populate laboratory test parameters for the target order.
                </DialogDescription>
              </div>
            </div>

            {isLoadingOrderData && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold animate-pulse border border-blue-100">
                <Zap className="h-3.5 w-3.5" /> Auto-loading order tests...
              </span>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <input type="hidden" {...register("order_id")} />

          {/* Verification Bar */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-slate-100 text-slate-600 rounded-xl border border-slate-200">
                <UserCheck className="h-4 w-4" />
              </span>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Target Order ID
                </Label>
                <p className="text-xs font-semibold text-slate-800">
                  {effectiveOrderId ? `#${effectiveOrderId}` : "No Order Specified"}
                </p>
                {errors.order_id && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.order_id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1">
              <Label className="text-[11px] font-semibold text-slate-600">
                Verified By (Technician)
              </Label>
              <Input
                {...register("verified_by")}
                disabled={isSubmitting}
                className="rounded-xl text-xs h-8.5 bg-white"
                placeholder="Technician Name"
              />
            </div>
          </div>

          {/* Parameter Directory Scope */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px]">
                  1
                </span>
                Test Catalog & Parameter Scope
              </span>

              {parameters.length > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAutoPopulateParameters}
                  disabled={isLoadingParameters || isSubmitting}
                  className="rounded-xl text-xs h-8 border-blue-200 text-blue-700 bg-white hover:bg-blue-50 font-semibold shadow-2xs"
                >
                  <Wand2 className="h-3.5 w-3.5 mr-1 text-blue-600" />
                  Auto-Fill All Parameters ({parameters.length})
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Department Selector */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" /> Department
                </Label>
                <select
                  value={selectedDepartmentId}
                  onChange={handleDepartmentChange}
                  disabled={isLoadingDepartments || isSubmitting}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">
                    {isLoadingDepartments ? "Loading departments..." : "-- Select Department --"}
                  </option>
                  {departments.map((dept, idx) => (
                    <option key={`dept-opt-${dept.id}-${idx}`} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Single Select Test Catalog Dropdown */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                  <FlaskConical className="h-3.5 w-3.5 text-slate-400" /> Test Catalog
                </Label>
                <select
                  value={selectedCatalogId}
                  onChange={handleCatalogChange}
                  disabled={!selectedDepartmentId || isLoadingCatalogs || isSubmitting}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="">
                    {!selectedDepartmentId
                      ? "-- Select Department First --"
                      : isLoadingCatalogs
                      ? "Loading test catalogs..."
                      : catalogs.length === 0
                      ? "No catalogs found"
                      : "-- Select Test Catalog --"}
                  </option>
                  {catalogs.map((cat, idx) => (
                    <option key={`cat-opt-${cat.id}-${idx}`} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Parameter Results Table */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-blue-600" />
                <Label className="text-xs font-bold text-slate-900 tracking-wide uppercase">
                  Diagnostic Parameter Payload ({fields.length})
                </Label>
                {isLoadingParameters && (
                  <span className="flex items-center gap-1 text-xs text-blue-600 font-medium ml-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching parameters...
                  </span>
                )}
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  append({ flag: "normal", parameter_id: "", remarks: "", result_value: "" })
                }
                disabled={isSubmitting}
                className="rounded-xl text-xs h-8 text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Parameter Row
              </Button>
            </div>

            {/* Results Array List */}
            <div className="space-y-2.5">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-2.5 p-3.5 bg-white border border-slate-200 rounded-xl items-end shadow-xs transition-all hover:border-slate-300"
                >
                  {/* Parameter Dropdown */}
                  <div className="col-span-12 sm:col-span-4 space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Parameter
                    </Label>
                    <select
                      {...register(`results.${index}.parameter_id`)}
                      disabled={isSubmitting || isLoadingParameters}
                      className="w-full h-9 px-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer disabled:bg-slate-50"
                    >
                      <option value="">
                        {!selectedCatalogId
                          ? "-- Select Test Catalog First --"
                          : isLoadingParameters
                          ? "Loading parameters..."
                          : parameters.length === 0
                          ? "No parameters available"
                          : "-- Select Parameter --"}
                      </option>
                      {parameters.map((param, pIdx) => (
                        <option key={`param-opt-${param.id}-${pIdx}`} value={param.id}>
                          {param.name} {param.subtext ? `(${param.subtext})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Result Value */}
                  <div className="col-span-6 sm:col-span-3 space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Result Value
                    </Label>
                    <Input
                      {...register(`results.${index}.result_value`)}
                      disabled={isSubmitting}
                      className="rounded-lg text-xs bg-white h-9"
                      placeholder="e.g. 13.5 mg/dL"
                    />
                  </div>

                  {/* Flag Type */}
                  <div className="col-span-6 sm:col-span-2 space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Flag
                    </Label>
                    <select
                      {...register(`results.${index}.flag`)}
                      disabled={isSubmitting}
                      className="w-full h-9 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
                    >
                      <option value="normal">Normal</option>
                      <option value="low">Low</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                      <option value="na">N/A</option>
                    </select>
                  </div>

                  {/* Remarks */}
                  <div className="col-span-10 sm:col-span-2 space-y-1">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Remarks
                    </Label>
                    <Input
                      {...register(`results.${index}.remarks`)}
                      disabled={isSubmitting}
                      className="rounded-lg text-xs bg-white h-9"
                      placeholder="Remarks"
                    />
                  </div>

                  {/* Delete Action */}
                  <div className="col-span-2 sm:col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => fields.length > 1 && remove(index)}
                      disabled={isSubmitting || fields.length === 1}
                      className="text-slate-400 hover:text-red-600 h-9 w-9 p-0 rounded-lg hover:bg-red-50 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {errors.results && (
              <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.results.message}
              </p>
            )}
          </div>

          {/* Dialog Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl text-xs h-10 px-4"
            >
              Cancel & Discard
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-10 px-6 font-semibold tracking-wide shadow-sm"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Committing...
                </span>
              ) : (
                "Verify & Commit Results"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}