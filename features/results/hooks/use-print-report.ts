"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { OrderResultProfile } from "../types";

export function usePrintReport(orderId: number) {
  const [reportData, setReportData] = useState<OrderResultProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetches verification data models compiled specifically for clean paper layouts
      const data = await apiClient<OrderResultProfile>(`/results/print/${orderId}`);
      setReportData(data);
    } catch (err: any) {
      const msg = err.message || "Failed to parse printing matrix payloads.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  /**
   * Invokes native window hardware runtime routines to fire the hardware printer interface
   */
  const handlePrintExecution = useCallback(() => {
    if (!reportData) {
      toast.error("Cannot invoke hardware subsystem before documents compile completely.");
      return;
    }
    window.print();
  }, [reportData]);

  useEffect(() => {
    if (orderId) {
      fetchReport();
    }
  }, [orderId, fetchReport]);

  return {
    reportData,
    isLoading,
    error,
    refetch: fetchReport,
    triggerPrint: handlePrintExecution,
  };
}