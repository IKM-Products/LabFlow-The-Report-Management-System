"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw, ShieldAlert } from "lucide-react";
import { departmentService } from "@/services/department.service";
import { Department } from "@/types/department.types";

import DepartmentForm from "./_components/DepartmentForm";
import EditDepartment from "./_components/EditDepartment";
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

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDepartmentRecords = async () => {
    setIsLoading(true);
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (error: any) {
      console.error("--- API Error Breakdown ---");
      console.error("Text Message:", String(error));
      console.error("Inspectable Object:", error);
      
      if (error?.response) {
        console.error("Backend Status Code:", error.response.status);
        console.error("Backend Error Payload:", error.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentRecords();
  }, []);

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Laboratory Departments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage laboratory departments and their information.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDepartmentRecords}
            disabled={isLoading}
            className="rounded-xl h-10 border-slate-200 text-slate-600"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <DepartmentForm onSuccess={fetchDepartmentRecords} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border rounded-2xl">
          Loading department data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              List of all Departments.
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-20 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">Department Name</TableHead>
                <TableHead className="font-bold text-slate-600">Department Description</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">No departments have been added yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((dept, idx) => (
                  <TableRow key={dept.dept_id} className="hover:bg-slate-50/60 transition-colors group">
                    <TableCell className="font-mono text-xs text-slate-400">{idx + 1}</TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {dept.dept_name}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 max-w-sm truncate">
                      {dept.dept_description || "—"}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <EditDepartment department={dept} onSuccess={fetchDepartmentRecords} />
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