import { axiosInstance } from "@/config/axios";
import { 
  BaseApiResponse, 
  Order, 
  OrderListItem,
  OrderCreatePayload, 
  OrderUpdatePayload 
} from "@/types/order.types";

export const orderService = {
  // GET {{base_url}}/order/list
  getOrders: async (): Promise<OrderListItem[]> => {
    const response = await axiosInstance.get<BaseApiResponse<OrderListItem[]>>("/order/list");
    return response.data.data;
  },

  // POST {{base_url}}/order
  createOrder: async (payload: OrderCreatePayload): Promise<Order> => {
    const response = await axiosInstance.post<BaseApiResponse<Order>>("/order", payload);
    return response.data.data;
  },

  // GET {{base_url}}/order/{id}
  getOrderById: async (id: string): Promise<Order> => {
    const response = await axiosInstance.get<BaseApiResponse<Order>>(`/order/${id}`);
    return response.data.data;
  },

  // GET {{base_url}}/order/visit/{visit_id}
  getOrdersByVisitId: async (visitId: string): Promise<Order[]> => {
    const response = await axiosInstance.get<BaseApiResponse<Order[]>>(`/order/visit/${visitId}`);
    return response.data.data;
  },

  // PATCH {{base_url}}/order/{id}
  updateOrder: async (id: string, payload: OrderUpdatePayload): Promise<string> => {
    const response = await axiosInstance.patch<BaseApiResponse<string>>(`/order/${id}`, payload);
    return response.data.data;
  },
};