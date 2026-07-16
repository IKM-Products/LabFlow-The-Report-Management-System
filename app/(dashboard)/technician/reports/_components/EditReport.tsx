// app/(dashboard)/technician/reports/_components/EditReport.tsx
"use client";

import React, { useState } from "react";
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
    formState: { errors },
  } = useForm<EditReportFormValues>({
    resolver: zodResolver(editReportSchema) as any,
    defaultValues: {
      pdf_path: report.pdf_path || "",
      status: report.status || "draft",
    },
  });

  const onSubmit = async (values: EditReportFormValues) => {
    setIsSubmitting(true);
    try {
      await reportService.updateReport(report.id, values);
      toast.success("Report lifecycle criteria customized successfully.");
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
      <DialogTrigger>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 h-8 px-2 border border-transparent hover:border-blue-100"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Modify Report State
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Update storage nodes and verification metrics profiles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Data File Target Path</Label>
            <Input {...register("pdf_path")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs font-mono" />
            {errors.pdf_path && <p className="text-[10px] text-red-500 font-medium">{errors.pdf_path.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Lifecycle Workflow Status</Label>
            <select 
              {...register("status")} 
              disabled={isSubmitting} 
              className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="verified">Verified</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && <p className="text-[10px] text-red-500 font-medium">{errors.status.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting} className="rounded-xl text-xs h-10">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25">
              {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Commit Modifications"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}