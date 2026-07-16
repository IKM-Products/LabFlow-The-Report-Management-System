// schemas/result.schema.ts

import { z } from "zod";

export const createResultSchema = z.object({
  order_id: z.string().min(1, "Order tracking identifier is required"),
  verified_by: z.string().min(1, "Authorized verifier designation is required"),
  results: z.array(
    z.object({
      flag: z.string().min(1, "Diagnostic operational flag is required"),
      parameter_id: z.string().min(1, "Laboratory parameter index mapping is required"),
      remarks: z.string().min(1, "Clinical remarks statement required"),
      result_value: z.string().min(1, "Quantitative result value metric is required"),
    })
  ).min(1, "At least one metrics calculation structure is required"),
});

export const editResultSchema = z.object({
  flag: z.string().min(1, "Diagnostic operational flag is required"),
  remarks: z.string().min(1, "Clinical remarks statement required"),
  result_value: z.string().min(1, "Quantitative result value metric is required"),
  verified_by: z.string().min(1, "Authorized verifier designation is required"),
});

export type CreateResultFormValues = z.infer<typeof createResultSchema>;
export type EditResultFormValues = z.infer<typeof editResultSchema>;