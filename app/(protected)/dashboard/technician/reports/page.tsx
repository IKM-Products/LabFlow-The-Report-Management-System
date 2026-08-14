"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  ShieldAlert,
  UserRound,
  MapPin,
} from "lucide-react";

import { reportService } from "@/services/report.service";
import { patientService } from "@/services/patient.service";
import { visitService } from "@/services/visit.service";

import { Report } from "@/types/report.types";
import { Patient } from "@/types/patient.types";
import { VisitListItem } from "@/types/visit.types";

import ReportForm from "./_components/ReportForm";
import EditReport from "./_components/EditReport";
import ReportPrint from "./_components/ReportPrint";
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

/**
 * Validates standard UUID v4/v1 format
 */
const isValidUUID = (str?: string): boolean => {
  if (!str || str === "undefined" || str === "null") return false;
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str.trim());
};

/**
 * Safely extracts entity primary key across backend field variations
 */
const getEntityId = (entity: any): string => {
  if (!entity) return "";
  return String(
    entity.visit_id || entity.patient_id || entity.id || entity._id || entity.uuid || ""
  ).trim();
};

export default function ReportsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<VisitListItem[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedVisitId, setSelectedVisitId] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState<boolean>(false);
  const [isLoadingVisits, setIsLoadingVisits] = useState<boolean>(false);

  // Load initial patient list on mount
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoadingPatients(true);
      try {
        const res = await patientService.getPatients();
        if (res?.success && Array.isArray(res.data)) {
          setPatients(res.data);
        } else if (Array.isArray(res)) {
          setPatients(res as unknown as Patient[]);
        }
      } catch (error) {
        console.error("Failed to load patients:", error);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  // Fetch visits when patient changes
  const fetchVisitsByPatient = useCallback(async (patientId: string) => {
    if (!patientId || !isValidUUID(patientId)) {
      setVisits([]);
      setSelectedVisitId("");
      setReports([]);
      return;
    }

    setIsLoadingVisits(true);
    setSelectedVisitId("");
    setReports([]);
    try {
      const res = await visitService.getVisitsByPatientId(patientId);
      if (res?.success && Array.isArray(res.data)) {
        setVisits(res.data as VisitListItem[]);
      } else if (Array.isArray(res)) {
        setVisits(res as unknown as VisitListItem[]);
      } else {
        setVisits([]);
      }
    } catch (error) {
      console.error("Failed to load visits for patient:", error);
      setVisits([]);
    } finally {
      setIsLoadingVisits(false);
    }
  }, []);

  // Fetch reports for a selected visit
  const fetchReports = useCallback(async (visitId: string) => {
    if (!visitId || !isValidUUID(visitId)) {
      setReports([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await reportService.getReportsByVisitId(visitId);
      if (response?.success && Array.isArray(response.data)) {
        setReports(response.data);
      } else if (Array.isArray(response)) {
        setReports(response as unknown as Report[]);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    setSelectedPatientId(patientId);
    setSelectedVisitId("");
    fetchVisitsByPatient(patientId);
  };

  const handleVisitSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const visitId = e.target.value;
    setSelectedVisitId(visitId);
    fetchReports(visitId);
  };

  const handleRefresh = () => {
    if (selectedVisitId) {
      fetchReports(selectedVisitId);
    }
  };

  const getPatientDisplayName = (patient: any): string => {
    if (patient.full_name) return patient.full_name;
    if (patient.first_name || patient.last_name) {
      return `${patient.first_name || ""} ${patient.last_name || ""}`.trim();
    }
    if (patient.name) return patient.name;
    return `Patient Profile`;
  };

  // Find active patient and visit objects for display texts
  const currentPatient = patients.find((p) => getEntityId(p) === selectedPatientId);
  const currentPatientName = currentPatient ? getPatientDisplayName(currentPatient) : "";

  const currentVisit = visits.find((v) => getEntityId(v) === selectedVisitId);
  const currentVisitNo = currentVisit?.visit_no
    ? `Visit #${currentVisit.visit_no}`
    : "Selected Visit";

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Clinical Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage clinical reports and their information.
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

          <ReportForm
            defaultVisitId={selectedVisitId}
            onSuccess={() => fetchReports(selectedVisitId)}
          />
        </div>
      </div>

      {/* Filter Controls (Patient & Visit Dropdowns) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Patient Selection Dropdown */}
        <div className="relative">
          <UserRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
          <select
            value={selectedPatientId}
            onChange={handlePatientSelect}
            disabled={isLoadingPatients}
            className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
          >
            <option value="">
              {isLoadingPatients ? "Loading patients..." : "Select a Patient"}
            </option>
            {patients.map((patient: any, index: number) => {
              const pId = getEntityId(patient);
              return (
                <option key={pId || `patient-${index}`} value={pId}>
                  {getPatientDisplayName(patient)}{" "}
                  {patient.patient_code ? `(${patient.patient_code})` : ""}
                </option>
              );
            })}
          </select>
        </div>

        {/* Visit Selection Dropdown */}
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
          <select
            value={selectedVisitId}
            onChange={handleVisitSelect}
            disabled={!selectedPatientId || isLoadingVisits}
            className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
          >
            <option value="">
              {!selectedPatientId
                ? "Select a Patient First"
                : isLoadingVisits
                ? "Loading visits..."
                : visits.length === 0
                ? "No visits found"
                : "Select a Visit"}
            </option>
            {visits.map((visit, index) => {
              const vId = getEntityId(visit);
              return (
                <option key={vId || `visit-${index}`} value={vId}>
                  {visit.visit_no ? `Visit #${visit.visit_no}` : `Visit #${index + 1}`}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Table Data View */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border border-slate-200 rounded-2xl">
          Loading report data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              {selectedVisitId
                ? `Showing report records for ${currentPatientName ? `${currentPatientName} (${currentVisitNo})` : currentVisitNo}`
                : selectedPatientId
                ? `Showing visit choices for Patient: ${currentPatientName}`
                : "List of all Reports."}
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-16 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">Report No.</TableHead>
                <TableHead className="font-bold text-slate-600">Report Status</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        {!selectedPatientId
                          ? "Select a patient and visit above to view reports."
                          : !selectedVisitId
                          ? "Select a visit above to view report."
                          : "No report records found for the selected visit."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report, idx) => {
                  const reportKey = getEntityId(report) || `report-${idx}`;
                  return (
                    <TableRow
                      key={reportKey}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <TableCell className="font-mono text-xs text-slate-400">
                        {idx + 1}
                      </TableCell>

                      <TableCell className="font-mono text-xs text-slate-500 max-w-30 truncate">
                        {report.report_no || `Report #${idx + 1}`}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                            report.status?.toLowerCase() === "verified" ||
                            report.status?.toLowerCase() === "completed"
                              ? "bg-slate-50 text-slate-600 border-slate-50/60"
                              : report.status?.toLowerCase() === "in_progress" ||
                                report.status?.toLowerCase() === "active"
                              ? "bg-emerald-50 text-slate-600 border-slate-50/60"
                              : report.status?.toLowerCase() === "cancelled"
                              ? "bg-rose-50 text-slate-600 border-slate-50/60"
                              : "bg-amber-50 text-slate-600 border-slate-50/60"
                          }`}
                        >
                          {report.status || "N/A"}
                        </span>
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap space-x-1">
                        <ReportPrint
                          reportId={report.id}
                          reportNo={report.report_no}
                        />
                        <EditReport
                          report={report}
                          onSuccess={() => fetchReports(selectedVisitId)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}