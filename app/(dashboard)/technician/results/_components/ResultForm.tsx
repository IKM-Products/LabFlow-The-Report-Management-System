// app/dashboard/technician/results/_components/ResultForm.tsx

"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createResultSchema, CreateResultFormValues } from "@/schemas/result.schema";
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
  DialogTrigger,
} from "@/components/ui/dialog";

interface ResultFormProps {
  defaultOrderId?: string;
  onSuccess: () => void;
}

export default function ResultForm({ defaultOrderId = "", onSuccess }: ResultFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateResultFormValues>({
    resolver: zodResolver(createResultSchema) as any,
    defaultValues: {
      order_id: defaultOrderId,
      verified_by: "",
      results: [{ flag: "normal", parameter_id: "", remarks: "", result_value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "results",
  });

  const handleClose = () => {
    setIsOpen(false);
    reset({
      order_id: defaultOrderId,
      verified_by: "",
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
      const serverErrors = error.response?.data?.messages;
      toast.error(serverErrors ? serverErrors.join(", ") : "Pipeline operation execution rejected.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
      <DialogTrigger>
        <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs h-10 px-4 shadow-sm">
          <FilePlus className="h-4 w-4 mr-2" />
          Batch Record Entry
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 tracking-tight">
            Commit Batch Diagnostics Dataset
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Provision array-based laboratory validation entries bound to operational work orders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Order System Tracking Target</Label>
              <Input {...register("order_id")} disabled={isSubmitting} className="rounded-xl text-xs font-mono h-9" placeholder="ORD-XXXXX" />
              {errors.order_id && <p className="text-[10px] text-red-500 font-medium">{errors.order_id.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Authorizing Verifier Reference</Label>
              <Input {...register("verified_by")} disabled={isSubmitting} className="rounded-xl text-xs h-9" placeholder="Dr. Practitioner Name" />
              {errors.verified_by && <p className="text-[10px] text-red-500 font-medium">{errors.verified_by.message}</p>}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-bold text-slate-900 tracking-wide uppercase">Metrics Sequence Array</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => append({ flag: "normal", parameter_id: "", remarks: "", result_value: "" })}
                disabled={isSubmitting}
                className="rounded-xl text-[11px] h-8 text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-50"
              >
                <Plus className="h-3 w-3 mr-1" />
                Append Parameter
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 p-3 bg-slate-50/70 border border-slate-100 rounded-xl items-end relative">
                <div className="col-span-3 space-y-1">
                  <Label className="text-[10px] font-semibold text-slate-600">Parameter Mapping</Label>
                  <Input {...register(`results.${index}.parameter_id`)} disabled={isSubmitting} className="rounded-lg text-xs font-mono bg-white h-8.5" placeholder="PAR-ID" />
                </div>

                <div className="col-span-3 space-y-1">
                  <Label className="text-[10px] font-semibold text-slate-600">Recorded Metric</Label>
                  <Input {...register(`results.${index}.result_value`)} disabled={isSubmitting} className="rounded-lg text-xs bg-white h-8.5" placeholder="Value" />
                </div>

                <div className="col-span-2 space-y-1">
                  <Label className="text-[10px] font-semibold text-slate-600">Flag Type</Label>
                  <select
                    {...register(`results.${index}.flag`)}
                    disabled={isSubmitting}
                    className="w-full h-8.5 px-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="col-span-3 space-y-1">
                  <Label className="text-[10px] font-semibold text-slate-600">Remarks</Label>
                  <Input {...register(`results.${index}.remarks`)} disabled={isSubmitting} className="rounded-lg text-xs bg-white h-8.5" placeholder="Observations" />
                </div>

                <div className="col-span-1 flex justify-center pb-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => fields.length > 1 && remove(index)}
                    disabled={isSubmitting || fields.length === 1}
                    className="text-slate-400 hover:text-red-600 h-8.5 w-8.5 p-0 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {errors.results && <p className="text-[10px] text-red-500 font-medium">{errors.results.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="rounded-xl text-xs h-10">
              Discard Changes
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-10 px-5 font-bold tracking-wide min-w-28 shadow-sm">
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Verify & Commit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}