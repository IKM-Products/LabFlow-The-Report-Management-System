import * as zod from "zod";

export const orderStatusSchema = zod.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"]);

// Complete Order object mapping what comes out of the database
export const orderSchema = zod.object({
  id: zod.string().uuid(),
  visit_id: zod.string().uuid(),
  test_id: zod.string().uuid().nullable().optional(),
  panel_id: zod.string().uuid().nullable().optional(),
  price: zod.number().min(0),
  status: orderStatusSchema,
  order_number: zod.string().optional(),
  created_at: zod.string().optional(),
  updated_at: zod.string().optional(),
});

// Exact schema for: POST {{base_url}}/order
export const createOrderSchema = zod.object({
  visit_id: zod.string().uuid("A valid Visit ID is required"),
  test_id: zod.string().uuid("Invalid Test ID format").or(zod.literal("")).nullable(),
  panel_id: zod.string().uuid("Invalid Panel ID format").or(zod.literal("")).nullable(),
  price: zod.number().min(0, "Price cannot be negative"),
  status: orderStatusSchema,
});

// Exact schema for: PATCH {{base_url}}/order/:id
export const updateOrderSchema = zod.object({
  status: orderStatusSchema,
});