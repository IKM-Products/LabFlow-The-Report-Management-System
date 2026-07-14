"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  User, 
  Calendar, 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Activity, 
  ShieldAlert 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Normalized dataset matching the registered API and form constraints
const MOCK_PATIENTS_DATABASE: Record<string, {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  address: string;
  lastVisit: string;
  bloodGroup: string;
  allergies: string[];
  history: Array<{ date: string; diagnostic: string; status: string }>;
}> = {
  "1": { 
    name: "John Doe", 
    age: 45, 
    gender: "male", 
    phone: "9800000000", 
    address: "Kathmandu, Nepal", 
    lastVisit: "2026-07-08",
    bloodGroup: "A+",
    allergies: ["Penicillin"],
    history: [
      { date: "2026-07-08", diagnostic: "Complete Blood Count (CBC)", status: "Completed" },
      { date: "2026-05-12", diagnostic: "Lipid Profile Panel", status: "Completed" }
    ]
  },
  "2": { 
    name: "Jane Smith", 
    age: 32, 
    gender: "female", 
    phone: "9811111111", 
    address: "Lalitpur, Nepal", 
    lastVisit: "2026-07-11",
    bloodGroup: "O-",
    allergies: ["None"],
    history: [
      { date: "2026-07-11", diagnostic: "Thyroid Stimulating Hormone (TSH)", status: "Pending" }
    ]
  }
};

export default function PatientDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  
  const patient = id ? MOCK_PATIENTS_DATABASE[id] : null;

  if (!patient) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center space-y-4 font-sans py-20">
        <ShieldAlert className="h-10 w-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-900">Patient File Not Found</h2>
        <p className="text-sm text-neutral-500">The patient matrix mapping reference ID matches no active profiles.</p>
        <Link href="/technician/patients" className="inline-block mt-2">
          <Button variant="outline" className="rounded-xl gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" /> Return to Master Feed
          </Button>
        </Link>
      </div>
    );
  }

  // Capitalize normalized enum values for display helper
  const displayGender = patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Return Navigation Anchor */}
      <div>
        <Link href="/technician/patients" className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-emerald-700 uppercase tracking-wider transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Patient List
        </Link>
      </div>

      {/* Profile Identity Card Summary Banner */}
      <div className="bg-white border border-neutral-200 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <User className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif text-neutral-900 tracking-tight">{patient.name}</h1>
              <Badge className="bg-neutral-100 text-neutral-700 hover:bg-neutral-100 font-bold border-none text-[10px] px-2 py-0.5 rounded-md">
                ID: {id}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-neutral-500 mt-0.5">
              {patient.age} Years Old <span className="text-neutral-300 mx-1.5">•</span> {displayGender}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
          <Badge variant="outline" className="border-neutral-200 font-bold text-xs px-3 py-1 rounded-xl bg-neutral-50/50">
            Blood Type: {patient.bloodGroup}
          </Badge>
          {patient.allergies[0] !== "None" ? (
            <Badge className="bg-rose-500/10 hover:bg-rose-500/10 text-rose-700 border border-rose-500/20 font-bold text-xs px-3 py-1 rounded-xl">
              Allergy: {patient.allergies.join(", ")}
            </Badge>
          ) : (
            <Badge className="bg-neutral-100 text-neutral-500 hover:bg-neutral-100 text-xs px-3 py-1 rounded-xl">
              No Known Allergies
            </Badge>
          )}
        </div>
      </div>

      {/* Meta Grid Breakouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Vital Info Blocks */}
        <div className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" /> Contact Channels
          </h3>
          <div className="space-y-1">
            <span className="text-xs font-medium text-neutral-400 block">Mobile Phone Number</span>
            <span className="text-sm font-bold text-neutral-800">{patient.phone}</span>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-medium text-neutral-400 block">Residential Address</span>
            <span className="text-sm font-bold text-neutral-700 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              {patient.address}
            </span>
          </div>
        </div>

        {/* Lab Diagnostics Feed Summary Column */}
        <div className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-4 md:col-span-2">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-3.5 w-3.5" /> Laboratory Interaction Log
          </h3>
          
          <div className="divide-y divide-neutral-100">
            {patient.history.map((log, index) => (
              <div key={index} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="space-y-0.5">
                  <span className="font-bold text-sm text-neutral-800 block">{log.diagnostic}</span>
                  <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Check-in Date: {log.date}
                  </span>
                </div>
                
                <Badge className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md border ${
                  log.status === "Completed" 
                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/10" 
                    : "bg-amber-500/10 text-amber-700 border-amber-500/20 hover:bg-amber-500/10"
                }`}>
                  {log.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}