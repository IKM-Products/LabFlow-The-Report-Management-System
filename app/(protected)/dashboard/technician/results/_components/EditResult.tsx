// app/dashboard/technician/results/_components/EditResult.tsx

"use client";

import React, { useState, useEffect } from "react";
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

/**
 * Checks whether a string resembles an ID (Numeric, UUID, or MongoDB ObjectId)
 */
const isIdString = (val?: string): boolean => {
  if (!val) return false;
  const str = String(val).trim();
  const isNumeric = /^\d+$/.test(str);
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(str);
  const isUUID =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

  return isNumeric || isMongoId || isUUID;
};

/**
 * Safely resolves the human technician name for visual display
 */
const resolveTechnicianName = (result: ResultItem): string => {
  const res = result as any;

  if (res.technician?.name) return res.technician.name;
  if (res.verified_by_user?.name) return res.verified_by_user.name;
  if (res.user?.name) return res.user.name;
  if (res.technician_name) return res.technician_name;
  if (res.verified_by_name) return res.verified_by_name;

  if (res.verified_by && typeof res.verified_by === "string" && !isIdString(res.verified_by)) {
    return res.verified_by;
  }

  return "Technician";
};

export default function EditResult({ result, onSuccess }: EditResultProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayName =
    (result as any).parameter_name ||
    (result as any).name ||
    (result as any).test_name ||
    "Diagnostic Parameter";

  const technicianDisplayName = resolveTechnicianName(result);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditResultFormValues>({
    resolver: zodResolver(editResultSchema) as any,
    defaultValues: {
      flag: result.flag || "normal",
      remarks: result.remarks || "",
      result_value: result.result_value || "",
      verified_by: technicianDisplayName,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        flag: result.flag || "normal",
        remarks: result.remarks || "",
        result_value: result.result_value || "",
        verified_by: resolveTechnicianName(result),
      });
    }
  }, [isOpen, result, reset]);

  const onSubmit = async (values: EditResultFormValues) => {
    setIsSubmitting(true);
    try {
      // Send result.verified_by (the actual UUID) in payload to pass backend validation
      const payload = {
        flag: values.flag,
        remarks: values.remarks,
        result_value: values.result_value,
        verified_by: result.verified_by, 
      };

      await resultService.updateResult(result.id, payload);
      toast.success("Result updated successfully.");
      onSuccess();
      setIsOpen(false);
    } catch (error: any) {
      const serverErrors = error.response?.data?.messages;
      toast.error(serverErrors ? serverErrors.join(", ") : "Failed to update result.");
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
            Modify Result
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Updating result for{" "}
            <span className="font-semibold text-slate-800">{displayName}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Result Value</Label>
            <Input
              {...register("result_value")}
              disabled={isSubmitting}
              className="rounded-xl text-xs h-9.5"
            />
            {errors.result_value && (
              <p className="text-[10px] text-red-500 font-medium">
                {errors.result_value.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Flag</Label>
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
              {errors.flag && (
                <p className="text-[10px] text-red-500 font-medium">{errors.flag.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Verified By</Label>
              <Input
                value={technicianDisplayName}
                disabled={true}
                readOnly
                className="rounded-xl text-xs h-9.5 bg-slate-50 text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Remarks</Label>
            <Input
              {...register("remarks")}
              disabled={isSubmitting}
              className="rounded-xl text-xs h-9.5"
            />
            {errors.remarks && (
              <p className="text-[10px] text-red-500 font-medium">{errors.remarks.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
              className="rounded-xl text-xs h-9.5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl text-xs h-9.5 px-4 font-bold tracking-wide shadow-sm min-w-24"
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}