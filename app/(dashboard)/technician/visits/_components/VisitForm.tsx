// app/dashboard/technician/visits/_components/VisitForm.tsx

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createVisitSchema, CreateVisitFormValues } from "@/schemas/visit.schema";
import { visitService } from "@/services/visit.service";

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

interface VisitFormProps {
  defaultPatientId?: string;
  onSuccess: () => void;
}

export default function VisitForm({ defaultPatientId = "", onSuccess }: VisitFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVisitFormValues>({
    resolver: zodResolver(createVisitSchema) as any,
    defaultValues: {
      doctor_id: "",
      patient_id: defaultPatientId,
      status: "registered",
      visit_no: "",
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset({
      doctor_id: "",
      patient_id: defaultPatientId,
      status: "registered",
      visit_no: "",
    });
  };

  const onSubmit = async (values: CreateVisitFormValues) => {
    setIsSubmitting(true);
    try {
      await visitService.createVisit(values);
      toast.success("Clinical admission sequence committed successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      const serverErrors = error.response?.data?.messages;
      toast.error(serverErrors ? serverErrors.join(", ") : "Encounter creation pipeline rejected.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
      <DialogTrigger>
        <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-xs h-10 px-4 shadow-sm">
          <CalendarPlus className="h-4 w-4 mr-2" />
          Initialize New Visit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 tracking-tight">
            Register Admission Entry
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Initialize transactional consultation telemetry maps bound to specialized healthcare entities.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Encounter Serial Number (Visit No)</Label>
            <Input {...register("visit_no")} disabled={isSubmitting} className="rounded-xl text-xs h-9.5 font-mono" placeholder="VST-2026-XXXX" />
            {errors.visit_no && <p className="text-[10px] text-red-500 font-medium">{errors.visit_no.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Target Patient Reference index</Label>
            <Input {...register("patient_id")} disabled={isSubmitting} className="rounded-xl text-xs h-9.5 font-mono" placeholder="PAT-UUID-REF" />
            {errors.patient_id && <p className="text-[10px] text-red-500 font-medium">{errors.patient_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Practitioner Attending ID</Label>
              <Input {...register("doctor_id")} disabled={isSubmitting} className="rounded-xl text-xs h-9.5 font-mono" placeholder="DOC-UUID-REF" />
              {errors.doctor_id && <p className="text-[10px] text-red-500 font-medium">{errors.doctor_id.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Admission Status State</Label>
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
              {errors.status && <p className="text-[10px] text-red-500 font-medium">{errors.status.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="rounded-xl text-xs h-9.5">
              Discard
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-9.5 px-4 font-bold tracking-wide shadow-sm min-w-24">
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Commit Visit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}