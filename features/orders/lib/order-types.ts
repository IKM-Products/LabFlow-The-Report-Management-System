import * as zod from "zod";
import { orderSchema, createOrderSchema, updateOrderSchema, orderStatusSchema } from "../schemas/orderSchema";

export type OrderStatus = zod.infer<typeof orderStatusSchema>;
export type Order = zod.infer<typeof orderSchema>;
export type CreateOrderInput = zod.infer<typeof createOrderSchema>;
export type UpdateOrderInput = zod.infer<typeof updateOrderSchema>;