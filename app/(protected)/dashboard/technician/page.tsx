"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  Package,
  MapPin,
  Loader2,
  RefreshCw,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  FilePlus,
  CalendarPlus,
} from "lucide-react";

interface TechnicianMetrics {
  patients: number;
  orders: number;
  visits: number;
}

type QuickActionType = "patient" | "visit" | "order" | null;

export default function TechnicianDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [metrics, setMetrics] = useState<TechnicianMetrics>({
    patients: 0,
    orders: 0,
    visits: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Quick Action Modal & Form States
  const [activeModal, setActiveModal] = useState<QuickActionType>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [formSuccess, setFormSuccess] = useState<string>("");

  // Patient Form Fields State
  const [patientData, setPatientData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    age: "",
    phone: "",
    email: "",
  });

  // Visit Form Fields State
  const [visitData, setVisitData] = useState({
    patient_id: "",
    doctor_id: "",
    visit_type: "",
    notes: "",
  });

  // Order Form Fields State
  const [orderData, setOrderData] = useState({
    patient_id: "",
    doctor_id: "",
    priority: "ROUTINE",
    notes: "",
  });

  const BASE_URL = (
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.90:8080/api"
  ).replace(/\/$/, "");

  // Safely retrieve authentication token
  const getAuthToken = useCallback(() => {
    if (typeof window === "undefined") return null;

    const tokenFromSession =
      (session as any)?.accessToken ||
      (session?.user as any)?.accessToken ||
      (session as any)?.token ||
      (session as any)?.jwt;

    if (tokenFromSession) return tokenFromSession;

    const tokenFromStorage =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("jwt");

    if (tokenFromStorage) return tokenFromStorage;

    const cookieMatch = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
    if (cookieMatch) return cookieMatch[2];

    return null;
  }, [session]);

  const parseCount = async (
    res: PromiseSettledResult<Response>,
    endpointName: string
  ): Promise<number> => {
    if (res.status === "fulfilled" && res.value.ok) {
      try {
        const data = await res.value.json();
        if (Array.isArray(data)) return data.length;
        if (typeof data?.count === "number") return data.count;
        if (typeof data?.total === "number") return data.total;
        if (Array.isArray(data?.data)) return data.data.length;
        if (Array.isArray(data?.content)) return data.content.length;
        if (Array.isArray(data?.result)) return data.result.length;
        if (Array.isArray(data?.patients)) return data.patients.length;
        if (Array.isArray(data?.orders)) return data.orders.length;
        if (Array.isArray(data?.visits)) return data.visits.length;
        if (Array.isArray(data?.tests)) return data.tests.length;
      } catch (err) {
        console.error(
          `[Technician Dashboard Debug] Error parsing JSON for ${endpointName}:`,
          err
        );
      }
    } else if (res.status === "fulfilled") {
      if (res.value.status === 401) {
        console.warn(
          `[Technician Dashboard Debug] ${endpointName} request unauthenticated (401).`
        );
      } else {
        console.warn(
          `[Technician Dashboard Debug] ${endpointName} returned status ${res.value.status}`
        );
      }
    } else {
      console.error(
        `[Technician Dashboard Debug] ${endpointName} request failed:`,
        res.reason
      );
    }
    return 0;
  };

  const fetchDashboardStats = useCallback(async () => {
    setIsLoading(true);
    const token = getAuthToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const fetchOpts: RequestInit = { headers, cache: "no-store" };

    try {
      const [patientsRes, ordersRes, visitsRes] = await Promise.allSettled([
        fetch(`${BASE_URL}/patient`, fetchOpts),
        fetch(`${BASE_URL}/order`, fetchOpts),
        fetch(`${BASE_URL}/visit`, fetchOpts),
      ]);

      const patientsCount = await parseCount(patientsRes, "Patients");
      const ordersCount = await parseCount(ordersRes, "Orders");
      const visitsCount = await parseCount(visitsRes, "Visits");

      setMetrics({
        patients: patientsCount,
        orders: ordersCount,
        visits: visitsCount,
      });
    } catch (error) {
      console.error("[Technician Dashboard Debug] Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL, getAuthToken]);

  useEffect(() => {
    if (sessionStatus === "loading") return;

    fetchDashboardStats();

    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 10000);

    const handleSync = () => fetchDashboardStats();

    window.addEventListener("focus", handleSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleSync);
    };
  }, [fetchDashboardStats, sessionStatus]);

  const closeModal = () => {
    setActiveModal(null);
    setFormError("");
    setFormSuccess("");
    setPatientData({
      first_name: "",
      last_name: "",
      gender: "",
      age: "",
      phone: "",
      email: "",
    });
    setVisitData({
      patient_id: "",
      doctor_id: "",
      visit_type: "",
      notes: "",
    });
    setOrderData({
      patient_id: "",
      doctor_id: "",
      priority: "ROUTINE",
      notes: "",
    });
  };

  const handleQuickActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    setFormSuccess("");

    const token = getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let endpoint = "";
    let payload = {};

    switch (activeModal) {
      case "patient":
        endpoint = `${BASE_URL}/patient`;
        payload = Object.fromEntries(
          Object.entries(patientData).map(([key, val]) => [
            key,
            typeof val === "string" && val.trim() === "" ? null : val,
          ])
        );
        break;
      case "visit":
        endpoint = `${BASE_URL}/visit`;
        payload = Object.fromEntries(
          Object.entries(visitData).map(([key, val]) => [
            key,
            typeof val === "string" && val.trim() === "" ? null : val,
          ])
        );
        break;
      case "order":
        endpoint = `${BASE_URL}/order`;
        payload = Object.fromEntries(
          Object.entries(orderData).map(([key, val]) => [
            key,
            typeof val === "string" && val.trim() === "" ? null : val,
          ])
        );
        break;
      default:
        setIsSubmitting(false);
        return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const serverMessages = resData?.messages || resData?.message;
        const errorMsg = Array.isArray(serverMessages)
          ? serverMessages.join(", ")
          : typeof serverMessages === "string"
          ? serverMessages
          : `Failed to create entry (Status ${res.status})`;
        throw new Error(errorMsg);
      }

      setFormSuccess(`${activeModal?.toUpperCase()} created successfully!`);
      setTimeout(() => {
        closeModal();
        fetchDashboardStats();
      }, 1200);
    } catch (err: any) {
      console.error("[Technician Quick Action Error]:", err);
      setFormError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const metricCards = [
    {
      label: "Patients",
      value: metrics.patients,
      icon: Users,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Visits",
      value: metrics.visits,
      icon: MapPin,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Orders",
      value: metrics.orders,
      icon: Package,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Summary of key system metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardStats}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-2xs cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metricCards.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {metric.label}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  ) : (
                    <p className="text-2xl font-bold text-slate-800">
                      {metric.value}
                    </p>
                  )}
                </div>
              </div>
              <div className={`p-3.5 rounded-xl border ${metric.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 text-black border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-black">Quick Actions</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Quickly add new entries directly into the system.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => setActiveModal("patient")}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#00a66c] hover:bg-[#008f5d] text-white text-xs font-semibold transition-all group cursor-pointer shadow-xs"
          >
            <div className="p-2 rounded-lg bg-white/20 text-white group-hover:scale-110 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
            <span>Add Patient</span>
          </button>

          <button
            onClick={() => setActiveModal("visit")}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#00a66c] hover:bg-[#008f5d] text-white text-xs font-semibold transition-all group cursor-pointer shadow-xs"
          >
            <div className="p-2 rounded-lg bg-white/20 text-white group-hover:scale-110 transition-transform">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <span>New Visit</span>
          </button>

          <button
            onClick={() => setActiveModal("order")}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#00a66c] hover:bg-[#008f5d] text-white text-xs font-semibold transition-all group cursor-pointer shadow-xs"
          >
            <div className="p-2 rounded-lg bg-white/20 text-white group-hover:scale-110 transition-transform">
              <FilePlus className="w-4 h-4" />
            </div>
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Quick Action Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden relative animate-in fade-in zoom-in-95 duration-150 p-6 sm:p-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {activeModal === "patient" && "Add New Patient"}
                  {activeModal === "visit" && "Record New Visit"}
                  {activeModal === "order" && "Create New Lab Order"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {activeModal === "patient" && "Enter details to register a new patient."}
                  {activeModal === "visit" && "Log a new visit entry for a patient."}
                  {activeModal === "order" && "Generate a new laboratory order."}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleQuickActionSubmit} className="space-y-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* 1. Add Patient Modal */}
              {activeModal === "patient" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={patientData.first_name}
                        onChange={(e) =>
                          setPatientData({ ...patientData, first_name: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={patientData.last_name}
                        onChange={(e) =>
                          setPatientData({ ...patientData, last_name: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Gender</label>
                      <select
                        value={patientData.gender}
                        onChange={(e) =>
                          setPatientData({ ...patientData, gender: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Age</label>
                      <input
                        type="number"
                        value={patientData.age}
                        onChange={(e) =>
                          setPatientData({ ...patientData, age: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Phone</label>
                      <input
                        type="text"
                        value={patientData.phone}
                        onChange={(e) =>
                          setPatientData({ ...patientData, phone: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Email</label>
                      <input
                        type="email"
                        value={patientData.email}
                        onChange={(e) =>
                          setPatientData({ ...patientData, email: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Record Visit Modal */}
              {activeModal === "visit" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Patient ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PAT-1002"
                      value={visitData.patient_id}
                      onChange={(e) =>
                        setVisitData({ ...visitData, patient_id: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Doctor ID</label>
                    <input
                      type="text"
                      placeholder="e.g. DOC-301"
                      value={visitData.doctor_id}
                      onChange={(e) =>
                        setVisitData({ ...visitData, doctor_id: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Visit Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Regular Checkup / Emergency"
                      value={visitData.visit_type}
                      onChange={(e) =>
                        setVisitData({ ...visitData, visit_type: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Notes</label>
                    <input
                      type="text"
                      placeholder="Additional visit notes..."
                      value={visitData.notes}
                      onChange={(e) =>
                        setVisitData({ ...visitData, notes: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>
                </div>
              )}

              {/* 3. Create Order Modal */}
              {activeModal === "order" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Patient ID</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PAT-1002"
                        value={orderData.patient_id}
                        onChange={(e) =>
                          setOrderData({ ...orderData, patient_id: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Doctor ID</label>
                      <input
                        type="text"
                        placeholder="e.g. DOC-301"
                        value={orderData.doctor_id}
                        onChange={(e) =>
                          setOrderData({ ...orderData, doctor_id: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Priority</label>
                    <select
                      value={orderData.priority}
                      onChange={(e) =>
                        setOrderData({ ...orderData, priority: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    >
                      <option value="ROUTINE">Routine</option>
                      <option value="URGENT">Urgent</option>
                      <option value="STAT">STAT / Emergency</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Order Notes</label>
                    <input
                      type="text"
                      placeholder="Lab test details or instructions..."
                      value={orderData.notes}
                      onChange={(e) =>
                        setOrderData({ ...orderData, notes: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-5 h-9 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-6 h-9 rounded-xl bg-[#00a66c] hover:bg-[#008f5d] text-white text-xs font-medium transition-all cursor-pointer disabled:opacity-50 min-w-17.5"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}