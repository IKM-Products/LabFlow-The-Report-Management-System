"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  ShieldAlert,
  UserRound,
  MapPin,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";

import { resultService } from "@/services/result.service";
import { orderService } from "@/services/order.service";
import { visitService } from "@/services/visit.service";
import { patientService } from "@/services/patient.service";

import { ResultItem } from "@/types/result.types";

import ResultForm from "./_components/ResultForm";
import EditResult from "./_components/EditResult";
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

interface VisitOption {
  id: string;
  visitNo: string;
}

interface OrderOption {
  id: string;
  orderRef: string;
  status: string;
}

// Helper to validate standard UUID format before making API calls
const isUUID = (str: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

// Helper to safely extract technician name while hiding raw user IDs
const getVerifierName = (item: any): string => {
  // 1. If verified_by is populated as an object by the backend
  if (item.verified_by && typeof item.verified_by === "object") {
    return (
      item.verified_by.full_name ||
      item.verified_by.name ||
      `${item.verified_by.first_name || ""} ${item.verified_by.last_name || ""}`.trim() ||
      "Technician"
    );
  }

  // 2. Check explicitly returned name fields from the API payload
  const explicitName =
    item.verified_by_name ||
    item.technician_name ||
    item.verifier_name ||
    item.verifier?.full_name ||
    item.verifier?.name;

  if (explicitName) return explicitName;

  // 3. Fallback for string value: hide if it's a raw UUID/ID string
  if (typeof item.verified_by === "string" && item.verified_by.trim()) {
    const rawVal = item.verified_by.trim();
    if (isUUID(rawVal) || rawVal.startsWith("usr_") || rawVal.startsWith("user_")) {
      return "Technician";
    }
    return rawVal;
  }

  return "-";
};

export default function ResultsPage() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [visits, setVisits] = useState<VisitOption[]>([]);
  const [orders, setOrders] = useState<OrderOption[]>([]);

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedVisitId, setSelectedVisitId] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isLoadingVisits, setIsLoadingVisits] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  // 1. Fetch initial patient list on mount
  useEffect(() => {
    const loadPatients = async () => {
      setIsLoadingPatients(true);
      try {
        const response: any = await patientService.getPatients();

        const rawPatients = Array.isArray(response)
          ? response
          : response?.data || response?.patients || [];

        const formatted = rawPatients.map((p: any) => ({
          id: p.patient_id || p.id,
          name:
            p.full_name ||
            `${p.first_name || ""} ${p.last_name || ""}`.trim() ||
            "Patient Record",
        }));

        setPatients(formatted);
      } catch (error) {
        console.error("Error loading patient list:", error);
        toast.error("Failed to load patient directories.");
      } finally {
        setIsLoadingPatients(false);
      }
    };

    loadPatients();
  }, []);

  // 2. Fetch visits when a patient is selected
  const fetchVisitsByPatient = useCallback(async (patientId: string) => {
    if (!patientId.trim()) {
      setVisits([]);
      setSelectedVisitId("");
      setOrders([]);
      setSelectedOrderId("");
      setResults([]);
      return;
    }

    setIsLoadingVisits(true);
    setVisits([]);
    setSelectedVisitId("");
    setOrders([]);
    setSelectedOrderId("");
    setResults([]);

    try {
      const response: any = await visitService.getVisitsByPatientId(patientId.trim());

      const rawVisits = Array.isArray(response)
        ? response
        : response?.data || response?.visits || [];

      const formatted = rawVisits.map((v: any) => ({
        id: v.visit_id || v.id,
        visitNo: v.visit_no || v.visit_number || "Visit Record",
      }));

      setVisits(formatted);
    } catch (error) {
      console.error("Error fetching patient visits:", error);
      setVisits([]);
    } finally {
      setIsLoadingVisits(false);
    }
  }, []);

  // 3. Fetch orders when a visit is selected
  const fetchOrdersByVisit = useCallback(async (targetVisitId: string) => {
    if (!targetVisitId.trim() || !isUUID(targetVisitId.trim())) {
      setOrders([]);
      setSelectedOrderId("");
      setResults([]);
      return;
    }

    setIsLoadingOrders(true);
    setOrders([]);
    setSelectedOrderId("");
    setResults([]);

    try {
      const response: any = await orderService.getOrdersByVisitId(targetVisitId.trim());

      const rawOrders = Array.isArray(response)
        ? response
        : response?.data || [];

      const formatted = rawOrders.map((o: any, idx: number) => ({
        id: o.order_id || o.id,
        orderRef: String(o.order_ref || o.order_number || o.order_no || idx + 1),
        status: String(o.status || "completed").toLowerCase(),
      }));

      setOrders(formatted);
    } catch (error) {
      console.error("Error fetching visit order records:", error);
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // 4. Fetch results when an order is selected
  const fetchResultsByOrder = useCallback(async (targetOrderId: string) => {
    if (!targetOrderId.trim() || !isUUID(targetOrderId.trim())) {
      setResults([]);
      return;
    }

    setIsLoadingResults(true);
    try {
      const response: any = await resultService.getResultsByOrderId(targetOrderId.trim());

      const resultsData = Array.isArray(response)
        ? response
        : response?.data || [];

      setResults(resultsData);
    } catch (error) {
      console.error("Error fetching order result records:", error);
      setResults([]);
    } finally {
      setIsLoadingResults(false);
    }
  }, []);

  // Handlers
  const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    setSelectedPatientId(patientId);
    fetchVisitsByPatient(patientId);
  };

  const handleVisitSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const visitId = e.target.value;
    setSelectedVisitId(visitId);
    fetchOrdersByVisit(visitId);
  };

  const handleOrderSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orderId = e.target.value;
    setSelectedOrderId(orderId);
    fetchResultsByOrder(orderId);
  };

  const handleRefresh = () => {
    if (selectedOrderId) {
      fetchResultsByOrder(selectedOrderId);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Clinical Results
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage clinical results and their information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedOrderId && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoadingResults}
              className="rounded-xl h-10 border-slate-200 text-slate-600"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isLoadingResults ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>
          )}

          <ResultForm
            defaultOrderId={selectedOrderId}
            onSuccess={handleRefresh}
          />
        </div>
      </div>

      {/* Cascading Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Step 1: Patient Selection */}
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
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Visit Selection */}
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
            {visits.map((visit) => (
              <option key={visit.id} value={visit.id}>
                Visit #{visit.visitNo}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: Work Order Selection */}
        <div className="relative">
          <ClipboardList className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
          <select
            value={selectedOrderId}
            onChange={handleOrderSelect}
            disabled={!selectedVisitId || isLoadingOrders}
            className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
          >
            <option value="">
              {!selectedVisitId
                ? "Select a Visit First"
                : isLoadingOrders
                ? "Loading orders..."
                : orders.length === 0
                ? "No orders found"
                : "Select a Work Order"}
            </option>
            {orders.map((order) => {
              const refLabel = order.orderRef.toLowerCase().startsWith("order#")
                ? order.orderRef
                : `order#${order.orderRef}`;

              return (
                <option key={order.id} value={order.id}>
                  {refLabel}({order.status})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Table Data View */}
      {isLoadingResults ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border border-slate-200 rounded-2xl">
          Loading result data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              {selectedOrderId
                ? `Showing result records for Work Order ID: ${selectedOrderId}`
                : selectedVisitId
                ? `Showing order choices for Visit ID: ${selectedVisitId}`
                : selectedPatientId
                ? `Showing visit choices for Patient ID: ${selectedPatientId}`
                : "List of all Results."}
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-16 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">Result Value</TableHead>
                <TableHead className="font-bold text-slate-600">Priority Level</TableHead>
                <TableHead className="font-bold text-slate-600">Verified By</TableHead>
                <TableHead className="font-bold text-slate-600">Remarks</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        {!selectedPatientId
                          ? "Select a patient, visit, and order above to view results."
                          : !selectedVisitId
                          ? "Select a visit, and order above to view results."
                          : !selectedOrderId
                          ? "Select a order above to view results."
                          : "No result records found for the selected work order."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                results.map((item, index) => {
                  const itemId = item.id || (item as any)._id || `result-${index}`;

                  return (
                    <TableRow
                      key={itemId}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <TableCell className="font-mono text-xs text-slate-400">
                        {index + 1}
                      </TableCell>

                      <TableCell className="text-xs font-medium text-slate-800">
                        {item.result_value}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                            item.flag === "normal"
                              ? "bg-slate-50 text-slate-600 border-slate-200"
                              : item.flag === "critical"
                              ? "bg-rose-50 text-rose-600 border-rose-100 animate-pulse"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}
                        >
                          {item.flag || "normal"}
                        </span>
                      </TableCell>

                      <TableCell className="text-xs font-medium text-slate-700">
                        {getVerifierName(item)}
                      </TableCell>

                      <TableCell className="text-xs text-slate-500 max-w-xs truncate">
                        {item.remarks || "-"}
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        <EditResult result={item} onSuccess={handleRefresh} />
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