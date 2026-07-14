"use client";

import { useState } from "react";
import { toast } from "sonner";
import { patientService } from "../services/patientService";
import { PatientFormValues } from "../schemas/patientSchema";

interface UseMutatePatientOptions {
  onSuccess?: () => void;
}

export function useMutatePatient(options?: UseMutatePatientOptions) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * POST: Create Patient
   * Submits a fresh entry payload to create a new patient profile.
   */
  const registerPatient = async (payload: PatientFormValues): Promise<boolean> => {
    try {
      setIsPending(true);
      setError(null);

      await patientService.createPatient(payload);

      toast.success("Patient successfully registered.");
      
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to register patient.";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  /**
   * PATCH: Update Patient
   * Commits modifications to an existing patient file matching their unique ID.
   */
  const updatePatient = async (id: string, payload: Partial<PatientFormValues>): Promise<boolean> => {
    try {
      setIsPending(true);
      setError(null);

      await patientService.updatePatient(id, payload);

      toast.success("Patient details successfully updated.");
      
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update patient.";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return {
    registerPatient,
    updatePatient,
    isPending,
    error,
  };
}