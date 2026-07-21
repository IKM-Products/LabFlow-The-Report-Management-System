"use client";

import React, { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReferenceRangeSchema, ReferenceRangeFormData } from "@/schemas/reference-range.schema";
import { referenceRangeService } from "@/services/reference-range.service";
import { ReferenceRangeItem } from "@/types/reference-range.types";
import { Loader2, Edit3, AlertCircle, X } from "lucide-react";

interface EditReferenceRangeProps {
  item: ReferenceRangeItem;
  onSuccess: () => void;
  onClose: () => void;
}

// Helper to extract numerical range bounds from string formats like "12 - 16"
const parseNumRange = (strVal: string) => {
  if (!strVal) return { min: 0, max: 0 };
  const parts = strVal.split("-").map((p) => parseFloat(p.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { min: parts[0], max: parts[1] };
  }
  return { min: 0, max: 0 };
};

export default function EditReferenceRange({ item, onSuccess, onClose }: EditReferenceRangeProps) {
  const [loading, setLoading] = useState(false);
  const [errorsList, setErrorsList] = useState<string[]>([]);

  const initialAge = parseNumRange(item.age);
  const initialValue = parseNumRange(item.value);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReferenceRangeFormData>({
    resolver: zodResolver(ReferenceRangeSchema) as Resolver<ReferenceRangeFormData>,
    defaultValues: {
      id: item.ref_id,
      parameter_id: item.parameter_id,
      gender: item.gender || "Both",
      min_age: initialAge.min,
      max_age: initialAge.max || 100,
      min_value: initialValue.min,
      max_value: initialValue.max,
      text_range: item.text_range || "",
      note: item.note || "",
    },
  });

  const onSubmit = async (data: ReferenceRangeFormData) => {
    setLoading(true);
    setErrorsList([]);
    try {
      const res = await referenceRangeService.updateReference({
        ...data,
        text_range: data.text_range || "",
        note: data.note || "",
      });
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
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Edit3 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-800">Edit Reference Range</h2>
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
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Reference ID</label>
              <input
                {...register("id")}
                readOnly
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Parameter ID</label>
              <input
                {...register("parameter_id")}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.parameter_id && <p className="text-[10px] text-rose-500 mt-1">{errors.parameter_id.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Gender</label>
            <select
              {...register("gender")}
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="Both">Both (All Genders)</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <p className="text-[10px] text-rose-500 mt-1">{errors.gender.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Min Age (years)</label>
              <input
                type="number"
                {...register("min_age", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.min_age && <p className="text-[10px] text-rose-500 mt-1">{errors.min_age.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Max Age (years)</label>
              <input
                type="number"
                {...register("max_age", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.max_age && <p className="text-[10px] text-rose-500 mt-1">{errors.max_age.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Min Value</label>
              <input
                type="number"
                step="any"
                {...register("min_value", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.min_value && <p className="text-[10px] text-rose-500 mt-1">{errors.min_value.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Max Value</label>
              <input
                type="number"
                step="any"
                {...register("max_value", { valueAsNumber: true })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.max_value && <p className="text-[10px] text-rose-500 mt-1">{errors.max_value.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Text Range (Qualitative)</label>
            <input
              {...register("text_range")}
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Note / Remarks</label>
            <textarea
              {...register("note")}
              rows={2}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none"
            />
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Reference"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}