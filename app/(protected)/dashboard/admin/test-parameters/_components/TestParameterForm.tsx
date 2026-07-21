"use client";

import React, { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TestParameterSchema, TestParameterFormData } from "@/schemas/test-parameter.schema";
import { testParameterService } from "@/services/test-parameter.service";
import { Loader2, PlusCircle, AlertCircle, X } from "lucide-react";

interface TestParameterFormProps {
  defaultTestId?: string;
  nextSequenceNo?: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function TestParameterForm({
  defaultTestId = "",
  nextSequenceNo = 1,
  onSuccess,
  onClose,
}: TestParameterFormProps) {
  const [loading, setLoading] = useState(false);
  const [errorsList, setErrorsList] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestParameterFormData>({
    resolver: zodResolver(TestParameterSchema) as Resolver<TestParameterFormData>,
    defaultValues: {
      id: "",
      test_id: defaultTestId,
      parameter_name: "",
      result_type: "Numeric",
      unit: "",
      sequence_no: nextSequenceNo,
    },
  });

  const onSubmit = async (data: TestParameterFormData) => {
    setLoading(true);
    setErrorsList([]);
    try {
      const res = await testParameterService.createParameter(data);
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
              <PlusCircle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-800">Create Test Parameter</h2>
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
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Parameter ID</label>
              <input
                {...register("id")}
                placeholder="e.g. PRM-HB"
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.id && <p className="text-[10px] text-rose-500 mt-1">{errors.id.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Test Catalog ID</label>
              <input
                {...register("test_id")}
                placeholder="e.g. TST-CBC"
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.test_id && <p className="text-[10px] text-rose-500 mt-1">{errors.test_id.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Parameter Name</label>
            <input
              {...register("parameter_name")}
              placeholder="e.g. Hemoglobin"
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
            {errors.parameter_name && <p className="text-[10px] text-rose-500 mt-1">{errors.parameter_name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Result Type</label>
              <input
                {...register("result_type")}
                placeholder="e.g. Numeric / Qualitative"
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.result_type && <p className="text-[10px] text-rose-500 mt-1">{errors.result_type.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Unit</label>
              <input
                {...register("unit")}
                placeholder="e.g. g/dL"
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
              {errors.unit && <p className="text-[10px] text-rose-500 mt-1">{errors.unit.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Sequence Number</label>
            <input
              type="number"
              {...register("sequence_no", { valueAsNumber: true })}
              placeholder="1"
              className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
            {errors.sequence_no && <p className="text-[10px] text-rose-500 mt-1">{errors.sequence_no.message}</p>}
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Parameter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}