"use client";

import { useState, useEffect } from "react";
import { patientService, PatientResponse } from "../services/patientService";

export function usePatients(initialDebounceDelay = 300) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize debouncing cycles for optimized data fetching
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
      
      // Utilize the centralized service instead of direct API instance endpoints
      const data = await patientService.getPatients(query);
      setPatients(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to query patient directory matrix.";
      setError(errorMessage);
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