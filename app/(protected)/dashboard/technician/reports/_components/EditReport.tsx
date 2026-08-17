"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { editReportSchema, EditReportFormValues } from "@/schemas/report.schema";
import { reportService } from "@/services/report.service";
import { Report } from "@/types/report.types";

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

interface EditReportProps {
  report: Report;
  onSuccess: () => void;
}

export default function EditReport({ report, onSuccess }: EditReportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditReportFormValues>({
    resolver: zodResolver(editReportSchema),
    defaultValues: {
      pdf_path: report.pdf_path || "",
      status: "amended",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        pdf_path: report.pdf_path || "",
        status: "amended",
      });
    }
  }, [isOpen, report, reset]);

  const onSubmit = async (values: EditReportFormValues) => {
    setIsSubmitting(true);
    try {
      await reportService.updateReport(report.id, {
        ...values,
        status: "amended",
      });
      toast.success("Report updated successfully.");
      onSuccess();
      setIsOpen(false);
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = serverMessages ? serverMessages.join(", ") : "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 h-8 w-8 p-0 border border-transparent hover:border-emerald-100 transition-colors cursor-pointer bg-transparent">
        <Edit2 className="h-3.5 w-3.5" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Edit Report
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Edit the report information in the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Hidden field for status parameter */}
          <input type="hidden" {...register("status")} value="amended" />

          {/* Data File Location */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Data File Location</Label>
            <Input
              {...register("pdf_path")}
              disabled={isSubmitting}
              className="rounded-xl border-slate-200 text-xs font-mono"
              placeholder="/reports/path/to/file.pdf"
            />
            {errors.pdf_path && (
              <p className="text-[10px] text-red-500 font-medium">{errors.pdf_path.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
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