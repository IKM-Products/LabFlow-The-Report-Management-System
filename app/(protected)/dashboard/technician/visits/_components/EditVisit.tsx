// app/dashboard/technician/visits/_components/EditVisit.tsx

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Loader2 } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditVisitProps {
  visit: VisitListItem;
  // Passing mapping details context parameters to cleanly fulfill payload dependency requirements
  initialPatientId: string;
  initialDoctorId: string;
  onSuccess: () => void;
}

export default function EditVisit({ visit, initialPatientId, initialDoctorId, onSuccess }: EditVisitProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditVisitFormValues>({
    resolver: zodResolver(editVisitSchema) as any,
    defaultValues: {
      id: visit.visit_id,
      visit_no: visit.visit_no || "",
      patient_id: initialPatientId || "",
      doctor_id: initialDoctorId || "",
      status: visit.status || "registered",
      is_deleted: false,
    },
  });

  const onSubmit = async (values: EditVisitFormValues) => {
    setIsSubmitting(true);
    try {
      await visitService.updateVisit(visit.visit_id, values);
      toast.success("Encounter structural lifecycle data matrix updated.");
      onSuccess();
      setIsOpen(false);
    } catch (error: any) {
      const serverErrors = error.response?.data?.messages;
      toast.error(serverErrors ? serverErrors.join(", ") : "Encounter transaction update rejected.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 h-8 w-8 p-0 border border-transparent hover:border-blue-100"
        >
          <Edit3 className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 tracking-tight">
            Modify Encounter Record
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Alter tracking metrics bound to Visit Reference <span className="font-mono font-bold text-slate-700">{visit.visit_id.slice(0, 8)}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
          <input type="hidden" {...register("id")} />

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Encounter Serial Number (Visit No)</Label>
            <Input {...register("visit_no")} disabled={isSubmitting} className="rounded-xl text-xs h-9.5 font-mono" />
            {errors.visit_no && <p className="text-[10px] text-red-500 font-medium">{errors.visit_no.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Mapped Patient Reference ID</Label>
            <Input {...register("patient_id")} disabled={isSubmitting} className="rounded-xl text-xs h-9.5 font-mono" />
            {errors.patient_id && <p className="text-[10px] text-red-500 font-medium">{errors.patient_id.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Mapped Doctor Reference ID</Label>
            <Input {...register("doctor_id")} disabled={isSubmitting} className="rounded-xl text-xs h-9.5 font-mono" />
            {errors.doctor_id && <p className="text-[10px] text-red-500 font-medium">{errors.doctor_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Tracking State</Label>
              <select
                {...register("status")}
                disabled={isSubmitting}
                className="w-full h-9.5 px-3 rounded-xl border border-slate-200 bg-white text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="registered">Registered</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="is_deleted"
                disabled={isSubmitting}
                {...register("is_deleted")}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <Label htmlFor="is_deleted" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
                Mark Inactive/Deleted
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting} className="rounded-xl text-xs h-9.5">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-9.5 px-4 font-bold tracking-wide shadow-sm min-w-24">
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}