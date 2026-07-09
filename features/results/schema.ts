import * as zod from "zod";

export const parameterResultSchema = zod.object({
  parameter_id: zod.number(),
  parameter_name: zod.string(),
  unit: zod.string(),
  reference_range: zod.string(),
  result_value: zod.string().min(1, "Result value is required"),
  flag: zod.enum(["normal", "low", "high", "abnormal"]).default("normal"),
  remarks: zod.string().optional(),
});

export const resultEntryFormSchema = zod.object({
  order_id: zod.number(),
  technician_notes: zod.string().optional(),
  results: zod.array(parameterResultSchema).min(1, "At least one parameter result is required"),
});

export type ParameterResultValues = zod.infer<typeof parameterResultSchema>;
export type ResultEntryFormValues = zod.infer<typeof resultEntryFormSchema>;