// schemas/report.schema.ts
import { z } from "zod";

export const createReportSchema = z.object({
  report_no: z.string().min(1, "Report number designation is required"),
  visit_id: z.string().min(1, "Associated Visit ID mapping is required"),
});

export const editReportSchema = z.object({
  pdf_path: z.string().min(1, "PDF file path storage location is required"),
  status: z.string().min(1, "Workflow state designation is required"),
});

export const printReportSchema = z.object({
  copy_number: z.coerce.number().min(1, "Copy sequence allocation must be at least 1"),
});

export type CreateReportFormValues = z.infer<typeof createReportSchema>;
export type EditReportFormValues = z.infer<typeof editReportSchema>;
export type PrintReportFormValues = z.infer<typeof printReportSchema>;