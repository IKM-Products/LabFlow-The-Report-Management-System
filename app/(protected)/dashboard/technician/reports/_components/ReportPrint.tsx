"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Printer, Loader2, History } from "lucide-react";
import { toast } from "sonner";

import { printReportSchema, PrintReportFormValues } from "@/schemas/report.schema";
import { reportService } from "@/services/report.service";
import { PrintLog } from "@/types/report.types";

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

interface ReportPrintProps {
  reportId: string;
  reportNo: string;
  onSuccess?: () => void;
}

export default function ReportPrint({ reportId, reportNo, onSuccess }: ReportPrintProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<PrintLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PrintReportFormValues>({
    resolver: zodResolver(printReportSchema) as any,
    defaultValues: { copy_number: 1 },
  });

  const fetchPrintLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await reportService.getReportPrints(reportId);
      if (res.success) setLogs(res.data);
    } catch (err) {
      console.error("Failed fetching print audit matrices:", err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleOpenTimeline = () => {
    setIsOpen(true);
    fetchPrintLogs();
  };

  const onSubmit = async (values: PrintReportFormValues) => {
    setIsSubmitting(true);
    try {
      await reportService.createReportPrint(reportId, values);
      await reportService.updateReport(reportId, {
        status: "final",
        pdf_path: ""
      });
      toast.success("Physical allocation print matrix initialized.");
      reset({ copy_number: 1 });
      fetchPrintLogs();
      onSuccess?.();
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = serverMessages ? serverMessages.join(", ") : "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? setIsOpen(false) : handleOpenTimeline())}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 h-8 w-8 p-0 border border-transparent hover:border-emerald-100 transition-colors cursor-pointer bg-transparent">
        <Printer className="h-3.5 w-3.5" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Print Report
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Prepare {reportNo} for printing after validation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-2 items-end mt-2 pb-4 border-b border-slate-100">
          <div className="col-span-2 space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Number of Copies</Label>
            <Input type="number" {...register("copy_number")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl text-xs h-9 font-bold tracking-wide">
            {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Print"}
          </Button>
        </form>
        {errors.copy_number && <p className="text-[10px] text-red-500 font-medium -mt-2">{errors.copy_number.message}</p>}

        <div className="mt-2 space-y-2">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-slate-500" />
            Output History
          </h3>
          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
            {isLoadingLogs ? (
              <div className="flex justify-center p-6"><Loader2 className="h-4 w-4 text-slate-400 animate-spin" /></div>
            ) : logs.length === 0 ? (
              <p className="text-[11px] text-slate-400 font-medium p-4 text-center">No Output History Found</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex justify-between items-center text-[11px] border border-slate-100 p-2 rounded-xl bg-slate-50/50">
                  <span className="font-medium text-slate-700">Copy Number: <strong className="text-slate-900 font-mono">#{log.copy_number}</strong></span>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}