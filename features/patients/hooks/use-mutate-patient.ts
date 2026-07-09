"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

interface MutationPayload {
  full_name: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
}

interface UseMutatePatientOptions {
  onSuccess?: () => void;
}

export function useMutatePatient(options?: UseMutatePatientOptions) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerPatient = async (payload: MutationPayload) => {
    try {
      setIsPending(true);
      setError(null);

      await apiClient("/patients", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Demographic record successfully registered.");
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to commit registration lifecycle metrics.";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return {
    registerPatient,
    isPending,
    error,
  };
}