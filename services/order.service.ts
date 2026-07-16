import api from "@/config/axios";
import { 
  BaseApiResponse, 
  Order, 
  OrderCreatePayload, 
  OrderUpdatePayload 
} from "@/types/order.types";

export const orderService = {
  // POST {{base_url}}/order
  createOrder: async (payload: OrderCreatePayload): Promise<Order> => {
    const response = await api.post<BaseApiResponse<Order>>("/order", payload);
    return response.data.data;
  },

  // GET {{base_url}}/order/{id}
  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get<BaseApiResponse<Order>>(`/order/${id}`);
    return response.data.data;
  },

  // GET {{base_url}}/order/visit/{visit_id}
  getOrdersByVisitId: async (visitId: string): Promise<Order[]> => {
    const response = await api.get<BaseApiResponse<Order[]>>(`/order/visit/${visitId}`);
    return response.data.data;
  },

  // PATCH {{base_url}}/order/{id}
  updateOrder: async (id: string, payload: OrderUpdatePayload): Promise<string> => {
    const response = await api.patch<BaseApiResponse<string>>(`/order/${id}`, payload);
    return response.data.data;
  },
};