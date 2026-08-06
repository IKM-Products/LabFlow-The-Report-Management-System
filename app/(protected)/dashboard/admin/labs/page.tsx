"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw, ShieldAlert, MapPin, Phone, Mail } from "lucide-react";
import { labService } from "@/services/lab.service";
import { LabListItem } from "@/types/lab.types";

import LabForm from "./_components/LabForm";
import EditLab from "./_components/EditLab";
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

export default function LabsPage() {
  const [labs, setLabs] = useState<LabListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLabRecords = async () => {
    setIsLoading(true);
    try {
      const data = await labService.getAllLabs();
      setLabs(data);
    } catch (error) {
      console.error("Critical error fetching laboratory database schema:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLabRecords();
  }, []);

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Laboratory Facilities
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage laboratory facilities and their information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLabRecords}
            disabled={isLoading}
            className="rounded-xl h-10 border-slate-200 text-slate-600"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <LabForm onSuccess={fetchLabRecords} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border rounded-2xl">
          Loading lab data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              List of all Laboratories.
            </TableCaption>
            <TableHeader>
              <tr className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-20 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">Lab Name</TableHead>
                <TableHead className="font-bold text-slate-600">Contact Information</TableHead>
                <TableHead className="font-bold text-slate-600">Official Registration No.</TableHead>
                <TableHead className="font-bold text-slate-600">Footer Settings</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {labs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">No laboratory branches registered yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                labs.map((lab, idx) => (
                  <TableRow key={lab.id} className="hover:bg-slate-50/60 transition-colors group">
                    <TableCell className="font-mono text-xs text-slate-400">{idx + 1}</TableCell>
                    
                    <TableCell className="space-y-0.5">
                      <div className="font-semibold text-slate-900">{lab.lab_name}</div>
                      <div className="text-[11px] text-slate-400 italic">"{lab.tagline || "No slogan"}"</div>
                    </TableCell>

                    <TableCell className="text-xs text-slate-600 space-y-1 py-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{lab.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="h-3 w-3 text-slate-400" />
                        <span>{lab.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{lab.phone}</span>
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-xs font-semibold text-slate-700">
                      {lab.registration_no}
                    </TableCell>

                    <TableCell className="text-xs text-slate-500 max-w-xs truncate">
                      {lab.report_footer || "—"}
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap">
                      <EditLab lab={lab} onSuccess={fetchLabRecords} />
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