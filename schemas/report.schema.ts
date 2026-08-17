import { z } from "zod";

export const REPORT_STATUSES = ["draft", "final", "amended"] as const;

export const createReportSchema = z.object({
  report_no: z.string().min(1, "Report number is required"),
  visit_id: z.string().min(1, "Visit ID is required"),
  status: z.enum(REPORT_STATUSES, {
    message: "Please select a valid report status",
  }).default("draft"),
});

export const editReportSchema = z.object({
  pdf_path: z.string().min(1, "PDF data file location is required"),
  status: z.enum(REPORT_STATUSES).optional(),
});

export const printReportSchema = z.object({
  copy_number: z.coerce.number().min(1, "Copy number must be at least 1"),
});

export type CreateReportFormValues = z.infer<typeof createReportSchema>;
export type EditReportFormValues = z.infer<typeof editReportSchema>;
export type PrintReportFormValues = z.infer<typeof printReportSchema>;