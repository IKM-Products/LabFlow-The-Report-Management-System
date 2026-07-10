"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Stethoscope, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  CheckCircle, 
  XCircle,
  SlidersHorizontal
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock Data representing your database diagram structures
const MOCK_CLINICS = [
  { id: 1, name: "Metro Health Care", address: "Kathmandu, Nepal", phone: "+977-1-4444444", email: "info@metrohealth.com", created_at: "2026-02-15" },
  { id: 2, name: "City Diagnostics & Care", address: "Lalitpur, Nepal", phone: "+977-1-5555555", email: "contact@citydiag.com", created_at: "2026-04-10" },
];

const MOCK_DOCTORS = [
  { id: 1, clinic_id: 1, clinic_name: "Metro Health Care", full_name: "Dr. Ramesh Thapa", qualification: "MD, Cardiologist", registration_no: "NMC-12345", phone: "9851011111", email: "ramesh.thapa@gmail.com", status: "active" },
  { id: 2, clinic_id: 1, clinic_name: "Metro Health Care", full_name: "Dr. Sita Sitaula", qualification: "MBBS, MD Pediatrics", registration_no: "NMC-98765", phone: "9841022222", email: "sita.s@gmail.com", status: "active" },
  { id: 3, clinic_id: 2, clinic_name: "City Diagnostics & Care", full_name: "Dr. Asim Shrestha", qualification: "MD, Pathologist", registration_no: "NMC-45671", phone: "9801033333", email: "asim.path@gmail.com", status: "inactive" },
];

export default function ClinicsDoctorsPage() {
  const [activeTab, setActiveTab] = useState<"clinics" | "doctors">("clinics");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClinics = MOCK_CLINICS.filter(clinic => 
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clinic.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoctors = MOCK_DOCTORS.filter(doc => 
    doc.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.registration_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.clinic_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Editorial Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-neutral-100">
        <div>
          <h1 className="text-3xl font-serif font-normal italic tracking-tight text-neutral-900">
            Referral Network
          </h1>
          <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase mt-1">
            Manage Partner Clinics and Registered Doctors
          </p>
        </div>
        
        <Button className="bg-[#00a365] hover:bg-[#008f58] text-white font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]">
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Add New {activeTab === "clinics" ? "Clinic" : "Doctor"}
        </Button>
      </div>

      {/* Control Utility Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-neutral-50 p-3 rounded-2xl border border-neutral-200/50">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400 group-focus-within:text-[#00a365] transition-colors" />
          <Input 
            placeholder={activeTab === "clinics" ? "Search clinics by name, email..." : "Search doctors by name, NMC number..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 bg-white border-neutral-200 focus:border-emerald-600 focus-visible:ring-0 rounded-xl text-sm"
          />
        </div>

        <Button variant="outline" className="w-full sm:w-auto h-11 border-neutral-200 text-neutral-600 rounded-xl flex items-center gap-2 bg-white font-medium">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Primary Data Layout Matrix */}
      <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value as "clinics" | "doctors"); setSearchQuery(""); }} className="w-full">
        <TabsList className="bg-neutral-100/80 p-1 rounded-xl mb-6">
          <TabsTrigger value="clinics" className="rounded-lg font-semibold tracking-wide text-xs px-4 py-2.5 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs">
            <Building2 className="h-4 w-4" />
            Clinics ({MOCK_CLINICS.length})
          </TabsTrigger>
          <TabsTrigger value="doctors" className="rounded-lg font-semibold tracking-wide text-xs px-4 py-2.5 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs">
            <Stethoscope className="h-4 w-4" />
            Doctors ({MOCK_DOCTORS.length})
          </TabsTrigger>
        </TabsList>

        {/* CLINICS TABLE PANEL */}
        <TabsContent value="clinics" className="focus-visible:outline-hidden">
          <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-neutral-600">
                <thead className="bg-neutral-50/70 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Clinic Identity</th>
                    <th className="px-6 py-4">Location Address</th>
                    <th className="px-6 py-4">Contact Info</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {filteredClinics.length > 0 ? (
                    filteredClinics.map((clinic) => (
                      <tr key={clinic.id} className="hover:bg-neutral-50/40 transition-colors">
                        <td className="px-6 py-4 font-semibold text-neutral-900">{clinic.name}</td>
                        <td className="px-6 py-4 text-neutral-500">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                            {clinic.address}
                          </div>
                        </td>
                        <td className="px-6 py-4 space-y-1 text-xs text-neutral-500">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-neutral-400" />
                            {clinic.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-neutral-400" />
                            {clinic.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-bold rounded-lg px-3 py-1.5">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-neutral-400 font-medium">No clinics found matching criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* DOCTORS TABLE PANEL */}
        <TabsContent value="doctors" className="focus-visible:outline-hidden">
          <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-neutral-600">
                <thead className="bg-neutral-50/70 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Medical Professional</th>
                    <th className="px-6 py-4">Affiliated Clinic</th>
                    <th className="px-6 py-4">Registration No.</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-neutral-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-neutral-900">{doc.full_name}</div>
                          <div className="text-xs text-neutral-400 font-normal">{doc.qualification}</div>
                        </td>
                        <td className="px-6 py-4 text-neutral-600">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                            {doc.clinic_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutral-500">
                          <div className="flex items-center gap-2 text-xs font-mono bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded-md w-fit">
                            <FileText className="h-3 w-3 text-neutral-400" />
                            {doc.registration_no}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {doc.status === "active" ? (
                            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200/60 capitalize text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 w-fit shadow-none">
                              <CheckCircle className="h-3 w-3 text-emerald-600" /> Active
                            </Badge>
                          ) : (
                            <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 border-rose-200/60 capitalize text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 w-fit shadow-none">
                              <XCircle className="h-3 w-3 text-rose-600" /> Inactive
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-bold rounded-lg px-3 py-1.5">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-neutral-400 font-medium">No doctors found matching criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}