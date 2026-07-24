"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  ClipboardList,
  ShieldAlert,
  Calendar,
  User,
} from "lucide-react";

import { orderService } from "@/services/order.service";
import { visitService } from "@/services/visit.service";
import { patientService } from "@/services/patient.service";
import { Order } from "@/types/order.types";

import OrderForm from "./_components/OrderForm";
import EditOrder from "./_components/EditOrder";
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

export default function TechnicianOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [visits, setVisits] = useState<VisitOption[]>([]);

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedVisitId, setSelectedVisitId] = useState("");

  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isLoadingVisits, setIsLoadingVisits] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

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
            `Patient #${p.id || p.patient_id}`,
        }));

        setPatients(formatted);
      } catch (error) {
        console.error("Error loading patient list:", error);
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
      return;
    }

    setIsLoadingVisits(true);
    setVisits([]);
    setSelectedVisitId("");
    setOrders([]);

    try {
      const response: any = await visitService.getVisitsByPatientId(
        patientId.trim()
      );

      const rawVisits = Array.isArray(response)
        ? response
        : response?.data || response?.visits || [];

      const formatted = rawVisits.map((v: any) => ({
        id: v.visit_id || v.id,
        visitNo: v.visit_no || v.visit_number || v.id || "Unknown Visit",
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
  const fetchOrders = async (targetVisitId: string) => {
    if (!targetVisitId.trim()) {
      setOrders([]);
      return;
    }

    setIsLoadingOrders(true);
    try {
      const response: any = await orderService.getOrdersByVisitId(
        targetVisitId.trim()
      );

      const ordersData = Array.isArray(response)
        ? response
        : response?.data || [];

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching visit order records:", error);
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
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
    fetchOrders(visitId);
  };

  const handleRefresh = () => {
    if (selectedVisitId) {
      fetchOrders(selectedVisitId);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Technician Orders Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Select a patient and their corresponding visit to load and manage diagnostic orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedVisitId && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoadingOrders}
              className="rounded-xl h-10 border-slate-200 text-slate-600"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isLoadingOrders ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </Button>
          )}

          <OrderForm
            defaultVisitId={selectedVisitId}
            onSuccess={() => fetchOrders(selectedVisitId)}
          />
        </div>
      </div>

      {/* Dependent Filter Controls (Patient -> Visit) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {/* Step 1: Select Patient */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          <User className="h-4 w-4 shrink-0 text-slate-400 ml-2" />
          <select
            value={selectedPatientId}
            onChange={handlePatientSelect}
            disabled={isLoadingPatients}
            className="w-full text-xs font-medium text-slate-900 bg-transparent border-none outline-hidden cursor-pointer"
          >
            <option value="">
              {isLoadingPatients ? "Loading patients..." : "-- 1. Select Patient --"}
            </option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Select Visit */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          <ClipboardList className="h-4 w-4 shrink-0 text-slate-400 ml-2" />
          <select
            value={selectedVisitId}
            onChange={handleVisitSelect}
            disabled={!selectedPatientId || isLoadingVisits}
            className="w-full text-xs font-medium text-slate-900 bg-transparent border-none outline-hidden cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">
              {!selectedPatientId
                ? "-- Select Patient First --"
                : isLoadingVisits
                ? "Loading visits..."
                : visits.length === 0
                ? "No visits found"
                : "-- 2. Select Visit --"}
            </option>
            {visits.map((visit) => (
              <option key={visit.id} value={visit.id}>
                Visit #{visit.visitNo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 3: Orders Data Table */}
      {isLoadingOrders ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border border-slate-200 rounded-2xl">
          Loading order data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              {selectedVisitId
                ? `Showing order records for Visit ID: ${selectedVisitId}`
                : "Select a patient and visit from the dropdowns above to display diagnostic orders."}
            </TableCaption>
            <TableHeader>
              <tr className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-16 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">Order Ref</TableHead>
                <TableHead className="font-bold text-slate-600">Assigned Cost</TableHead>
                <TableHead className="font-bold text-slate-600">Collection Metadata</TableHead>
                <TableHead className="font-bold text-slate-600">Status</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {!selectedPatientId ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <User className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        Please select a patient to start viewing records.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !selectedVisitId ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ClipboardList className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        Please select a visit from the dropdown to load order records.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        No laboratory orders found for this visit.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order: any, idx) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    <TableCell className="font-mono text-xs text-slate-400">
                      {idx + 1}
                    </TableCell>

                    <TableCell className="font-mono text-xs text-slate-500 max-w-30 truncate">
                      {order.order_number || order.order_ref || `Order #${idx + 1}`}
                    </TableCell>

                    <TableCell className="font-medium text-slate-950 text-xs">
                      ${typeof order.price === "number" ? order.price.toFixed(2) : order.price || "0.00"}
                    </TableCell>

                    <TableCell className="text-xs text-slate-600 space-y-0.5">
                      {order.collected_at ? (
                        <>
                          <div className="flex items-center gap-1 text-slate-700 font-medium">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span suppressHydrationWarning>
                              {new Date(order.collected_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            By: {
                              order.collector_name || 
                              order.collector?.full_name || 
                              `${order.collector?.first_name || ""} ${order.collector?.last_name || ""}`.trim() || 
                              order.technician_name ||
                              order.technician?.full_name ||
                              `${order.technician?.first_name || ""} ${order.technician?.last_name || ""}`.trim() ||
                              (typeof order.collected_by === "object" ? order.collected_by?.name || order.collected_by?.full_name : null) || 
                              (typeof order.collected_by === "string" && !order.collected_by.includes("-") ? order.collected_by : null) ||
                              (typeof order.technician === "string" && !order.technician.includes("-") ? order.technician : null) ||
                              "Technician"
                            }
                          </div>
                        </>
                      ) : (
                        <span className="text-slate-400 italic">
                          Pending collection event
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          order.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap">
                      <EditOrder order={order} onSuccess={handleRefresh} />
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