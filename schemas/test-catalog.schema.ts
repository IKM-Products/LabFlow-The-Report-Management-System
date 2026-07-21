import * as z from "zod";

export const TestCatalogSchema = z.object({
  dept_id: z.string().min(1, "Department ID is required"),
  id: z.string().min(1, "Test Catalog ID is required"),
  sample_type: z.string().min(1, "Sample type is required"),
  test_code: z.string().min(1, "Test code is required"),
  test_name: z.string().min(1, "Test name is required"),
  test_price: z.number().min(0, "Price must be positive"),
  turnaround_time: z.number().min(0, "Turnaround time must be positive"),
});

export type TestCatalogFormData = z.infer<typeof TestCatalogSchema>;