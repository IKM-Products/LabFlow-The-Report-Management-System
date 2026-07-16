import * as z from "zod";

export const orderFormSchema = z.object({
  panel_id: z.string().min(1, "Panel ID is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  status: z.string().min(1, "Status configuration is required"),
  test_id: z.string().min(1, "Test ID reference is required"),
  visit_id: z.string().min(1, "Visit ID link allocation is required"),
});

export const editOrderSchema = z.object({
  panel_id: z.string().min(1, "Panel ID is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  status: z.string().min(1, "Status classification is required"),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
export type EditOrderFormValues = z.infer<typeof editOrderSchema>;