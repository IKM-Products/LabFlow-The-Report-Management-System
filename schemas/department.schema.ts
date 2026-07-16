import * as z from "zod";

export const departmentFormSchema = z.object({
  dept_name: z.string().min(2, "Department name must contain at least 2 characters"),
  dept_description: z.string().min(5, "Description must contain at least 5 characters"),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;