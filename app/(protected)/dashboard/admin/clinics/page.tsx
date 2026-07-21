// app/(dashboard)/admin/clinics/page.tsx
"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  ArrowUpRight, 
  FileText,
  Users
} from "lucide-react";

// Mock Data representing integrated clinics
const initialClinics = [
  {
    id: "CLN-001",
    name: "Apex Care Medical Center",
    location: "Downtown Core, Suite 402",
    contact: "+1 (555) 234-5678",
    email: "admin@apexcare.com",
    status: "ACTIVE",
    reportsCount: 1240,
    joinedDate: "Jan 12, 2025",
  },
  {
    id: "CLN-002",
    name: "Green Valley Pediatrics",
    location: "North Suburbs, BLDG B",
    contact: "+1 (555) 876-5432",
    email: "contact@greenvalleypeds.com",
    status: "ACTIVE",
    reportsCount: 842,
    joinedDate: "Mar 05, 2025",
  },
  {
    id: "CLN-003",
    name: "Metro Health Diagnostics",
    location: "East Side Medical District",
    contact: "+1 (555) 456-7890",
    email: "info@metrohealth.org",
    status: "PENDING",
    reportsCount: 0,
    joinedDate: "Feb 18, 2026",
  },
  {
    id: "CLN-004",
    name: "Radiant Life Family Clinic",
    location: "West End Plaza, Ground Floor",
    contact: "+1 (555) 987-6543",
    email: "support@radiantlife.com",
    status: "INACTIVE",
    reportsCount: 412,
    joinedDate: "Sep 22, 2024",
  },
];

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState(initialClinics);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Filtering Logic
  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch = 
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || clinic.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50/50 min-h-screen">
      
      {/* Upper Dashboard Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clinics Directory</h1>
          <p className="text-sm font-medium text-slate-500">
            Manage corporate clinic profiles, monitor connection lifecycles, and audit report throughput.
          </p>
        </div>
        
        <button className="h-11 px-5 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 text-white font-semibold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/10 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          <span>Register New Clinic</span>
        </button>
      </div>

      {/* Aggregate High-Level Analytical Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric Card 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Partnerships</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">48</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +4 added this month
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Reports Shared</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">2,494</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +18.2% vs last week
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Client Reach</p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">14.2k</h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Aggregated patient network
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Control Strip & Directory Data Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        
        {/* Filtering & Live Search Interface Action Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white">
          
          {/* Search Box */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by clinic name, ID, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-sm font-medium rounded-full border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white transition-all"
            />
          </div>

          {/* Status Tabs Filter */}
          <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full text-xs font-semibold text-slate-600">
              {["ALL", "ACTIVE", "PENDING", "INACTIVE"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    statusFilter === status
                      ? "bg-white text-emerald-700 shadow-xs"
                      : "hover:text-slate-900"
                  }`}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Main Operational Table Layer */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Clinic Info</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Contact Channels</th>
                <th className="py-4 px-6 text-center">Throughput</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {filteredClinics.length > 0 ? (
                filteredClinics.map((clinic) => (
                  <tr key={clinic.id} className="hover:bg-slate-50/40 transition-colors group">
                    
                    {/* Clinic Primary Identification Column */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {clinic.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold text-[10px]">
                            {clinic.id}
                          </span>
                          <span>Registered {clinic.joinedDate}</span>
                        </div>
                      </div>
                    </td>

                    {/* Geography/Location Profile info */}
                    <td className="py-4 px-6 text-slate-500 font-normal">
                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{clinic.location}</span>
                      </div>
                    </td>

                    {/* Direct Contact Anchors */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5 text-xs">
                        <p className="text-slate-600 flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {clinic.contact}
                        </p>
                        <p className="text-slate-400 font-normal">{clinic.email}</p>
                      </div>
                    </td>

                    {/* Output Counter Metric Column */}
                    <td className="py-4 px-6 text-center font-bold text-slate-800">
                      {clinic.reportsCount > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">
                          {clinic.reportsCount.toLocaleString()} units
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-normal italic">No activity</span>
                      )}
                    </td>

                    {/* Operational Lifecycle Pipeline Status Component */}
                    <td className="py-4 px-6">
                      {clinic.status === "ACTIVE" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Active
                        </span>
                      )}
                      {clinic.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100 animate-pulse">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Pending Pipeline
                        </span>
                      )}
                      {clinic.status === "INACTIVE" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                          <XCircle className="w-3.5 h-3.5" />
                          Suspended
                        </span>
                      )}
                    </td>

                    {/* Dropdown Action Node Trigger */}
                    <td className="py-4 px-6 text-center">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer inline-flex items-center">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                /* Empty Dataset Visual Response State */
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium italic bg-slate-50/20">
                    No partner clinics found matching the defined evaluation queries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Context Pagination Footnote Row */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 bg-slate-50/30">
          <span>Showing {filteredClinics.length} of {clinics.length} entries</span>
          <div className="flex items-center gap-2">
            <button disabled className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Previous</button>
            <button disabled className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg opacity-50 cursor-not-allowed">Next</button>
          </div>
        </div>

      </div>

    </div>
  );
}