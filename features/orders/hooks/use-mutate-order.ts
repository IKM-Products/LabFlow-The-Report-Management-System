import { useState } from "react";
import { orderService } from "../services/orderService";
import { CreateOrderInput, UpdateOrderInput, Order } from "../lib/order-types";
import { toast } from "sonner";

export function useMutateOrder() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const createOrder = async (data: CreateOrderInput, onSuccess?: () => void): Promise<Order | null> => {
    setIsSubmitting(true);
    try {
      const newOrder = await orderService.createOrder(data);
      toast.success("Order created successfully.");
      if (onSuccess) onSuccess();
      return newOrder;
    } catch (err: any) {
      handleBackendRejection(err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateOrder = async (id: string, data: UpdateOrderInput, onSuccess?: () => void): Promise<Order | null> => {
    setIsSubmitting(true);
    try {
      const updated = await orderService.updateOrder(id, data);
      toast.success(`Order set to ${data.status.toLowerCase()} successfully.`);
      if (onSuccess) onSuccess();
      return updated;
    } catch (err: any) {
      handleBackendRejection(err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackendRejection = (err: any) => {
    const errorMsg = err.response?.data?.messages?.[0] || 
                     err.response?.data?.message || 
                     "Operation failed.";
    toast.error(errorMsg);
    
    console.warn("--- BACKEND SERVER REJECTION DETAILS ---");
    console.log("Raw Server Error Object:", err.response?.data);
  };

  return {
    isSubmitting,
    createOrder,
    updateOrder,
  };
}