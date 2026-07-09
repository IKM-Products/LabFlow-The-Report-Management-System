"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type { OrderResultProfile, OrderResultsSubmission } from "../types";

export function useResultEntry(orderId: number) {
  const [profile, setProfile] = useState<OrderResultProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient<OrderResultProfile>(`/results/orders/${orderId}`);
      setProfile(data);
    } catch (err: any) {
      const msg = err.message || "Failed to load order parameter layout metrics.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  const submitResults = async (data: OrderResultsSubmission) => {
    try {
      setIsSubmitting(true);
      await apiClient(`/results/${orderId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      toast.success("Laboratory diagnostics recorded and compiled successfully.");
      await fetchOrderProfile(); // Refresh profile state tracking records
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to submit result values to ledger matrix.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderProfile();
    }
  }, [orderId, fetchOrderProfile]);

  return {
    profile,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchOrderProfile,
    submitResults,
  };
}