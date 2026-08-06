"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw, ShieldAlert } from "lucide-react";
import { doctorService } from "@/services/doctor.service";
import { DoctorListItem } from "@/types/doctor.types";

import DoctorForm from "./_components/DoctorForm";
import EditDoctor from "./_components/EditDoctor";
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

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDoctorRecords = async () => {
    setIsLoading(true);
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
    } catch (error) {
      console.error("Critical error reading clinician entities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorRecords();
  }, []);

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Laboratory Doctors
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage laboratory doctors and their information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDoctorRecords}
            disabled={isLoading}
            className="rounded-xl h-10 border-slate-200 text-slate-600"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <DoctorForm onSuccess={fetchDoctorRecords} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border rounded-2xl">
          Loading doctor's data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              List of all Doctors.
            </TableCaption>
            <TableHeader>
              <tr className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-15 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">Doctor Name</TableHead>
                <TableHead className="font-bold text-slate-600">Contact Information</TableHead>
                <TableHead className="font-bold text-slate-600">NMC Registration No.</TableHead>
                <TableHead className="font-bold text-slate-600">Qualifications</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {doctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">No medical doctors cataloged yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                doctors.map((doc, idx) => (
                  <TableRow key={doc.id} className="hover:bg-slate-50/60 transition-colors group">
                    <TableCell className="font-mono text-xs text-slate-400">{idx + 1}</TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {`Dr. ${doc.first_name} ${doc.last_name}`}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 space-y-0.5">
                      <div className="font-medium">{doc.email}</div>
                      <div className="text-slate-400">{doc.phone}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-medium text-slate-700">{doc.registration_no}</TableCell>
                    <TableCell>
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 border rounded-md px-2 py-0.5 inline-block">
                        {doc.qualification}
                      </span>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <EditDoctor doctor={doc} onSuccess={fetchDoctorRecords} />
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