// app/(dashboard)/technician/patients/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw, ShieldAlert, Mail, Phone, MapPin } from "lucide-react";
import { patientService } from "@/services/patient.service";
import { Patient } from "@/types/patient.types";

import PatientForm from "./_components/PatientForm";
import EditPatient from "./_components/EditPatient";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      console.error("Critical error reading patient profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Clinical Patients
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage clinical patients and their information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPatients}
            disabled={isLoading}
            className="rounded-xl h-10 border-slate-200 text-slate-600 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <PatientForm onSuccess={fetchPatients} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border rounded-2xl">
          Loading patients data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              List of all Patients.
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="font-bold text-slate-600">MRN</TableHead>
                <TableHead className="font-bold text-slate-600">Patient Name</TableHead>
                <TableHead className="font-bold text-slate-600">Gender / DOB</TableHead>
                <TableHead className="font-bold text-slate-600">Contact Information</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        No active medical profiles located inside registries.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient, idx) => (
                  <TableRow key={patient.id} className="hover:bg-slate-50/60 transition-colors group">
                    <TableCell className="font-mono text-xs font-bold text-slate-900">
                      {patient.mrn}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {`${patient.first_name} ${patient.last_name}`}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 bg-emerald-50 text-slate-600 rounded-md text-[11px] font-medium">
                          {patient.gender}
                        </span>
                        /
                        <span className="text-xs text-slate-500 font-mono">{patient.dob}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{patient.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{patient.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-slate-600" />
                        <span>{patient.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <EditPatient patient={patient} onSuccess={fetchPatients} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}