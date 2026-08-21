"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  Stethoscope,
  Building2,
  Loader2,
  RefreshCw,
  FlaskConical,
  Microscope,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface DashboardCounts {
  doctors: number;
  departments: number;
  labs: number;
  users: number;
}

type QuickActionType = "department" | "doctor" | "lab" | "user" | null;

export default function AdminDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [counts, setCounts] = useState<DashboardCounts>({
    doctors: 0,
    departments: 0,
    labs: 0,
    users: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal and Form States
  const [activeModal, setActiveModal] = useState<QuickActionType>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [formSuccess, setFormSuccess] = useState<string>("");

  // Department Form Fields State
  const [departmentData, setDepartmentData] = useState({
    dept_name: "",
    dept_description: "",
  });

  // Doctor Form Fields State
  const [doctorData, setDoctorData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    qualification: "",
    registration_no: "",
  });

  // Lab Form Fields State
  const [labData, setLabData] = useState({
    lab_name: "",
    tagline: "",
    address: "",
    phone: "",
    email: "",
    registration_no: "",
    report_footer: "",
  });

  // User Form Fields State (integrated from UserForm)
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role_name: "",
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
        if (Array.isArray(data?.doctors)) return data.doctors.length;
        if (Array.isArray(data?.departments)) return data.departments.length;
        if (Array.isArray(data?.labs)) return data.labs.length;
        if (Array.isArray(data?.profiles)) return data.profiles.length;
      } catch (err) {
        console.error(`[Dashboard Debug] Error parsing JSON for ${endpointName}:`, err);
      }
    } else if (res.status === "fulfilled") {
      if (res.value.status === 401) {
        console.warn(`[Dashboard Debug] ${endpointName} request unauthenticated (401). Check token validity.`);
      } else {
        console.warn(`[Dashboard Debug] ${endpointName} returned status ${res.value.status}`);
      }
    } else {
      console.error(`[Dashboard Debug] ${endpointName} request failed:`, res.reason);
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
      const [doctorsRes, departmentsRes, labsRes, usersRes] =
        await Promise.allSettled([
          fetch(`${BASE_URL}/doctor`, fetchOpts),
          fetch(`${BASE_URL}/lab-test/list-department`, fetchOpts),
          fetch(`${BASE_URL}/admin/lab`, fetchOpts),
          fetch(`${BASE_URL}/admin/profile/profile-details`, fetchOpts),
        ]);

      const doctorsCount = await parseCount(doctorsRes, "Doctors");
      const departmentsCount = await parseCount(departmentsRes, "Departments");
      const labsCount = await parseCount(labsRes, "Laboratories");
      const usersCount = await parseCount(usersRes, "Users");

      setCounts({
        doctors: doctorsCount,
        departments: departmentsCount,
        labs: labsCount,
        users: usersCount,
      });
    } catch (error) {
      console.error("[Dashboard Debug] Fetch error:", error);
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
    setDepartmentData({ dept_name: "", dept_description: "" });
    setDoctorData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      qualification: "",
      registration_no: "",
    });
    setLabData({
      lab_name: "",
      tagline: "",
      address: "",
      phone: "",
      email: "",
      registration_no: "",
      report_footer: "",
    });
    setUserData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      role_name: "",
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
      case "department":
        endpoint = `${BASE_URL}/admin/lab-test/create-department`;
        payload = {
          dept_name: departmentData.dept_name,
          dept_description: departmentData.dept_description,
        };
        break;
      case "doctor":
        endpoint = `${BASE_URL}/admin/doctor`;
        payload = {
          first_name: doctorData.first_name,
          last_name: doctorData.last_name,
          email: doctorData.email,
          phone: doctorData.phone,
          qualification: doctorData.qualification,
          registration_no: doctorData.registration_no,
        };
        break;
      case "lab":
        endpoint = `${BASE_URL}/admin/lab`;
        payload = Object.fromEntries(
          Object.entries(labData).map(([key, val]) => [
            key,
            typeof val === "string" && val.trim() === "" ? null : val,
          ])
        );
        break;
      case "user":
        endpoint = `${BASE_URL}/special/user/create`;
        payload = Object.fromEntries(
          Object.entries(userData).map(([key, val]) => [
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
      console.error("[Dashboard Quick Action Error]:", err);
      setFormError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    {
      label: "Doctors",
      value: counts.doctors,
      icon: Stethoscope,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Departments",
      value: counts.departments,
      icon: Building2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Laboratories",
      value: counts.labs,
      icon: Microscope,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Users",
      value: counts.users,
      icon: Users,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Overview</h1>
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
              className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  ) : (
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  )}
                </div>
              </div>
              <div className={`p-3.5 rounded-xl border ${stat.color}`}>
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <button
            onClick={() => setActiveModal("department")}
            className="h-10 inline-flex items-center gap-3 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-600 text-white text-xs font-semibold transition-all group cursor-pointer shadow-xs"
          >
            <div className="p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add Department</span>
          </button>

          <button
            onClick={() => setActiveModal("doctor")}
            className="h-10 flex items-center gap-3 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-600 text-white text-xs font-semibold transition-all group cursor-pointer shadow-xs"
          >
            <div className="p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add Doctor</span>
          </button>

          <button
            onClick={() => setActiveModal("lab")}
            className="h-10 flex items-center gap-3 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-600 text-white text-xs font-semibold transition-all group cursor-pointer shadow-xs"
          >
            <div className="p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add Laboratory</span>
          </button>

          <button
            onClick={() => setActiveModal("user")}
            className="h-10 flex items-center gap-3 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-600 text-white text-xs font-semibold transition-all group cursor-pointer shadow-xs"
          >
            <div className="p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add User</span>
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
                  {activeModal === "department" && "Add New Department"}
                  {activeModal === "doctor" && "Add New Doctor"}
                  {activeModal === "lab" && "Add New Lab"}
                  {activeModal === "user" && "Add New User"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {activeModal === "department" && "Enter the required information to create a new department in the system."}
                  {activeModal === "doctor" && "Enter the required information to create a new doctor in the system."}
                  {activeModal === "lab" && "Enter the required information to create a new lab in the system."}
                  {activeModal === "user" && "Enter the required information to create a new user in the system."}
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

              {/* 1. Add Department Modal */}
              {activeModal === "department" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Department Name
                    </label>
                    <input
                      type="text"
                      required
                      value={departmentData.dept_name}
                      onChange={(e) =>
                        setDepartmentData({ ...departmentData, dept_name: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Department Description
                    </label>
                    <input
                      type="text"
                      value={departmentData.dept_description}
                      onChange={(e) =>
                        setDepartmentData({ ...departmentData, dept_description: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>
                </div>
              )}

              {/* 2. Add Doctor Modal */}
              {activeModal === "doctor" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={doctorData.first_name}
                        onChange={(e) =>
                          setDoctorData({ ...doctorData, first_name: e.target.value })
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
                        value={doctorData.last_name}
                        onChange={(e) =>
                          setDoctorData({ ...doctorData, last_name: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Email</label>
                    <input
                      type="email"
                      required
                      value={doctorData.email}
                      onChange={(e) =>
                        setDoctorData({ ...doctorData, email: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Contact</label>
                    <input
                      type="text"
                      value={doctorData.phone}
                      onChange={(e) =>
                        setDoctorData({ ...doctorData, phone: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Qualifications
                    </label>
                    <input
                      type="text"
                      placeholder="MD, MBBS, PhD"
                      value={doctorData.qualification}
                      onChange={(e) =>
                        setDoctorData({ ...doctorData, qualification: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Registration No.
                    </label>
                    <input
                      type="text"
                      value={doctorData.registration_no}
                      onChange={(e) =>
                        setDoctorData({ ...doctorData, registration_no: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>
                </div>
              )}

              {/* 3. Add Lab Modal */}
              {activeModal === "lab" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Lab Name</label>
                      <input
                        type="text"
                        required
                        value={labData.lab_name}
                        onChange={(e) =>
                          setLabData({ ...labData, lab_name: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Tagline / Motto
                      </label>
                      <input
                        type="text"
                        value={labData.tagline}
                        onChange={(e) =>
                          setLabData({ ...labData, tagline: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Address</label>
                    <input
                      type="text"
                      value={labData.address}
                      onChange={(e) =>
                        setLabData({ ...labData, address: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Email</label>
                      <input
                        type="email"
                        value={labData.email}
                        onChange={(e) =>
                          setLabData({ ...labData, email: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Contact</label>
                      <input
                        type="text"
                        value={labData.phone}
                        onChange={(e) =>
                          setLabData({ ...labData, phone: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Official Registration No
                    </label>
                    <input
                      type="text"
                      value={labData.registration_no}
                      onChange={(e) =>
                        setLabData({ ...labData, registration_no: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      PDF Report Footer Settings
                    </label>
                    <input
                      type="text"
                      placeholder="System footer copyright or terms statement"
                      value={labData.report_footer}
                      onChange={(e) =>
                        setLabData({ ...labData, report_footer: e.target.value })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                    />
                  </div>
                </div>
              )}

              {/* 4. Add User Modal */}
              {activeModal === "user" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={userData.first_name}
                        onChange={(e) =>
                          setUserData({ ...userData, first_name: e.target.value })
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
                        value={userData.last_name}
                        onChange={(e) =>
                          setUserData({ ...userData, last_name: e.target.value })
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
                        required
                        value={userData.email}
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
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
                        value={userData.phone}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={userData.password}
                        onChange={(e) =>
                          setUserData({ ...userData, password: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        User Role
                      </label>
                      <input
                        type="text"
                        value={userData.role_name}
                        onChange={(e) =>
                          setUserData({ ...userData, role_name: e.target.value })
                        }
                        placeholder="E.g., ROLE_TECHNICIAN"
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#00a66c]"
                      />
                    </div>
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