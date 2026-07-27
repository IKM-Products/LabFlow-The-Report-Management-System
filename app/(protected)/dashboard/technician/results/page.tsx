// app/dashboard/technician/results/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Layers, ClipboardList, RefreshCw, User, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { resultService } from "@/services/result.service";
import { orderService } from "@/services/order.service";
import { visitService } from "@/services/visit.service";
import { patientService } from "@/services/patient.service";

import { ResultItem } from "@/types/result.types";

import ResultForm from "./_components/ResultForm";
import EditResult from "./_components/EditResult";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
  const fetchVisitsByPatient = async (patientId: string) => {
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
  };

  // 3. Fetch orders when a visit is selected
  const fetchOrdersByVisit = async (targetVisitId: string) => {
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

      // Extract raw ref and status values from backend payload
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
  };

  // 4. Fetch results when an order is selected
  const fetchResultsByOrder = async (targetOrderId: string) => {
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
  };

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

  const activeVisitObj = visits.find((v) => v.id === selectedVisitId);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
            <Layers className="h-5 w-5 text-blue-600" />
            Clinical Analysis Ledger Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verify and catalog multi-parameter quantitative telemetry entries indexing transactional workflows.
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Step 1: Patient Selection */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">1. Patient Directory</Label>
          <select
            value={selectedPatientId}
            onChange={handlePatientSelect}
            disabled={isLoadingPatients}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white outline-hidden cursor-pointer disabled:opacity-50"
          >
            <option value="">
              {isLoadingPatients ? "Loading patients..." : "-- Select Patient --"}
            </option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Visit Selection */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">2. Clinical Visit Sequence</Label>
          <select
            value={selectedVisitId}
            onChange={handleVisitSelect}
            disabled={!selectedPatientId || isLoadingVisits}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white outline-hidden cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {!selectedPatientId
                ? "-- Select Patient First --"
                : isLoadingVisits
                ? "Loading visits..."
                : visits.length === 0
                ? "No visits found"
                : "-- Select Visit --"}
            </option>
            {visits.map((visit) => (
              <option key={visit.id} value={visit.id}>
                Visit #{visit.visitNo}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: Work Order Selection */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-700">3. Work Order Reference</Label>
          <select
            value={selectedOrderId}
            onChange={handleOrderSelect}
            disabled={!selectedVisitId || isLoadingOrders}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white outline-hidden cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {!selectedVisitId
                ? "-- Select Visit First --"
                : isLoadingOrders
                ? "Loading orders..."
                : orders.length === 0
                ? "No orders found"
                : "-- Select Work Order --"}
            </option>
            {orders.map((order) => {
              // Ensure prefix is 'order#' and format directly as order#1(completed)
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

      {/* Results Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoadingResults ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Extracting verified dataset arrays...
            </p>
          </div>
        ) : !selectedPatientId ? (
          <div className="flex flex-col items-center justify-center text-center p-16 text-slate-400 text-xs font-medium gap-2">
            <User className="h-8 w-8 text-slate-300 stroke-1" />
            Please select a Patient to start viewing clinical records.
          </div>
        ) : !selectedVisitId ? (
          <div className="flex flex-col items-center justify-center text-center p-16 text-slate-400 text-xs font-medium gap-2">
            <ClipboardList className="h-8 w-8 text-slate-300 stroke-1" />
            Please select a Visit to display available work orders.
          </div>
        ) : !selectedOrderId ? (
          <div className="flex flex-col items-center justify-center text-center p-16 text-slate-400 text-xs font-medium gap-2">
            <Layers className="h-8 w-8 text-slate-300 stroke-1" />
            Please select a Work Order to build indexing matrices.
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-16 text-slate-400 text-xs font-medium gap-2">
            <ShieldAlert className="h-8 w-8 text-slate-300 stroke-1" />
            No tracked data telemetry payloads located within index for entity match sequence.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-4">Result Metric</th>
                  <th className="p-4">Operational Severity Flag</th>
                  <th className="p-4">Clinical Observations / Remarks</th>
                  <th className="p-4">Visit No</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {results.map((item, index) => {
                  const itemId = item.id || (item as any)._id || `result-${index}`;
                  const visitNumber =
                    (item as any).visit_no ||
                    (item as any).visit_number ||
                    activeVisitObj?.visitNo ||
                    "-";

                  return (
                    <tr key={itemId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-medium text-slate-800">
                        {item.result_value}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            item.flag === "normal"
                              ? "bg-slate-50 text-slate-600 border-slate-200"
                              : item.flag === "critical"
                              ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}
                        >
                          {item.flag || "normal"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">
                        {item.remarks || "-"}
                      </td>
                      <td className="p-4 font-mono font-semibold text-slate-800">
                        {visitNumber}
                      </td>
                      <td className="p-4 text-right">
                        <EditResult result={item} onSuccess={handleRefresh} />
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