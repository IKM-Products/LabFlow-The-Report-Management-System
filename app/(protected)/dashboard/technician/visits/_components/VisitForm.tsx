// app/(protected)/dashboard/technician/visits/_components/VisitForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createVisitSchema, CreateVisitFormValues } from "@/schemas/visit.schema";
import { visitService } from "@/services/visit.service";
import { patientService } from "@/services/patient.service";
import { doctorService } from "@/services/doctor.service";

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

interface Option {
  id: string;
  name: string;
}

interface VisitFormProps {
  defaultPatientId?: string;
  onSuccess: () => void;
}

export default function VisitForm({ defaultPatientId = "", onSuccess }: VisitFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const [patients, setPatients] = useState<Option[]>([]);
  const [doctors, setDoctors] = useState<Option[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateVisitFormValues>({
    resolver: zodResolver(createVisitSchema),
    defaultValues: {
      doctor_id: "",
      patient_id: defaultPatientId,
      status: "registered",
      visit_no: "",
    },
  });

  // Keep patient_id form value in sync when defaultPatientId prop changes
  useEffect(() => {
    if (defaultPatientId) {
      setValue("patient_id", defaultPatientId);
    }
  }, [defaultPatientId, setValue]);

  // Load patient and doctor options when dialog opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchDropdownData = async () => {
      setIsLoadingOptions(true);
      try {
        const [patientsRes, doctorsRes] = await Promise.allSettled([
          patientService.getPatients(),
          doctorService.getAllDoctors(),
        ]);

        if (patientsRes.status === "fulfilled" && patientsRes.value) {
          const rawPatients = Array.isArray(patientsRes.value)
            ? patientsRes.value
            : (patientsRes.value as any)?.data || [];

          const formattedPatients = rawPatients.map((p: any) => ({
            id: p.patient_id || p.id,
            name: p.full_name || p.patient_name || p.name || "Unknown Patient",
          }));
          setPatients(formattedPatients);
        }

        if (doctorsRes.status === "fulfilled" && doctorsRes.value) {
          const rawDoctors = Array.isArray(doctorsRes.value)
            ? doctorsRes.value
            : (doctorsRes.value as any)?.data || [];

          const formattedDoctors = rawDoctors.map((d: any) => ({
            id: d.doctor_id || d.id,
            name: d.full_name || d.doctor_name || d.name || `Dr. ${d.first_name || ""} ${d.last_name || ""}`.trim(),
          }));
          setDoctors(formattedDoctors);
        }
      } catch (error) {
        console.error("Failed to load options for form dropdowns:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchDropdownData();
  }, [isOpen]);

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
      // Convert empty strings ("") to null so backend validators accept optional fields
      const payload = Object.fromEntries(
        Object.entries(values).map(([key, val]) => [
          key,
          typeof val === "string" && val.trim() === "" ? null : val,
        ])
      );

      await visitService.createVisit(payload as CreateVisitFormValues);
      toast.success("New visit record created successfully.");
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

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
      >
        <CalendarPlus className="h-4 w-4 mr-2" />
        Add Visit
      </button>

      <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Add New Visit
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Select the patient and doctor to log a new clinical visit in the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
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

            {/* Select Patient Dropdown */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Patient</Label>
              <select
                {...register("patient_id")}
                disabled={isSubmitting || isLoadingOptions}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-950 disabled:opacity-50 cursor-pointer"
              >
                <option value="">
                  {isLoadingOptions ? "Loading patients..." : "-- Select Patient --"}
                </option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
              {errors.patient_id && (
                <p className="text-[10px] text-red-500 font-medium">{errors.patient_id.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Select Doctor Dropdown */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Attending Doctor</Label>
                <select
                  {...register("doctor_id")}
                  disabled={isSubmitting || isLoadingOptions}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-950 disabled:opacity-50 cursor-pointer"
                >
                  <option value="">
                    {isLoadingOptions ? "Loading..." : "-- Select Doctor --"}
                  </option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
                {errors.doctor_id && (
                  <p className="text-[10px] text-red-500 font-medium">{errors.doctor_id.message}</p>
                )}
              </div>

              {/* Status Dropdown */}
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
                className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25 cursor-pointer"
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