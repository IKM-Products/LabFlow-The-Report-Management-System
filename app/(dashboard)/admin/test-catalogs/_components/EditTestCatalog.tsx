"use client";

import React, { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TestCatalogSchema, TestCatalogFormData } from "@/schemas/test-catalog.schema";
import { testCatalogService } from "@/services/test-catalog.service";
import { TestCatalogItem } from "@/types/test-catalog.types";
import { Loader2, Edit3, AlertCircle, X } from "lucide-react";

interface EditTestCatalogProps {
  item: TestCatalogItem;
  onSuccess: () => void;
  onClose: () => void;
}

export default function EditTestCatalog({ item, onSuccess, onClose }: EditTestCatalogProps) {
  const [loading, setLoading] = useState(false);
  const [errorsList, setErrorsList] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestCatalogFormData>({
    resolver: zodResolver(TestCatalogSchema) as Resolver<TestCatalogFormData>,
    defaultValues: {
      id: item.test_catalog_id,
      dept_id: item.dept_id,
      sample_type: item.sample_type,
      test_code: item.test_code,
      test_name: item.test_name,
      test_price: item.test_price,
      turnaround_time: item.turnaround_time,
    },
  });

  const onSubmit = async (data: TestCatalogFormData) => {
    setLoading(true);
    setErrorsList([]);
    try {
      const res = await testCatalogService.updateCatalog(data);
      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setErrorsList(Array.isArray(err) ? err : [err.toString()]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Edit3 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-800">Edit Test Catalog</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Catalog ID</label>
              <input
                {...register("id")}
                readOnly
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Department ID</label>
              <input
                {...register("dept_id")}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.dept_id && <p className="text-[10px] text-rose-500 mt-1">{errors.dept_id.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Test Code</label>
              <input
                {...register("test_code")}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.test_code && <p className="text-[10px] text-rose-500 mt-1">{errors.test_code.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Sample Type</label>
              <input
                {...register("sample_type")}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.sample_type && <p className="text-[10px] text-rose-500 mt-1">{errors.sample_type.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Test Name</label>
            <input
              {...register("test_name")}
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
            {errors.test_name && <p className="text-[10px] text-rose-500 mt-1">{errors.test_name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Test Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("test_price", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.test_price && <p className="text-[10px] text-rose-500 mt-1">{errors.test_price.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Turnaround Time (hrs)</label>
              <input
                type="number"
                {...register("turnaround_time", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.turnaround_time && <p className="text-[10px] text-rose-500 mt-1">{errors.turnaround_time.message}</p>}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Catalog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}