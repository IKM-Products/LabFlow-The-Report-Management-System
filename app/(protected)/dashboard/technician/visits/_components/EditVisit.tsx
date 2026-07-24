// app/dashboard/technician/visits/_components/EditVisit.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { editVisitSchema, EditVisitFormValues } from "@/schemas/visit.schema";
import { visitService } from "@/services/visit.service";
import { VisitListItem } from "@/types/visit.types";

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

interface EditVisitProps {
  visit: VisitListItem;
  initialPatientId: string;
  initialDoctorId: string;
  onSuccess: () => void;
}

const isValidUuid = (val: string): boolean => {
  if (!val) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(val);
};

export default function EditVisit({
  visit,
  initialPatientId,
  initialDoctorId,
  onSuccess,
}: EditVisitProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSafeId = (idVal: string) => {
    return isValidUuid(idVal) ? idVal : idVal || "";
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditVisitFormValues>({
    resolver: zodResolver(editVisitSchema) as any,
    defaultValues: {
      id: visit.visit_id,
      visit_no: visit.visit_no || "",
      patient_id: getSafeId(initialPatientId),
      doctor_id: getSafeId(initialDoctorId),
      status: visit.status || "registered",
      is_deleted: false,
    },
  });

  // Keep form synced when dialog opens with stable dependency list
  useEffect(() => {
    if (isOpen) {
      reset({
        id: visit.visit_id,
        visit_no: visit.visit_no || "",
        patient_id: getSafeId(initialPatientId),
        doctor_id: getSafeId(initialDoctorId),
        status: visit.status || "registered",
        is_deleted: false,
      });
    }
  }, [
    isOpen,
    visit.visit_id,
    visit.visit_no,
    visit.status,
    initialPatientId,
    initialDoctorId,
    reset,
  ]);

  const handleClose = () => {
    setIsOpen(false);
    reset({
      id: visit.visit_id,
      visit_no: visit.visit_no || "",
      patient_id: getSafeId(initialPatientId),
      doctor_id: getSafeId(initialDoctorId),
      status: visit.status || "registered",
      is_deleted: false,
    });
  };

  const onSubmit = async (values: EditVisitFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(values).map(([key, val]) => {
          if (typeof val === "string") {
            const trimmed = val.trim();
            if (trimmed === "") return [key, null];
            if ((key === "id" || key.endsWith("_id")) && !isValidUuid(trimmed)) {
              return [key, null];
            }
            return [key, trimmed];
          }
          return [key, val];
        })
      );

      await visitService.updateVisit(visit.visit_id, payload as EditVisitFormValues);
      toast.success("Visit record updated successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = Array.isArray(serverMessages)
        ? serverMessages.join(", ")
        : typeof serverMessages === "string"
        ? serverMessages
        : "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (formErrors: any) => {
    console.error("Form Validation Errors:", formErrors);
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstErrorMsg =
        formErrors[errorKeys[0]]?.message || "Please check form validation fields.";
      toast.error(`Validation Error: ${firstErrorMsg}`);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 h-8 px-2 border border-transparent hover:border-blue-100 transition-colors cursor-pointer"
      >
        <Edit2 className="h-3.5 w-3.5" />
      </button>

      <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Edit Visit
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Edit the clinical visit information in the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 mt-2">
            {/* Hidden non-editable fields */}
            <input type="hidden" {...register("id")} />
            <input type="hidden" {...register("patient_id")} />
            <input type="hidden" {...register("doctor_id")} />

            {/* Visit Number */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Visit Number</Label>
              <Input
                {...register("visit_no")}
                disabled={isSubmitting}
                className="rounded-xl border-slate-200 text-xs font-mono"
                placeholder="VST-2026-XXXX"
              />
              {errors.visit_no && (
                <p className="text-[10px] text-red-500 font-medium">{errors.visit_no.message}</p>
              )}
            </div>

            {/* Visit Status */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Visit Status</Label>
              <select
                {...register("status")}
                disabled={isSubmitting}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-950 cursor-pointer"
              >
                <option value="registered">Registered</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && (
                <p className="text-[10px] text-red-500 font-medium">{errors.status.message}</p>
              )}
            </div>

            {/* Inactive Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_deleted"
                disabled={isSubmitting}
                {...register("is_deleted")}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
              />
              <Label
                htmlFor="is_deleted"
                className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
              >
                Mark Inactive/Deleted
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-xl text-xs h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25 cursor-pointer"
              >
                {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}