import * as z from "zod";

export const TestParameterSchema = z.object({
  id: z.string().min(1, "Parameter ID is required"),
  test_id: z.string().min(1, "Test Catalog ID is required"),
  parameter_name: z.string().min(1, "Parameter name is required"),
  result_type: z.string().min(1, "Result type is required"),
  unit: z.string().min(1, "Unit is required"),
  sequence_no: z
    .number({ error: "Sequence number must be a valid number" })
    .min(1, "Sequence number must be at least 1"),
});

export type TestParameterFormData = z.infer<typeof TestParameterSchema>;