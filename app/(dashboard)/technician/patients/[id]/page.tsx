"use client";

import React from "react";
import { useParams } from "next/navigation";
import { 
  User, 
  Calendar, 
  FileText, 
  FlaskConical, 
  ArrowLeft,
  ChevronRight,
  Phone,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock Data structure based on patients and visits tables
const PATIENT_DATA = {
  id: "1",
  name: "John Doe",
  age: 45,
  gender: "Male",
  phone: "9800000000",
  address: "Kathmandu, Nepal",
  visits: [
    { id: 101, date: "2026-07-08", tests: ["Complete Blood Count", "Lipid Profile"], status: "Completed" },
    { id: 102, date: "2026-06-15", tests: ["Fasting Blood Sugar"], status: "Completed" },
  ]
};

export default function PatientDetailPage() {
  const params = useParams();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-serif">{PATIENT_DATA.name}</h1>
          <p className="text-sm text-neutral-500">Patient ID: {params.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Sidebar */}
        <Card className="rounded-2xl shadow-xs border-neutral-200">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-neutral-400">Demographics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3"><User className="h-4 w-4 text-emerald-600" /> {PATIENT_DATA.age} Years, {PATIENT_DATA.gender}</div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-emerald-600" /> {PATIENT_DATA.phone}</div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-emerald-600" /> {PATIENT_DATA.address}</div>
          </CardContent>
        </Card>

        {/* Visit History Table */}
        <Card className="col-span-2 rounded-2xl shadow-xs border-neutral-200">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase text-neutral-400">Visit History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PATIENT_DATA.visits.map((visit) => (
                <div key={visit.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg border border-neutral-200">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">{visit.date}</p>
                      <p className="text-xs text-neutral-500">{visit.tests.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{visit.status}</Badge>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for future Reports grid */}
      <div className="bg-neutral-100 border border-neutral-200 p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-neutral-500" />
          <span className="font-semibold text-neutral-700">Medical Reports Archive</span>
        </div>
        <Button variant="outline" className="rounded-xl">View All Reports</Button>
      </div>
    </div>
  );
}