// app/(protected)/dashboard/technician/reports/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Loader2, FileSpreadsheet, User, Calendar, FileText } from "lucide-react";

import { reportService } from "@/services/report.service";
import { patientService } from "@/services/patient.service";
import { visitService } from "@/services/visit.service";

import { Report } from "@/types/report.types";
import { Patient } from "@/types/patient.types";
import { VisitListItem } from "@/types/visit.types";

import ReportForm from "./_components/ReportForm";
import EditReport from "./_components/EditReport";
import ReportPrint from "./_components/ReportPrint";

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
    entity.visit_id || entity.id || entity._id || entity.uuid || ""
  ).trim();
};

export default function ReportsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<VisitListItem[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedVisitId, setSelectedVisitId] = useState<string>("");

  const [isPatientsLoading, setIsPatientsLoading] = useState<boolean>(false);
  const [isVisitsLoading, setIsVisitsLoading] = useState<boolean>(false);
  const [isReportsLoading, setIsReportsLoading] = useState<boolean>(false);

  // 1. Load initial patient list on mount
  useEffect(() => {
    const fetchPatients = async () => {
      setIsPatientsLoading(true);
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
        setIsPatientsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // 2. Fetch visits whenever selected patient changes
  useEffect(() => {
    if (!selectedPatientId || !isValidUUID(selectedPatientId)) {
      setVisits([]);
      setSelectedVisitId("");
      setReports([]);
      return;
    }

    const fetchVisits = async () => {
      setIsVisitsLoading(true);
      setSelectedVisitId("");
      setReports([]);
      try {
        const res = await visitService.getVisitsByPatientId(selectedPatientId);
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
        setIsVisitsLoading(false);
      }
    };

    fetchVisits();
  }, [selectedPatientId]);

  // 3. Fetch reports for a selected visit
  const fetchReports = async (visitId: string) => {
    if (!visitId || !isValidUUID(visitId)) {
      setReports([]);
      return;
    }

    setIsReportsLoading(true);
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
      setIsReportsLoading(false);
    }
  };

  const handleVisitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const visitId = e.target.value;
    setSelectedVisitId(visitId);
    fetchReports(visitId);
  };

  const getPatientDisplayName = (patient: any): string => {
    if (patient.full_name) return patient.full_name;
    if (patient.first_name || patient.last_name) {
      return `${patient.first_name || ""} ${patient.last_name || ""}`.trim();
    }
    if (patient.name) return patient.name;
    return `Patient Profile`;
  };

  const getSelectedPatientName = (): string => {
    const found = patients.find((p) => getEntityId(p) === selectedPatientId);
    return found ? getPatientDisplayName(found) : "";
  };

  const getVisitDisplayName = (visitId: string): string => {
    const foundVisit = visits.find((v) => getEntityId(v) === visitId);
    if (!foundVisit) return "Associated Visit";
    const vNo = foundVisit.visit_no || "";
    const vDate = foundVisit.visit_date ? String(foundVisit.visit_date).split("T")[0] : "";
    return vNo ? `Visit #${vNo}${vDate ? ` (${vDate})` : ""}` : `Visit Record ${vDate || ""}`;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            Diagnostic Reporting Matrix
          </h1>
          <p className="text-xs text-slate-500">
            Select a patient and visit mapping to view or manage diagnostic reports.
          </p>
        </div>
        <ReportForm
          defaultVisitId={selectedVisitId}
          onSuccess={() => fetchReports(selectedVisitId)}
        />
      </div>

      {/* Cascading Selection Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Patient Selection Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-blue-600" />
            1. Select Patient
          </label>
          <div className="relative">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              disabled={isPatientsLoading}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-800 disabled:opacity-50 cursor-pointer"
            >
              <option value="">
                {isPatientsLoading ? "Loading patients..." : "-- Choose Patient --"}
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
            {isPatientsLoading && (
              <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin absolute right-3 top-2.5" />
            )}
          </div>
        </div>

        {/* Visit Selection Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            2. Select Visit
          </label>
          <div className="relative">
            <select
              value={selectedVisitId}
              onChange={handleVisitChange}
              disabled={!selectedPatientId || isVisitsLoading}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <option value="">
                {!selectedPatientId
                  ? "Select a patient first"
                  : isVisitsLoading
                  ? "Loading visits..."
                  : visits.length === 0
                  ? "No visits found"
                  : "-- Choose Visit --"}
              </option>
              {visits.map((visit, index) => {
                const vId = getEntityId(visit);
                return (
                  <option key={vId || `visit-${index}`} value={vId}>
                    {visit.visit_no
                      ? `Visit #${visit.visit_no}`
                      : `Visit Record #${index + 1}`}
                    {visit.visit_date
                      ? ` (${String(visit.visit_date).split("T")[0]})`
                      : ""}
                  </option>
                );
              })}
            </select>
            {isVisitsLoading && (
              <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin absolute right-3 top-2.5" />
            )}
          </div>
        </div>
      </div>

      {/* Reports Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Context Banner */}
        {selectedPatientId && selectedVisitId && (
          <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-100 flex items-center gap-2 text-xs text-slate-600">
            <FileText className="h-4 w-4 text-blue-600" />
            <span>
              Showing reports for <strong className="text-slate-900">{getSelectedPatientName()}</strong> under{" "}
              <strong className="text-slate-900">{getVisitDisplayName(selectedVisitId)}</strong>
            </span>
          </div>
        )}

        {isReportsLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">
              Extracting related report payload data...
            </p>
          </div>
        ) : !selectedPatientId ? (
          <div className="text-center p-16 text-slate-400 text-xs font-medium">
            Please select a patient to view their available visits.
          </div>
        ) : !selectedVisitId ? (
          <div className="text-center p-16 text-slate-400 text-xs font-medium">
            Please select a visit from the dropdown to display diagnostic reports.
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center p-16 text-slate-400 text-xs font-medium">
            No active metrics data sheets located inside tracking context for this visit.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-4">Report Reference</th>
                  <th className="p-4">Visit Details</th>
                  <th className="p-4">Workflow Phase</th>
                  <th className="p-4">Storage File Target</th>
                  <th className="p-4">Generation Stamps</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {reports.map((report, index) => {
                  const reportKey = getEntityId(report) || `report-${index}`;
                  return (
                    <tr
                      key={reportKey}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="p-4 font-mono font-bold text-slate-900">
                        {report.report_no}
                      </td>
                      <td className="p-4 font-medium text-slate-700">
                        {getVisitDisplayName(report.visit_id)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            report.status === "verified" ||
                            report.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : report.status === "cancelled"
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {report.status || "draft"}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-400 text-[11px] max-w-xs truncate">
                        {report.pdf_path || "Unassigned Repository Path"}
                      </td>
                      <td className="p-4 space-y-0.5">
                        <div className="text-slate-500 font-mono text-[11px]">
                          {report.generated_at}
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          Author: {report.generated_by}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        <ReportPrint
                          reportId={report.id}
                          reportNo={report.report_no}
                        />
                        <EditReport
                          report={report}
                          onSuccess={() => fetchReports(selectedVisitId)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}