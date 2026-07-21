// app/(dashboard)/technician/patients/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Users } from "lucide-react";

import { patientService } from "@/services/patient.service";
import { Patient } from "@/types/patient.types";

import PatientForm from "./_components/PatientForm";
import EditPatient from "./_components/EditPatient";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await patientService.getPatients();
      if (response.success) {
        setPatients(response.data);
      }
    } catch (error) {
      console.error("Critical extraction failure handling analytical indexing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Demographics Indexing
          </h1>
          <p className="text-xs text-slate-500">
            System indexing validation pipelines for active laboratory patients.
          </p>
        </div>
        <PatientForm onSuccess={fetchPatients} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-3">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Extracting metadata indices...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center p-16 text-slate-400 text-xs font-medium">
            No active medical profiles located inside verification registries.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-4">MRN</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Gender / DOB</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Residence Location</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">{patient.mrn}</td>
                    <td className="p-4 font-medium text-slate-900">
                      {patient.first_name} {patient.last_name}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 mr-2">
                        {patient.gender}
                      </span>
                      <span className="text-slate-500 font-mono">{patient.dob}</span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div>{patient.email}</div>
                      <div className="text-slate-400 text-[11px] font-mono">{patient.phone}</div>
                    </td>
                    <td className="p-4 text-slate-500 max-w-xs truncate">{patient.address}</td>
                    <td className="p-4 text-right">
                      <EditPatient patient={patient} onSuccess={fetchPatients} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}