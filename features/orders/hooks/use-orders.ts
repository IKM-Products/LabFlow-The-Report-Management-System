import { useState, useEffect, useCallback } from "react";
import { orderService } from "../services/orderService";
import { Order } from "../lib/order-types";

export function useOrders() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderById = useCallback(async (id: string): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      return await orderService.getOrderById(id);
    } catch (err: any) {
      const msg = err.response?.data?.messages?.[0] || "Failed to fetch order details.";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrdersByVisitId = useCallback(async (visitId: string): Promise<Order[]> => {
    setLoading(true);
    setError(null);
    try {
      return await orderService.getOrderByVisitId(visitId);
    } catch (err: any) {
      const msg = err.response?.data?.messages?.[0] || "Failed to fetch orders for this visit.";
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchOrderById,
    fetchOrdersByVisitId,
  };
}