"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  ShieldAlert,
  UserRound,
  MapPin
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

  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedVisitId, setSelectedVisitId] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState<boolean>(false);
  const [isLoadingVisits, setIsLoadingVisits] = useState<boolean>(false);

  // Fetch initial list of patients and all orders on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoadingPatients(true);
      setIsLoading(true);
      try {
        const [patientResponse, orderResponse]: [any, any] = await Promise.all([
          patientService.getPatients(),
          orderService.getOrders
            ? orderService.getOrders()
            : orderService.getOrdersByVisitId(""),
        ]);

        // Safely extract patient array
        const rawPatients = Array.isArray(patientResponse)
          ? patientResponse
          : patientResponse?.data || [];

        const formattedPatients: PatientOption[] = rawPatients.map((p: any) => ({
          id: String(p.patient_id || p.id),
          name:
            p.full_name ||
            `${p.first_name || ""} ${p.last_name || ""}`.trim() ||
            `Patient #${p.id || p.patient_id}`,
        }));

        setPatients(formattedPatients);

        // Normalize initial all-orders array extraction
        const ordersData = Array.isArray(orderResponse)
          ? orderResponse
          : orderResponse?.data || [];
        setOrders(ordersData);
      } catch (error) {
        console.error("Error loading initial order and patient data:", error);
      } finally {
        setIsLoadingPatients(false);
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Fetch visits for a specific patient
  const fetchVisitsByPatient = useCallback(async (patientId: string) => {
    if (!patientId.trim()) {
      setVisits([]);
      setSelectedVisitId("");
      return;
    }

    setIsLoadingVisits(true);
    setVisits([]);
    setSelectedVisitId("");

    try {
      const response: any = await visitService.getVisitsByPatientId(
        patientId.trim()
      );

      const rawVisits = Array.isArray(response)
        ? response
        : response?.data || response?.visits || [];

      const formatted: VisitOption[] = rawVisits.map((v: any) => ({
        id: String(v.visit_id || v.id),
        visitNo: String(v.visit_no || v.visit_number || v.id || "Unknown Visit"),
      }));

      setVisits(formatted);
    } catch (error) {
      console.error("Error fetching patient visits:", error);
      setVisits([]);
    } finally {
      setIsLoadingVisits(false);
    }
  }, []);

  // Fetch order records filtered by visit or fallback to all
  const fetchOrders = useCallback(
    async (visitId?: string) => {
      setIsLoading(true);
      try {
        let response: any;
        if (visitId && visitId.trim()) {
          response = await orderService.getOrdersByVisitId(visitId.trim());
        } else if (orderService.getOrders) {
          response = await orderService.getOrders();
        } else {
          response = await orderService.getOrdersByVisitId("");
        }

        const ordersData = Array.isArray(response)
          ? response
          : response?.data || [];

        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching order records:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Handlers
  const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    setSelectedPatientId(patientId);
    setSelectedVisitId("");
    fetchVisitsByPatient(patientId);
    fetchOrders("");
  };

  const handleVisitSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const visitId = e.target.value;
    setSelectedVisitId(visitId);
    fetchOrders(visitId);
  };

  const handleRefresh = () => {
    fetchOrders(selectedVisitId);
  };

  // Find selected patient name & visit number for dynamic table caption display
  const selectedPatientName = patients.find((p) => p.id === selectedPatientId)?.name;
  const selectedVisitNo = visits.find((v) => v.id === selectedVisitId)?.visitNo;

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Clinical Orders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage clinical orders and their information.
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

          <OrderForm
            defaultVisitId={selectedVisitId}
            onSuccess={() => fetchOrders(selectedVisitId)}
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
            <option value="">Select a Patient (List of all Orders)</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
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
                : "Select a Visit (List of all Orders)"}
            </option>
            {visits.map((visit) => (
              <option key={visit.id} value={visit.id}>
                Visit #{visit.visitNo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Data View */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border border-slate-200 rounded-2xl">
          Loading order data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              {selectedVisitId
                ? `List of all Orders for Visit #${selectedVisitNo || selectedVisitId}`
                : selectedPatientId
                ? `List of all Orders for ${selectedPatientName || selectedPatientId}`
                : "List of all Orders."}
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-16 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">Order No.</TableHead>
                <TableHead className="font-bold text-slate-600">Price</TableHead>
                <TableHead className="font-bold text-slate-600">Order Status</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        {selectedVisitId || selectedPatientId
                          ? "No order records found for the selected filter."
                          : "No order records found."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order: any, idx) => {
                  const statusLower = order.status?.toLowerCase();
                  return (
                    <TableRow
                      key={order.id || `order-${idx}`}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <TableCell className="font-mono text-xs text-slate-400">
                        {idx + 1}
                      </TableCell>

                      <TableCell className="font-mono text-xs text-slate-500 max-w-30 truncate">
                        {order.order_number || order.order_ref || `Order #${idx + 1}`}
                      </TableCell>

                      <TableCell className="font-semibold text-emerald-600">
                        Rs {typeof order.price === "number" ? order.price.toFixed(2) : order.price || "0.00"}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                            statusLower === "completed"
                              ? "bg-emerald-50 text-slate-600 border-emerald-50/60"
                              : statusLower === "in_progress" || statusLower === "active"
                              ? "bg-slate-50 text-slate-600 border-slate-50/60"
                              : statusLower === "cancelled"
                              ? "bg-rose-50 text-slate-600 border-rose-50/60"
                              : "bg-amber-50 text-slate-600 border-amber-50/60"
                          }`}
                        >
                          {order.status || "N/A"}
                        </span>
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        <EditOrder order={order} onSuccess={handleRefresh} />
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