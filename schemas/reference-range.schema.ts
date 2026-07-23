import * as z from "zod";

export const ReferenceRangeSchema = z.object({
  id: z.string().optional(),
  parameter_id: z.string().min(1, "Parameter ID is required"),
  gender: z.string().min(1, "Gender selection is required"),
  min_age: z
    .number({error: "Min age must be a number" })
    .min(0, "Min age cannot be negative"),
  max_age: z
    .number({error: "Max age must be a number" })
    .min(0, "Max age cannot be negative"),
  min_value: z
    .number({error: "Min value must be a number" }),
  max_value: z
    .number({error: "Max value must be a number" }),
  text_range: z.string().optional().default(""),
  note: z.string().optional().default(""),
});

export type ReferenceRangeFormData = z.infer<typeof ReferenceRangeSchema>;