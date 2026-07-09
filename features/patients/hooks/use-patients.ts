"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export interface PatientRecord {
  id: number;
  full_name: string;
  test_id: string;
  age: number;
  gender: string;
  phone: string;
  created_at: string;
}

export function usePatients(initialDebounceDelay = 300) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize debouncing cycles for optimized system throughput
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, initialDebounceDelay);

    return () => clearTimeout(handler);
  }, [searchQuery, initialDebounceDelay]);

  const fetchPatients = async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const url = query ? `/patients?search=${encodeURIComponent(query)}` : "/patients";
      const data = await apiClient<PatientRecord[]>(url);
      setPatients(data);
    } catch (err: any) {
      setError(err.message || "Failed to query patient directory matrix.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(debouncedQuery);
  }, [debouncedQuery]);

  return {
    searchQuery,
    setSearchQuery,
    patients,
    isLoading,
    error,
    refetch: () => fetchPatients(debouncedQuery),
  };
}