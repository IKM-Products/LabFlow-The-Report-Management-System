"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  User, 
  Search, 
  ChevronRight, 
  Calendar,
  Layers,
  Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RegisterPatientDialog } from "@/features/patients/components/register-patient-dialog";

// Normalized matching format from the master schemas
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  address: string;
  lastVisit: string;
  pendingTests: number;
}

const INITIAL_MOCK_PATIENTS: Patient[] = [
  { id: "1", name: "John Doe", age: 45, gender: "male", phone: "9800000000", address: "Kathmandu, Nepal", lastVisit: "2026-07-08", pendingTests: 2 },
  { id: "2", name: "Jane Smith", age: 32, gender: "female", phone: "9811111111", address: "Lalitpur, Nepal", lastVisit: "2026-07-11", pendingTests: 0 },
  { id: "3", name: "Ram Bahadur", age: 60, gender: "male", phone: "9841234567", address: "Bhaktapur, Nepal", lastVisit: "2026-07-13", pendingTests: 1 }
];

export default function PatientsListPage() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_MOCK_PATIENTS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.includes(searchQuery) ||
    patient.phone.includes(searchQuery)
  );

  // Success handler to dynamically pull updated data matrices 
  const handleRefresh = () => {
    // In actual production, re-fetch state from the server database:
    // e.g., api.get("/patients").then(res => setPatients(res.data))
    console.log("Patient directory synchronized successfully.");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 font-sans">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-neutral-100">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-neutral-900">Registered Patients</h1>
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mt-1">
            Access diagnostic records and ongoing laboratory check-in profiles
          </p>
        </div>
        
        {/* Swapped standard button for the fully operational interactive Dialog */}
        <RegisterPatientDialog onSuccess={handleRefresh} />
      </div>

      {/* Control Utility Search Bar */}
      <div className="flex gap-3 items-center bg-neutral-50 p-3 rounded-2xl border border-neutral-200/50">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search by name, patient ID, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 bg-white border-neutral-200 focus:border-blue-500 focus-visible:ring-0 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Patients Feed Output Stack */}
      <div className="space-y-3">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => {
            const formattedGender = patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1);
            
            return (
              <Link 
                key={patient.id}
                href={`/technician/patients/${patient.id}`}
                className="flex items-center justify-between p-5 bg-white border border-neutral-200/70 rounded-2xl shadow-xs hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-950/2 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-neutral-900 group-hover:text-blue-800 transition-colors">
                        {patient.name}
                      </h3>
                      {patient.pendingTests > 0 && (
                        <Badge className="bg-amber-500/10 hover:bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[10px] font-bold px-1.5 py-0 rounded-md flex items-center gap-1">
                          <Activity className="h-2.5 w-2.5 animate-pulse" />
                          {patient.pendingTests} Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400 font-medium mt-1">
                      <span>ID: {patient.id}</span>
                      <span>•</span>
                      <span>{patient.age} Yrs / {formattedGender}</span>
                      <span>•</span>
                      <span>{patient.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden sm:block space-y-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Last Interaction</span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 justify-end">
                      <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{patient.lastVisit}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-neutral-200 text-center py-16 text-neutral-400 font-medium space-y-2">
            <Layers className="h-8 w-8 mx-auto text-neutral-300" />
            <p className="text-sm">No matched diagnostic processing profiles found.</p>
          </div>
        )}
      </div>
    </div>
  );
}