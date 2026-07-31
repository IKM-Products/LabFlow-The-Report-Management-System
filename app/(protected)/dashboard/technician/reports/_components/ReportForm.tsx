// app/(protected)/dashboard/technician/reports/_components/ReportForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus, Loader2, User, Plus } from "lucide-react";
import { toast } from "sonner";

import { createReportSchema, CreateReportFormValues } from "@/schemas/report.schema";
import { reportService } from "@/services/report.service";
import { patientService } from "@/services/patient.service";
import { visitService } from "@/services/visit.service";

import { Patient } from "@/types/patient.types";
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

interface ReportFormProps {
  defaultVisitId?: string;
  onSuccess: () => void;
}

const getEntityId = (entity: any): string => {
  if (!entity) return "";
  return String(entity.visit_id || entity.id || entity._id || entity.uuid || "").trim();
};

export default function ReportForm({ defaultVisitId = "", onSuccess }: ReportFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<VisitListItem[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  const [isPatientsLoading, setIsPatientsLoading] = useState<boolean>(false);
  const [isVisitsLoading, setIsVisitsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateReportFormValues>({
    resolver: zodResolver(createReportSchema) as any,
    defaultValues: {
      report_no: "",
      visit_id: defaultVisitId,
    },
  });

  const currentVisitId = watch("visit_id");

  // Load patients when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchPatients = async () => {
      setIsPatientsLoading(true);
      try {
        const res = await patientService.getPatients();
        if (res?.success && Array.isArray(res.data)) {
          setPatients(res.data);
        } else if (Array.isArray(res)) {
          setPatients(res as unknown as Patient[]);
        }
      } catch (error) {
        console.error("Failed to load patients:", error);
      } finally {
        setIsPatientsLoading(false);
      }
    };

    fetchPatients();
  }, [isOpen]);

  // Handle defaultVisitId when modal opens or prop changes
  useEffect(() => {
    if (defaultVisitId) {
      setValue("visit_id", defaultVisitId, { shouldValidate: true });
    }
  }, [defaultVisitId, setValue]);

  // Fetch visits when selectedPatientId changes inside modal
  useEffect(() => {
    if (!selectedPatientId) {
      setVisits([]);
      return;
    }

    const fetchVisits = async () => {
      setIsVisitsLoading(true);
      try {
        const res = await visitService.getVisitsByPatientId(selectedPatientId);
        if (res?.success && Array.isArray(res.data)) {
          setVisits(res.data as VisitListItem[]);
        } else if (Array.isArray(res)) {
          setVisits(res as unknown as VisitListItem[]);
        } else {
          setVisits([]);
        }
      } catch (error) {
        console.error("Failed to load visits for patient:", error);
        setVisits([]);
      } finally {
        setIsVisitsLoading(false);
      }
    };

    fetchVisits();
  }, [selectedPatientId]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPatientId("");
    setVisits([]);
    reset({ report_no: "", visit_id: defaultVisitId });
  };

  const onSubmit = async (values: CreateReportFormValues) => {
    setIsSubmitting(true);
    try {
      await reportService.createReport(values);
      toast.success("Diagnostic report tracking envelope generated successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = serverMessages ? serverMessages.join(", ") : "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPatientDisplayName = (patient: any): string => {
    if (patient.full_name) return patient.full_name;
    if (patient.first_name || patient.last_name) {
      return `${patient.first_name || ""} ${patient.last_name || ""}`.trim();
    }
    if (patient.name) return patient.name;
    return `Patient Profile`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
      {/* Styled DialogTrigger directly to bypass missing asChild support */}
      <DialogTrigger className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl font-medium shadow-xs text-xs h-10 px-4 transition-colors cursor-pointer inline-flex items-center justify-center">
        <Plus className="h-4 w-4 mr-2" />
        Generate Report
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Initialize Diagnostic Report
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Provision structured sequence manifests for record mapping extraction.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Report Reference Number */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Report Reference Number</Label>
            <Input
              {...register("report_no")}
              disabled={isSubmitting}
              className="rounded-xl border-slate-200 text-xs font-mono"
              placeholder="REP-XXXXX"
            />
            {errors.report_no && (
              <p className="text-[10px] text-red-500 font-medium">{errors.report_no.message}</p>
            )}
          </div>

          {/* Hidden registered field for visit_id validation & form state */}
          <input type="hidden" {...register("visit_id")} />

          {/* Patient Selector for Filtering Visits */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-blue-600" />
              Select Patient
            </Label>
            <div className="relative">
              <select
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  setValue("visit_id", "", { shouldValidate: true });
                }}
                disabled={isSubmitting || isPatientsLoading}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-800 disabled:opacity-50 cursor-pointer"
              >
                <option value="">
                  {isPatientsLoading ? "Loading patients..." : "-- Choose Patient --"}
                </option>
                {patients.map((patient: any, index: number) => {
                  const pId = getEntityId(patient);
                  return (
                    <option key={pId || `patient-${index}`} value={pId}>
                      {getPatientDisplayName(patient)} {patient.patient_code ? `(${patient.patient_code})` : ""}
                    </option>
                  );
                })}
              </select>
              {isPatientsLoading && (
                <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin absolute right-3 top-2.5" />
              )}
            </div>
          </div>

          {/* Visit Name Selection Dropdown */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-blue-600" />
              Select Visit Record Name
            </Label>
            <div className="relative">
              <select
                value={currentVisitId}
                onChange={(e) => setValue("visit_id", e.target.value, { shouldValidate: true })}
                disabled={isSubmitting || !selectedPatientId || isVisitsLoading}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">
                  {!selectedPatientId
                    ? "Select a patient first"
                    : isVisitsLoading
                    ? "Loading visits..."
                    : visits.length === 0
                    ? "No visits found"
                    : "-- Choose Visit Name --"}
                </option>
                {visits.map((visit, index) => {
                  const vId = getEntityId(visit);
                  const vNo = visit.visit_no || "";
                  const vDate = visit.visit_date ? String(visit.visit_date).split("T")[0] : "";
                  const displayName = vNo
                    ? `Visit #${vNo}${vDate ? ` (${vDate})` : ""}`
                    : `Visit Record #${index + 1}${vDate ? ` - ${vDate}` : ""}`;
                  return (
                    <option key={vId || `visit-${index}`} value={vId}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
              {isVisitsLoading && (
                <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin absolute right-3 top-2.5" />
              )}
            </div>
            {errors.visit_id && (
              <p className="text-[10px] text-red-500 font-medium">{errors.visit_id.message}</p>
            )}
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
              className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25"
            >
              {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}