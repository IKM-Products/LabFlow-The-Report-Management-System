import * as z from "zod";

export const PanelSchema = z.object({
  id: z.string().optional(),
  dept_id: z.string().min(1, "Department ID is required"),
  panel_code: z.string().min(1, "Panel code is required"),
  panel_name: z.string().min(1, "Panel name is required"),
  panel_price: z.coerce.number().min(0, "Price must be a positive number"),
});

export const panelFormSchema = PanelSchema;

export const PanelComponentSchema = z.object({
  panel_id: z.string().min(1, "Panel ID is required"),
  test_id: z.string().min(1, "Test ID is required"),
  sequence_no: z.coerce.number().int().min(1, "Sequence number must be at least 1"),
});

export const panelComponentSchema = PanelComponentSchema;

export type PanelFormData = z.infer<typeof PanelSchema>;
export type PanelFormValues = z.infer<typeof panelFormSchema>;

export type PanelComponentFormData = z.infer<typeof PanelComponentSchema>;
export type PanelComponentFormValues = z.infer<typeof panelComponentSchema>;