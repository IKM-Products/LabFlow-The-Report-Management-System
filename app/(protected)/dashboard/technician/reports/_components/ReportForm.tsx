// app/(dashboard)/technician/reports/_components/ReportForm.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createReportSchema, CreateReportFormValues } from "@/schemas/report.schema";
import { reportService } from "@/services/report.service";

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

export default function ReportForm({ defaultVisitId = "", onSuccess }: ReportFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateReportFormValues>({
    resolver: zodResolver(createReportSchema) as any,
    defaultValues: {
      report_no: "",
      visit_id: defaultVisitId,
    },
  });

  const handleClose = () => {
    setIsOpen(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
      <DialogTrigger className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-xs text-xs h-10 px-4 transition-colors cursor-pointer">
        <FilePlus className="h-4 w-4 mr-2" />
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
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Report Reference Number</Label>
            <Input {...register("report_no")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs font-mono" placeholder="REP-XXXXX" />
            {errors.report_no && <p className="text-[10px] text-red-500 font-medium">{errors.report_no.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Visit Tracking Identifier</Label>
            <Input {...register("visit_id")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs font-mono" />
            {errors.visit_id && <p className="text-[10px] text-red-500 font-medium">{errors.visit_id.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="rounded-xl text-xs h-10">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25">
              {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm Pipeline"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}