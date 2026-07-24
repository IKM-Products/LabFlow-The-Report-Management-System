// app/dashboard/technician/results/_components/EditResult.tsx

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { editResultSchema, EditResultFormValues } from "@/schemas/result.schema";
import { resultService } from "@/services/result.service";
import { ResultItem } from "@/types/result.types";

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

interface EditResultProps {
  result: ResultItem;
  onSuccess: () => void;
}

export default function EditResult({ result, onSuccess }: EditResultProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditResultFormValues>({
    resolver: zodResolver(editResultSchema) as any,
    defaultValues: {
      flag: result.flag || "normal",
      remarks: result.remarks || "",
      result_value: result.result_value || "",
      verified_by: result.verified_by || "",
    },
  });

  const onSubmit = async (values: EditResultFormValues) => {
    setIsSubmitting(true);
    try {
      await resultService.updateResult(result.id, values);
      toast.success("Structural dataset record matrix updated successfully.");
      onSuccess();
      setIsOpen(false);
    } catch (error: any) {
      const serverErrors = error.response?.data?.messages;
      toast.error(serverErrors ? serverErrors.join(", ") : "Lifecyle change transmission rejected.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 p-0 border border-transparent hover:border-blue-100 transition-colors cursor-pointer">
        <Edit3 className="h-3.5 w-3.5" />
      </DialogTrigger>

      <DialogContent className="max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 tracking-tight">
            Modify Dynamic Record Matrix
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Alter discrete evaluation values tracking parameters directly on Node Reference <span className="font-mono font-bold text-slate-700">{result.id.slice(0, 8)}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Quantitative Target Result Value</Label>
            <Input {...register("result_value")} disabled={isSubmitting} className="rounded-xl text-xs h-9.5" />
            {errors.result_value && <p className="text-[10px] text-red-500 font-medium">{errors.result_value.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Analytical Severity Flag</Label>
              <select
                {...register("flag")}
                disabled={isSubmitting}
                className="w-full h-9.5 px-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="normal">Normal</option>
                <option value="low">Low</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              {errors.flag && <p className="text-[10px] text-red-500 font-medium">{errors.flag.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Verifier Designation</Label>
              <Input {...register("verified_by")} disabled={isSubmitting} className="rounded-xl text-xs h-9.5" />
              {errors.verified_by && <p className="text-[10px] text-red-500 font-medium">{errors.verified_by.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Clinical Evaluation Remarks</Label>
            <Input {...register("remarks")} disabled={isSubmitting} className="rounded-xl text-xs h-9.5" />
            {errors.remarks && <p className="text-[10px] text-red-500 font-medium">{errors.remarks.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting} className="rounded-xl text-xs h-9.5">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-9.5 px-4 font-bold tracking-wide shadow-sm min-w-24">
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Patch Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}