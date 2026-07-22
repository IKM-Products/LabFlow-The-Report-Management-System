"use client";

import React, { useState, useEffect } from "react";
import { 
  FlaskConical, 
  AlertCircle,
  ShieldAlert,
  RefreshCw,
  Building2,
  Clock
} from "lucide-react";

import { testCatalogService } from "@/services/test-catalog.service";
import { departmentService } from "@/services/department.service";
import { TestCatalogItem } from "@/types/test-catalog.types";
import { Department } from "@/types/department.types";

import TestCatalogForm from "./_components/TestCatalogForm";
import EditTestCatalog from "./_components/EditTestCatalog";

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

export default function TestCatalogPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [activeDeptId, setActiveDeptId] = useState("");
  const [catalogs, setCatalogs] = useState<TestCatalogItem[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active department name helper
  const activeDeptName = departments.find((d) => d.dept_id === activeDeptId)?.dept_name;

  // Fetch departments list on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepts(true);
      try {
        const departmentsResponse = await departmentService.getDepartments();
        if (Array.isArray(departmentsResponse)) {
          setDepartments(departmentsResponse);
        }
      } catch (err: any) {
        console.error("Failed to load departments:", err);
      } finally{
        setLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, []);

  const fetchCatalogs = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoadingCatalogs(true);
    setErrorMsg(null);
    try {
      const response = await testCatalogService.getCatalogByDeptId(idToFetch.trim());
      if (Array.isArray(response)) {
        setCatalogs(response);
        setActiveDeptId(idToFetch.trim());
      } else {
        setCatalogs([]);
        setErrorMsg("Unexpected catalog response format.");
      }
    } catch (err: any) {
      setCatalogs([]);
      const message = err?.response?.data?.messages || err?.message || err?.toString();
      setErrorMsg(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setLoadingCatalogs(false);
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setSelectedDeptId(deptId);
    if (deptId) {
      fetchCatalogs(deptId);
    } else {
      setCatalogs([]);
      setActiveDeptId("");
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FlaskConical className="h-7 w-7 text-emerald-600" />
            Laboratory Test Catalogs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage diagnostic laboratory test catalogs organized by department.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => activeDeptId && fetchCatalogs(activeDeptId)}
            disabled={loadingCatalogs || !activeDeptId}
            className="rounded-xl h-10 border-slate-200 text-slate-600"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingCatalogs ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <TestCatalogForm
            defaultDeptId={activeDeptId}
            onSuccess={() => activeDeptId && fetchCatalogs(activeDeptId)}
          />
        </div>
      </div>

      {/* Department Dropdown Selection */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
        <div className="relative flex-1">
          <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
          <select
            value={selectedDeptId}
            onChange={handleDepartmentChange}
            disabled={loadingDepts}
            className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 cursor-pointer disabled:bg-slate-50"
          >
            <option value="">
              {loadingDepts ? "Loading departments..." : "Select a Department"}
            </option>
            {departments.map((dept) => (
              <option key={dept.dept_id} value={dept.dept_id}>
                {dept.dept_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error View */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading or Test Catalogs Data Table View */}
      {loadingCatalogs ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border rounded-2xl">
          Loading test catalog data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              {activeDeptName 
                ? `Showing test catalog records for ${activeDeptName}.` 
                : "Select a department from the dropdown above to view records."}
            </TableCaption>
            <TableHeader>
              <tr className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-20 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">Code</TableHead>
                <TableHead className="font-bold text-slate-600">Test Name</TableHead>
                <TableHead className="font-bold text-slate-600">Sample Type</TableHead>
                <TableHead className="font-bold text-slate-600">Price</TableHead>
                <TableHead className="font-bold text-slate-600">Turnaround Time</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {catalogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        {activeDeptName 
                          ? `No test catalog items found for department "${activeDeptName}"` 
                          : "Select a department above to view test catalog records."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                catalogs.map((item, idx) => (
                  <TableRow key={item.test_catalog_id} className="hover:bg-slate-50/60 transition-colors group">
                    <TableCell className="font-mono text-xs text-slate-400">{idx + 1}</TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-mono text-[10px] font-semibold">
                        {item.test_code}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{item.test_name}</TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium">
                        {item.sample_type}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-600">${item.test_price.toFixed(2)}</TableCell>
                    <TableCell className="text-slate-500">
                      <span className="flex items-center gap-1 text-xs">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {item.turnaround_time} hrs
                      </span>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <EditTestCatalog
                          item={item}
                          onSuccess={() => activeDeptId && fetchCatalogs(activeDeptId)}
                        />
                      </div>
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