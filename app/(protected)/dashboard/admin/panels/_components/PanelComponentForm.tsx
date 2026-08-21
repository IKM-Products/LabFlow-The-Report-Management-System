"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PanelComponentSchema, PanelComponentFormData } from "@/schemas/panel.schema";
import { panelService } from "@/services/panel.service";
import { testCatalogService } from "@/services/test-catalog.service";
import { departmentService } from "@/services/department.service";
import { PanelCatalogItem } from "@/types/panel.types";
import { TestCatalogItem } from "@/types/test-catalog.types";
import { Loader2, Layers, AlertCircle, X, RotateCcw } from "lucide-react";

interface PanelComponentFormProps {
  panelId: string;
  panelName: string;
  onClose: () => void;
}

export default function PanelComponentForm({
  panelId,
  panelName,
  onClose,
}: PanelComponentFormProps) {
  const [catalog, setCatalog] = useState<PanelCatalogItem[]>([]);
  const [availableTests, setAvailableTests] = useState<TestCatalogItem[]>([]);
  const [fetchingCatalog, setFetchingCatalog] = useState(false);
  const [fetchingTests, setFetchingTests] = useState(false);
  const [testCatalogError, setTestCatalogError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorsList, setErrorsList] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PanelComponentFormData>({
    resolver: zodResolver(PanelComponentSchema) as Resolver<PanelComponentFormData, any>,
    defaultValues: {
      panel_id: panelId,
      test_id: "",
      sequence_no: 1,
    },
  });

  // Load existing panel components
  const loadCatalog = useCallback(async () => {
    setFetchingCatalog(true);
    try {
      const res = await panelService.getPanelCatalog(panelId);
      if (Array.isArray(res)) {
        setCatalog(res);
      } else if (res && Array.isArray((res as any).data)) {
        setCatalog((res as any).data);
      } else {
        setCatalog([]);
      }
    } catch (err: any) {
      console.error("Failed loading catalog", err);
      setCatalog([]);
    } finally {
      setFetchingCatalog(false);
    }
  }, [panelId]);

  // Load available test options for the dropdown safely using department + catalog services
  const loadAvailableTests = useCallback(async () => {
    setFetchingTests(true);
    setTestCatalogError(null);
    try {
      const depts = await departmentService.getDepartments();
      if (Array.isArray(depts) && depts.length > 0) {
        const catalogPromises = depts.map((d) =>
          testCatalogService.getCatalogByDeptId(d.dept_id).catch(() => [])
        );
        const results = await Promise.all(catalogPromises);
        const allItems = results.flat();
        setAvailableTests(allItems);
      } else {
        setAvailableTests([]);
      }
    } catch (err: any) {
      console.error("Failed loading available test catalogs:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "Failed to load tests due to a network issue.";
      setTestCatalogError(errorMessage);
      setAvailableTests([]);
    } finally {
      setFetchingTests(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
    loadAvailableTests();
  }, [loadCatalog, loadAvailableTests]);

  const onSubmit = async (data: PanelComponentFormData) => {
    setSubmitting(true);
    setErrorsList([]);
    try {
      await panelService.createPanelComponent(data);
      reset({ panel_id: panelId, test_id: "", sequence_no: catalog.length + 2 });
      loadCatalog();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || err.toString();
      setErrorsList(Array.isArray(err) ? err : [errMsg]);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to resolve and display the Test Name instead of raw ID
  const getTestName = (item: PanelCatalogItem) => {
    const directName = (item as any).test_name || (item as any).test_catalog_name;
    if (directName) return directName;

    const matchedTest = availableTests.find(
      (t) => t.test_catalog_id === item.test_id
    );

    return matchedTest?.test_name || item.test_id;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Test Panel Component</h2>
              <p className="text-slate-600 text-xs">{panelName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Errors */}
        {errorsList.length > 0 && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl space-y-1">
            {errorsList.map((msg, i) => (
              <p key={i} className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {msg}
              </p>
            ))}
          </div>
        )}

        {/* Add Component Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
          <span className="text-xs font-bold text-slate-700 block">Add New Test Panel Component</span>

          <div className="grid grid-cols-3 gap-2">
            {/* Dropdown Select for Test Catalog */}
            <div className="col-span-2">
              <select
                {...register("test_id")}
                disabled={fetchingTests || !!testCatalogError}
                className="w-full h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:border-emerald-500 outline-none text-slate-800 cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {fetchingTests
                    ? "Loading test catalogs..."
                    : testCatalogError
                    ? "Unable to load tests"
                    : "Select a Test Catalog"}
                </option>
                {availableTests.map((test) => (
                  <option key={test.test_catalog_id} value={test.test_catalog_id}>
                    {test.test_name} {test.test_code ? `(${test.test_code})` : ""}
                  </option>
                ))}
              </select>

              {/* Inline Network Error Alert + Retry Button */}
              {testCatalogError && (
                <div className="mt-1 flex items-center justify-between text-[10px] text-rose-500 font-medium bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                  <span className="truncate max-w-42.5">{testCatalogError}</span>
                  <button
                    type="button"
                    onClick={loadAvailableTests}
                    className="flex items-center gap-0.5 text-emerald-700 hover:underline font-bold cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> Retry
                  </button>
                </div>
              )}

              {errors.test_id && <p className="text-[10px] text-rose-500 mt-0.5">{errors.test_id.message}</p>}
            </div>

            <div>
              <input
                type="number"
                {...register("sequence_no")}
                placeholder="Seq #"
                className="w-full h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:border-emerald-500 outline-none"
              />
              {errors.sequence_no && <p className="text-[10px] text-rose-500 mt-0.5">{errors.sequence_no.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || fetchingTests}
            className="w-full h-9 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <>Save</>}
          </button>
        </form>

        {/* Catalog List display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Added Test Catalogs</span>
            <span className="text-slate-400 font-medium">{catalog.length} Test Panel Components</span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {fetchingCatalog ? (
              <div className="flex items-center justify-center py-8 text-slate-400 text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                Fetching Test Catalogs...
              </div>
            ) : catalog.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No components added to this panel yet.
              </p>
            ) : (
              catalog.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center justify-center border border-emerald-100 shrink-0">
                      #{item.sequence_no}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {getTestName(item)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}