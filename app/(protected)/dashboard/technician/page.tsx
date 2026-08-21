// app/(protected)/dashboard/technician/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Package,
  MapPin,
  Loader2,
  RefreshCw,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  UserRound,
} from "lucide-react";

interface TechnicianMetrics {
  patients: number;
  orders: number;
  visits: number;
}

interface DropdownOption {
  id: string;
  name: string;
}

interface TestOption {
  id: string;
  name: string;
  price: number;
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

  // Options State for Visit Form Dropdowns
  const [patientsOptions, setPatientsOptions] = useState<DropdownOption[]>([]);
  const [doctorsOptions, setDoctorsOptions] = useState<DropdownOption[]>([]);
  const [isLoadingVisitOptions, setIsLoadingVisitOptions] = useState<boolean>(false);

  // Options & Selection State for Order Form Dropdowns
  const [departmentsOptions, setDepartmentsOptions] = useState<DropdownOption[]>([]);
  const [panelsOptions, setPanelsOptions] = useState<DropdownOption[]>([]);
  const [testsOptions, setTestsOptions] = useState<TestOption[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [isLoadingDepts, setIsLoadingDepts] = useState<boolean>(false);
  const [isLoadingPanels, setIsLoadingPanels] = useState<boolean>(false);
  const [isLoadingTests, setIsLoadingTests] = useState<boolean>(false);

  // Order Patient & Visit Dropdown States
  const [selectedOrderPatientId, setSelectedOrderPatientId] = useState<string>("");
  const [visitsOptions, setVisitsOptions] = useState<DropdownOption[]>([]);
  const [isLoadingVisits, setIsLoadingVisits] = useState<boolean>(false);

  // Patient Form Fields State
  const [patientData, setPatientData] = useState({
    first_name: "",
    last_name: "",
    mrn: "",
    dob: "",
    email: "",
    phone: "",
    gender: "ALL",
    address: "",
  });

  // Visit Form Fields State
  const [visitData, setVisitData] = useState({
    visit_no: "",
    patient_id: "",
    doctor_id: "",
    status: "",
  });

  // Order Form Fields State
  const [orderData, setOrderData] = useState({
    visit_id: "",
    panel_id: "",
    test_id: "",
    price: 0,
    status: "",
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

  // Fetch dropdown options for Visit & Order forms (Patients & Doctors)
  useEffect(() => {
    if (activeModal !== "visit" && activeModal !== "order") return;

    const fetchVisitDropdownOptions = async () => {
      setIsLoadingVisitOptions(true);
      const token = getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const [patientsRes, doctorsRes] = await Promise.allSettled([
          fetch(`${BASE_URL}/patient`, { headers }),
          fetch(`${BASE_URL}/doctor`, { headers }),
        ]);

        if (patientsRes.status === "fulfilled" && patientsRes.value.ok) {
          const data = await patientsRes.value.json();
          const rawPatients = Array.isArray(data) ? data : data?.data || [];
          const formattedPatients = rawPatients.map((p: any) => ({
            id: String(p.patient_id || p.id || ""),
            name:
              p.full_name ||
              p.patient_name ||
              (p.first_name ? `${p.first_name} ${p.last_name || ""}`.trim() : null) ||
              p.name ||
              "Unknown Patient",
          }));
          setPatientsOptions(formattedPatients);
        }

        if (doctorsRes.status === "fulfilled" && doctorsRes.value.ok) {
          const data = await doctorsRes.value.json();
          const rawDoctors = Array.isArray(data) ? data : data?.data || [];
          const formattedDoctors = rawDoctors.map((d: any) => {
            const doctorName =
              d.full_name ||
              d.doctor_name ||
              (d.first_name ? `${d.first_name} ${d.last_name || ""}`.trim() : null) ||
              d.name ||
              "Unknown Doctor";
            return {
              id: String(d.doctor_id || d.id || ""),
              name: doctorName.startsWith("Dr.") ? doctorName : `Dr. ${doctorName}`,
            };
          });
          setDoctorsOptions(formattedDoctors);
        }
      } catch (err) {
        console.error("Failed to load options for dropdowns:", err);
      } finally {
        setIsLoadingVisitOptions(false);
      }
    };

    fetchVisitDropdownOptions();
  }, [activeModal, BASE_URL, getAuthToken]);

  // Fetch visits dynamically based on selected patient in Order form
  useEffect(() => {
    if (activeModal !== "order" || !selectedOrderPatientId) {
      setVisitsOptions([]);
      setOrderData((prev) => ({ ...prev, visit_id: "" }));
      return;
    }

    const fetchVisitsByPatient = async () => {
      setIsLoadingVisits(true);
      const token = getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const res = await fetch(`${BASE_URL}/visit/patient/${selectedOrderPatientId}`, { headers })
          .then((r) => (r.ok ? r : fetch(`${BASE_URL}/visit?patient_id=${selectedOrderPatientId}`, { headers })))
          .then((r) => (r.ok ? r : fetch(`${BASE_URL}/visit`, { headers })));

        if (res.ok) {
          const data = await res.json();
          const rawVisits = Array.isArray(data) ? data : data?.data || [];
          
          const filteredVisits = rawVisits.filter((v: any) => {
            const pId = String(v.patient_id || v.patient?.id || v.patient?.patient_id || "");
            return !pId || pId === selectedOrderPatientId;
          });

          setVisitsOptions(
            filteredVisits.map((v: any) => ({
              id: String(v.visit_id || v.id || ""),
              name: String(v.visit_no || v.visit_number || `Visit #${v.visit_id || v.id}`),
            }))
          );
        }
      } catch (err) {
        console.error("Error loading visits for selected patient:", err);
      } finally {
        setIsLoadingVisits(false);
      }
    };

    fetchVisitsByPatient();
  }, [activeModal, selectedOrderPatientId, BASE_URL, getAuthToken]);

  // Fetch departments when Order Modal opens
  useEffect(() => {
    if (activeModal !== "order") return;

    const fetchDepartments = async () => {
      setIsLoadingDepts(true);
      const token = getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const res = await fetch(`${BASE_URL}/lab-test/list-department`, { headers });
        if (res.ok) {
          const data = await res.json();
          const rawDepts = Array.isArray(data)
            ? data
            : data?.data || data?.departments || [];
          setDepartmentsOptions(
            rawDepts.map((d: any) => ({
              id: String(d.dept_id || d.id || ""),
              name: String(d.dept_name || d.name || ""),
            }))
          );
        }
      } catch (err) {
        console.error("Error loading departments:", err);
        setDepartmentsOptions([]);
      } finally {
        setIsLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, [activeModal, BASE_URL, getAuthToken]);

  // Fetch Test Panels & Test Catalogs based on selected department
  useEffect(() => {
    if (activeModal !== "order" || !selectedDeptId) {
      setPanelsOptions([]);
      setTestsOptions([]);
      setOrderData((prev) => ({ ...prev, panel_id: "", test_id: "" }));
      return;
    }

    const fetchDataByDepartment = async () => {
      setIsLoadingPanels(true);
      setIsLoadingTests(true);
      setPanelsOptions([]);
      setTestsOptions([]);
      setOrderData((prev) => ({ ...prev, panel_id: "", test_id: "" }));

      const token = getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        const res = await fetch(`${BASE_URL}/lab-test/list-panel/${selectedDeptId}`, { headers })
          .then((r) => (r.ok ? r : fetch(`${BASE_URL}/panel?dept_id=${selectedDeptId}`, { headers })));
        if (res.ok) {
          const data = await res.json();
          const rawPanels = Array.isArray(data) ? data : data?.data || [];
          setPanelsOptions(
            rawPanels.map((p: any) => ({
              id: String(p.panel_id || p.id || ""),
              name: String(p.panel_name || p.name || ""),
            }))
          );
        }
      } catch (err) {
        console.error("Error loading panels for department:", err);
      } finally {
        setIsLoadingPanels(false);
      }

      try {
        const res = await fetch(`${BASE_URL}/lab-test/list-catalog/${selectedDeptId}`, { headers })
          .then((r) => (r.ok ? r : fetch(`${BASE_URL}/test-catalog?dept_id=${selectedDeptId}`, { headers })));
        if (res.ok) {
          const data = await res.json();
          const rawCatalogs = Array.isArray(data) ? data : data?.data || [];
          setTestsOptions(
            rawCatalogs.map((item: any) => ({
              id: String(item.test_catalog_id || item.id || ""),
              name: String(item.test_name || item.name || ""),
              price: Number(item.test_price || item.price || 0),
            }))
          );
        }
      } catch (err) {
        console.error("Error loading test catalog by department:", err);
      } finally {
        setIsLoadingTests(false);
      }
    };

    fetchDataByDepartment();
  }, [activeModal, selectedDeptId, BASE_URL, getAuthToken]);

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
      } catch (err) {
        console.error(`Error parsing JSON for ${endpointName}:`, err);
      }
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
        fetch(`${BASE_URL}/order/list`, fetchOpts),
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
      console.error("Fetch dashboard stats error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL, getAuthToken]);

  useEffect(() => {
    if (sessionStatus === "loading") return;

    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 10000);
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
    setSelectedDeptId("");
    setSelectedOrderPatientId("");
    setVisitsOptions([]);
    setPanelsOptions([]);
    setTestsOptions([]);
    setPatientData({
      first_name: "",
      last_name: "",
      mrn: "",
      dob: "",
      email: "",
      phone: "",
      gender: "ALL",
      address: "",
    });
    setVisitData({
      visit_no: "",
      patient_id: "",
      doctor_id: "",
      status: "",
    });
    setOrderData({
      visit_id: "",
      panel_id: "",
      test_id: "",
      price: 0,
      status: "",
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
        payload = {
          visit_id: orderData.visit_id || null,
          panel_id: orderData.panel_id || null,
          test_id: orderData.test_id || null,
          price: Number(orderData.price) || 0,
          status: orderData.status || null,
        };
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
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const metricCards = [
    {
      label: "Patients",
      value: metrics.patients,
      icon: UserRound,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Visits",
      value: metrics.visits,
      icon: MapPin,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Orders",
      value: metrics.orders,
      icon: Package,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
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
              Quickly add new entries to the system.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => setActiveModal("patient")}
            className="h-10 flex items-center gap-3 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-600 text-white text-xs font-semibold transition-all group cursor-pointer shadow-xs"
          >
            <div className="p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add Patient</span>
          </button>

          <button
            onClick={() => setActiveModal("visit")}
            className="h-10 flex items-center gap-3 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-600 text-white text-xs font-semibold transition-all group cursor-pointer shadow-xs"
          >
            <div className="p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add Visit</span>
          </button>

          <button
            onClick={() => setActiveModal("order")}
            className="h-10 flex items-center gap-3 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-600 text-white text-xs font-semibold transition-all group cursor-pointer shadow-xs"
          >
            <div className="p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add Order</span>
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
                  {activeModal === "visit" && "Add New Visit"}
                  {activeModal === "order" && "Add New Order"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {activeModal === "patient" &&
                    "Enter the required information to create a new patient in the system."}
                  {activeModal === "visit" &&
                    "Enter the required information to create a new visit in the system."}
                  {activeModal === "order" &&
                    "Enter the required information to create a new order in the system."}
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
                          setPatientData({
                            ...patientData,
                            first_name: e.target.value,
                          })
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
                          setPatientData({
                            ...patientData,
                            last_name: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Medical Record Number (MRN)
                      </label>
                      <input
                        type="text"
                        value={patientData.mrn}
                        onChange={(e) =>
                          setPatientData({
                            ...patientData,
                            mrn: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={patientData.dob}
                        onChange={(e) =>
                          setPatientData({
                            ...patientData,
                            dob: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={patientData.email}
                        onChange={(e) =>
                          setPatientData({
                            ...patientData,
                            email: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Contact
                      </label>
                      <input
                        type="text"
                        value={patientData.phone}
                        onChange={(e) =>
                          setPatientData({
                            ...patientData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Gender
                      </label>
                      <select
                        value={patientData.gender}
                        onChange={(e) =>
                          setPatientData({
                            ...patientData,
                            gender: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#00a66c]"
                      >
                        <option value="ALL">Select a Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Address
                      </label>
                      <input
                        type="text"
                        value={patientData.address}
                        onChange={(e) =>
                          setPatientData({
                            ...patientData,
                            address: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Add Visit Modal */}
              {activeModal === "visit" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Visit No.
                    </label>
                    <input
                      type="text"
                      placeholder="V-XXXX"
                      value={visitData.visit_no}
                      onChange={(e) =>
                        setVisitData({
                          ...visitData,
                          visit_no: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Patient Name
                    </label>
                    <select
                      value={visitData.patient_id}
                      disabled={isLoadingVisitOptions}
                      onChange={(e) =>
                        setVisitData({
                          ...visitData,
                          patient_id: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#00a66c] disabled:opacity-50 cursor-pointer"
                    >
                      <option value="">
                        {isLoadingVisitOptions
                          ? "Loading patients..."
                          : "Select a Patient"}
                      </option>
                      {patientsOptions.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Referring Doctor
                      </label>
                      <select
                        value={visitData.doctor_id}
                        disabled={isLoadingVisitOptions}
                        onChange={(e) =>
                          setVisitData({
                            ...visitData,
                            doctor_id: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#00a66c] disabled:opacity-50 cursor-pointer"
                      >
                        <option value="">
                          {isLoadingVisitOptions
                            ? "Loading..."
                            : "Select a Doctor"}
                        </option>
                        {doctorsOptions.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Visit Status
                      </label>
                      <select
                        value={visitData.status}
                        onChange={(e) =>
                          setVisitData({ ...visitData, status: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#00a66c] cursor-pointer"
                      >
                        <option value="">Select a Visit Status</option>
                        <option value="registered">Registered</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Add Order Modal */}
              {activeModal === "order" && (
                <div className="space-y-4">
                  {/* Select Patient Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Select Patient
                    </label>
                    <select
                      value={selectedOrderPatientId}
                      disabled={isLoadingVisitOptions}
                      onChange={(e) => {
                        setSelectedOrderPatientId(e.target.value);
                        setOrderData({ ...orderData, visit_id: "" });
                      }}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#00a66c] cursor-pointer disabled:opacity-50"
                    >
                      <option value="">
                        {isLoadingVisitOptions
                          ? "Loading patients..."
                          : "Select a Patient"}
                      </option>
                      {patientsOptions.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Visit Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Select Visit
                    </label>
                    <select
                      value={orderData.visit_id}
                      disabled={isLoadingVisits || !selectedOrderPatientId}
                      onChange={(e) =>
                        setOrderData({
                          ...orderData,
                          visit_id: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#00a66c] cursor-pointer disabled:opacity-50"
                    >
                      <option value="">
                        {!selectedOrderPatientId
                          ? "Select a Patient First"
                          : isLoadingVisits
                          ? "Loading visits..."
                          : "Select a Visit"}
                      </option>
                      {visitsOptions.map((visit) => (
                        <option key={visit.id} value={visit.id}>
                          {visit.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Department
                    </label>
                    <select
                      value={selectedDeptId}
                      disabled={isLoadingDepts}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-[#00a66c] cursor-pointer disabled:opacity-50"
                    >
                      <option value="">
                        {isLoadingDepts
                          ? "Loading departments..."
                          : "Select a Department"}
                      </option>
                      {departmentsOptions.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Test Panel Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Test Panel
                    </label>
                    <select
                      value={orderData.panel_id}
                      disabled={isLoadingPanels || !selectedDeptId}
                      onChange={(e) =>
                        setOrderData({
                          ...orderData,
                          panel_id: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-[#00a66c] cursor-pointer disabled:opacity-50"
                    >
                      <option value="">
                        {!selectedDeptId
                          ? "Select Department First"
                          : isLoadingPanels
                          ? "Loading panels..."
                          : "Select a Test Panel"}
                      </option>
                      {panelsOptions.map((panel) => (
                        <option key={panel.id} value={panel.id}>
                          {panel.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Test Catalog Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Test Catalog
                    </label>
                    <select
                      value={orderData.test_id}
                      disabled={isLoadingTests || !selectedDeptId}
                      onChange={(e) => {
                        const testId = e.target.value;
                        const foundTest = testsOptions.find(
                          (t) => t.id === testId
                        );
                        setOrderData({
                          ...orderData,
                          test_id: testId,
                          price: foundTest?.price ?? orderData.price,
                        });
                      }}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-[#00a66c] cursor-pointer disabled:opacity-50"
                    >
                      <option value="">
                        {!selectedDeptId
                          ? "Select a Department First"
                          : isLoadingTests
                          ? "Loading tests..."
                          : "Select a Test Catalog"}
                      </option>
                      {testsOptions.map((test) => (
                        <option key={test.id} value={test.id}>
                          {test.name}{" "}
                          {test.price ? `($${test.price.toFixed(2)})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price & Order Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={orderData.price}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Order Status
                      </label>
                      <select
                        value={orderData.status}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            status: e.target.value,
                          })
                        }
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:outline-none focus:border-[#00a66c] cursor-pointer"
                      >
                        <option value="">Select a Order Status</option>
                        <option value="collected">Collected</option>
                        <option value="result_entered">Result Entered</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
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
                  className="inline-flex items-center justify-center gap-2 px-6 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all cursor-pointer disabled:opacity-50 min-w-17.5"
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