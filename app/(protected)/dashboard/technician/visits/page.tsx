"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, User, ShieldAlert } from "lucide-react";

import { visitService } from "@/services/visit.service";
import { patientService } from "@/services/patient.service";
import { VisitListItem } from "@/types/visit.types";

import VisitForm from "./_components/VisitForm";
import EditVisit from "./_components/EditVisit";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PatientOption {
  id: string;
  name: string;
}

export default function VisitsPage() {
  const [visits, setVisits] = useState<VisitListItem[]>([]);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [activeQueryKey, setActiveQueryKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  // Fetch list of patients and all visits on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingPatients(true);
      setIsLoading(true);
      try {
        const [patientResponse, visitResponse] = await Promise.all([
          patientService.getPatients(),
          visitService.getVisits ? visitService.getVisits() : visitService.getVisitsByPatientId("")
        ]);

        const rawPatients = Array.isArray(patientResponse)
          ? patientResponse
          : patientResponse?.data || [];

        const formattedPatients = rawPatients.map((p: any) => {
          const patientName =
            p.full_name ||
            p.patient_name ||
            (p.first_name
              ? `${p.first_name} ${p.last_name || ""}`.trim()
              : null) ||
            p.name ||
            p.user?.full_name ||
            "Unknown Patient";

          return {
            id: p.patient_id || p.id,
            name: patientName,
          };
        });

        setPatients(formattedPatients);

        const visitsData = Array.isArray(visitResponse)
          ? visitResponse
          : visitResponse?.data || [];
        setVisits(visitsData);
      } catch (error) {
        console.error("Error loading initial visit and patient data:", error);
      } finally {
        setIsLoadingPatients(false);
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const fetchVisits = async (targetPatientId?: string) => {
    setIsLoading(true);
    try {
      let response: any;
      if (targetPatientId && targetPatientId.trim()) {
        response = await visitService.getVisitsByPatientId(targetPatientId.trim());
      } else {
        response = visitService.getVisits 
          ? await visitService.getVisits() 
          : await visitService.getVisitsByPatientId("");
      }

      // Normalize array extraction
      const visitsData = Array.isArray(response)
        ? response
        : response?.data || [];

      setVisits(visitsData);
    } catch (error) {
      console.error("Error fetching visit records:", error);
      setVisits([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPatientId = e.target.value;
    setActiveQueryKey(selectedPatientId);
    fetchVisits(selectedPatientId);
  };

  const handleRefresh = () => {
    fetchVisits(activeQueryKey);
  };

  // Find selected patient name for display in caption
  const selectedPatientName = patients.find((p) => p.id === activeQueryKey)?.name;

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Clinical Visits
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage clinical visits and their information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="rounded-xl h-10 border-slate-200 text-slate-600"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <VisitForm
            defaultPatientId={activeQueryKey}
            onSuccess={() => fetchVisits(activeQueryKey)}
          />
        </div>
      </div>

      {/* Patient Selection Dropdown */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
        <div className="relative flex-1">
          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
          <select
            value={activeQueryKey}
            onChange={handlePatientSelect}
            disabled={isLoadingPatients}
            className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 cursor-pointer disabled:bg-slate-50"
          >
            <option value="">Select a Patient (List of all Visits)</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Data View */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border border-slate-200 rounded-2xl">
          Loading visit data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              {activeQueryKey
                ? `List of all Visits for ${selectedPatientName || activeQueryKey}`
                : "List of all Visits"}
            </TableCaption>
            <TableHeader>
              <tr className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-16 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">Visit No.</TableHead>
                <TableHead className="font-bold text-slate-600">Patient Name</TableHead>
                <TableHead className="font-bold text-slate-600">Referring Doctor</TableHead>
                <TableHead className="font-bold text-slate-600">Visit Status</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {visits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        {activeQueryKey
                          ? "No visit records found for the selected patient."
                          : "No visit records found."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                visits.map((visit, idx) => (
                  <TableRow
                    key={visit.visit_id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    <TableCell className="font-mono text-xs text-slate-400">
                      {idx + 1}
                    </TableCell>

                    <TableCell className="font-mono text-xs font-bold text-slate-900">
                      {visit.visit_no}
                    </TableCell>

                    <TableCell className="font-medium text-slate-900">
                      {visit.patient_name}
                    </TableCell>

                    <TableCell className="text-xs text-slate-700 font-medium">
                      {`Dr. ${visit.doctor_name}`}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                          visit.status === "completed"
                            ? "bg-emerald-50 text-slate-600 border-emerald-50/60"
                            : visit.status === "in_progress" || visit.status === "active"
                            ? "bg-slate-50 text-slate-600 border-slate-50/60"
                            : visit.status === "cancelled"
                            ? "bg-rose-50 text-slate-600 border-rose-50/60"
                            : "bg-amber-50 text-slate-600 border-amber-50/60"
                        }`}
                      >
                        {visit.status === "in_progress"
                          ? "In Progress"
                          : visit.status === "completed"
                          ? "Completed"
                          : visit.status === "cancelled"
                          ? "Cancelled"
                          : "Registered"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap">
                      <EditVisit
                        visit={visit}
                        initialPatientId={activeQueryKey || visit.patient_name}
                        initialDoctorId="SYSTEM_REF"
                        onSuccess={() => fetchVisits(activeQueryKey)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}