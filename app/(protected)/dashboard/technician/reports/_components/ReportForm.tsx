"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

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
} from "@/components/ui/dialog";

interface ReportFormProps {
  defaultVisitId?: string;
  onSuccess: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export default function ReportForm({
  defaultVisitId = "",
  onSuccess,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  showTrigger = true,
}: ReportFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;

  const setIsOpen = (value: boolean) => {
    if (isControlled) {
      externalOnOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof createReportSchema>, any, CreateReportFormValues>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      report_no: "",
      visit_id: defaultVisitId,
      status: "draft",
    },
  });

  // Keep visit_id form state in sync with prop updates
  useEffect(() => {
    if (defaultVisitId) {
      setValue("visit_id", defaultVisitId, { shouldValidate: true });
    }
  }, [defaultVisitId, setValue]);

  const handleClose = () => {
    setIsOpen(false);
    reset({ report_no: "", visit_id: defaultVisitId, status: "draft" });
  };

  const onSubmit = async (values: CreateReportFormValues) => {
    if (!values.visit_id) {
      toast.error("Please select a Visit from the page first.");
      return;
    }

    setIsSubmitting(true);
    try {
      await reportService.createReport({
        ...values,
        status: "draft",
      });
      toast.success("Clinical report generated successfully.");
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

  const handleOpenModal = () => {
    if (!defaultVisitId) {
      toast.error("Please select a Patient and Visit before adding a report.");
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      {showTrigger && !isControlled && (
        <Button
          type="button"
          onClick={handleOpenModal}
          className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl font-medium shadow-xs text-sm h-10 px-4 transition-colors cursor-pointer inline-flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Report
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Add New Report
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enter the required information to create a new report in the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            {/* Hidden form bindings */}
            <input type="hidden" {...register("visit_id")} />
            <input type="hidden" {...register("status")} value="draft" />

            {/* Report Reference Number */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Report No.</Label>
              <Input
                {...register("report_no")}
                disabled={isSubmitting}
                className="rounded-xl border-slate-200 text-xs font-mono"
                placeholder="RPT-XXXXX-XXX"
              />
              {errors.report_no && (
                <p className="text-[10px] text-red-500 font-medium">{errors.report_no.message}</p>
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
    </>
  );
}