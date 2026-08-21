"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { profileService } from "@/services/profile.service";
import type { Profile, ProfileUpdateRequest } from "@/types/profile.types";

export default function TechnicianProfilePage() {
  const [profileId, setProfileId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "ROLE_TECHNICIAN",
  });

  const fetchMyProfile = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setErrorMessage(null);
    try {
      const data: Profile = await profileService.getMe();

      // Fall back to user_id to ensure updateProfile calls the correct endpoint ID
      setProfileId(data.user_id || data.id || "");
      setFormData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role_name || "ROLE_TECHNICIAN",
      });
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setErrorMessage(
        err?.response?.data?.message || err.message || "Failed to load technician profile details."
      );
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProfile(true);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) {
      setErrorMessage("Profile ID is missing. Cannot perform update.");
      return;
    }

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const payload: ProfileUpdateRequest = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role_name: formData.role,
    };

    try {
      const responseMessage = await profileService.updateProfile(profileId, payload);

      // Re-fetch profile to sync state directly with backend database records
      await fetchMyProfile(false);

      setSuccessMessage(
        typeof responseMessage === "string" && responseMessage.length > 0
          ? responseMessage
          : "Profile updated successfully!"
      );

      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      const serverMessages = err?.response?.data?.messages || err?.response?.data?.message;
      setErrorMessage(
        Array.isArray(serverMessages)
          ? serverMessages.join(", ")
          : serverMessages || err.message || "An error occurred while saving changes."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50/60 p-6">
        <div className="flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-sm text-xs font-semibold text-slate-500 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          Fetching my profile...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 via-slate-50/80 to-emerald-50/20 p-4 sm:p-8 lg:p-12 space-y-6">
      {/* Header Banner Section */}
      <div className="w-full bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-600/20 ring-4 ring-white shrink-0">
              {formData.firstName?.[0] || "T"}
              {formData.lastName?.[0] || ""}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {formData.firstName || "Technician"} {formData.lastName || "Profile"}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  {formData.role}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {formData.email || "No email set"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <button
              type="button"
              onClick={() => fetchMyProfile(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/60 rounded-xl transition-all active:scale-95 cursor-pointer text-slate-700 text-xs font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Refresh</span>
            </button>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50/80 border border-emerald-200/60 rounded-xl text-emerald-800 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Status: <strong className="text-emerald-700">Active</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Notifications */}
      {errorMessage && (
        <div className="w-full flex items-center gap-3 p-4 rounded-2xl bg-rose-50/90 border border-rose-200/80 text-xs font-semibold text-rose-800 shadow-sm animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="w-full flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 text-xs font-semibold text-emerald-800 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <div className="w-full bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">My Account Information</h2>
            <p className="text-xs text-slate-500 mt-1">
              Edit my technician account information in the system.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Enter first name"
                className="w-full h-11 px-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-2xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Enter last name"
                className="w-full h-11 px-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full h-11 px-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-2xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Contact
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full h-11 px-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-2xs"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-8 h-11 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition-all duration-200 shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}