"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PanelComponentSchema, PanelComponentFormData } from "@/schemas/panel.schema";
import { panelService } from "@/services/panel.service";
import { PanelCatalogItem } from "@/types/panel.types";
import { Loader2, Layers, Plus, AlertCircle, X, ListOrdered } from "lucide-react";

interface PanelComponentFormProps {
  panelId: string;
  panelName: string;
  onClose: () => void;
}

export default function PanelComponentForm({ panelId, panelName, onClose }: PanelComponentFormProps) {
  const [catalog, setCatalog] = useState<PanelCatalogItem[]>([]);
  const [fetchingCatalog, setFetchingCatalog] = useState(false);
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

  const loadCatalog = useCallback(async () => {
    setFetchingCatalog(true);
    try {
      const res = await panelService.getPanelCatalog(panelId);
      if (res.success) {
        setCatalog(res.data || []);
      }
    } catch (err: any) {
      console.error("Failed loading catalog", err);
    } finally {
      setFetchingCatalog(false);
    }
  }, [panelId]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const onSubmit = async (data: PanelComponentFormData) => {
    setSubmitting(true);
    setErrorsList([]);
    try {
      const res = await panelService.createPanelComponent(data);
      if (res.success) {
        reset({ panel_id: panelId, test_id: "", sequence_no: catalog.length + 2 });
        loadCatalog();
      }
    } catch (err: any) {
      setErrorsList(Array.isArray(err) ? err : [err.toString()]);
    } finally {
      setSubmitting(false);
    }
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
              <h2 className="text-base font-bold text-slate-800">Panel Catalog Components</h2>
              <p className="text-[11px] text-slate-400 font-medium">{panelName} ({panelId})</p>
            </div>
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

        {/* Add Component Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
          <span className="text-xs font-bold text-slate-700 block">Attach New Test Component</span>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <input
                {...register("test_id")}
                placeholder="Test ID (e.g. TST-HB)"
                className="w-full h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:border-emerald-500 outline-none"
              />
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
            disabled={submitting}
            className="w-full h-9 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Plus className="w-3.5 h-3.5" /> Attach Component</>}
          </button>
        </form>

        {/* Catalog List display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Attached Tests Catalog</span>
            <span className="text-slate-400 font-medium">{catalog.length} Components</span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {fetchingCatalog ? (
              <div className="flex items-center justify-center py-8 text-slate-400 text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                Fetching Catalog...
              </div>
            ) : catalog.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No components attached to this panel yet.
              </p>
            ) : (
              catalog.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center justify-center border border-emerald-100">
                      #{item.sequence_no}
                    </span>
                    <span className="font-semibold text-slate-800">{item.test_id}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">ID: {item.panel_id}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}