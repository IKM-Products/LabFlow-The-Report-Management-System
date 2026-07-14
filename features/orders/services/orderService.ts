import api from "@/axios/instance";
import { Order, CreateOrderInput, UpdateOrderInput } from "../lib/order-types";

export const orderService = {
  // POST {{base_url}}/order
  createOrder: async (data: CreateOrderInput): Promise<Order> => {
    // Sanitize payload parameters to match exactly what your API expects
    const payload = {
      visit_id: data.visit_id,
      test_id: data.test_id === "" ? null : data.test_id,
      panel_id: data.panel_id === "" ? null : data.panel_id,
      price: Number(data.price),
      status: data.status,
    };
    const response = await api.post<Order>("/order", payload);
    return response.data;
  },

  // GET {{base_url}}/order/:id
  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/order/${id}`);
    return response.data;
  },

  // GET {{base_url}}/order/visit/:visitId
  getOrderByVisitId: async (visitId: string): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/order/visit/${visitId}`);
    return response.data;
  },

  // PATCH {{base_url}}/order/:id
  updateOrder: async (id: string, data: UpdateOrderInput): Promise<Order> => {
    // Isolating to send only {"status": "VALUE"} as required
    const payload = {
      status: data.status,
    };
    const response = await api.patch<Order>(`/order/${id}`, payload);
    return response.data;
  }
};