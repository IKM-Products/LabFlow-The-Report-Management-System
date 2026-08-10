"use client";

import React, { useState, useEffect } from "react";
import { 
  AlertCircle,
  ShieldAlert,
  RefreshCw,
  Building2,
  BookOpen
} from "lucide-react";

import { testParameterService } from "@/services/test-parameter.service";
import { departmentService } from "@/services/department.service";
import { testCatalogService } from "@/services/test-catalog.service";
import { TestParameterItem } from "@/types/test-parameter.types";
import { Department } from "@/types/department.types";
import { TestCatalogItem } from "@/types/test-catalog.types";

import TestParameterForm from "./_components/TestParameterForm";
import EditTestParameter from "./_components/EditTestParameter";

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

export default function TestParametersPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState("");

  const [testCatalogs, setTestCatalogs] = useState<TestCatalogItem[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [activeTestId, setActiveTestId] = useState("");

  const [parameters, setParameters] = useState<TestParameterItem[]>([]);
  const [loadingParams, setLoadingParams] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active names helpers
  const activeDeptName = departments.find((d) => d.dept_id === selectedDeptId)?.dept_name;
  const activeTestName = testCatalogs.find(
    (t) => t.test_catalog_id === activeTestId
  )?.test_name;

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
      } finally {
        setLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch test catalogs when department changes
  const handleDepartmentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setSelectedDeptId(deptId);
    setSelectedTestId("");
    setActiveTestId("");
    setParameters([]);
    setTestCatalogs([]);

    if (deptId) {
      setLoadingCatalogs(true);
      try {
        const res = await testCatalogService.getCatalogByDeptId(deptId);
        if (Array.isArray(res)) {
          setTestCatalogs(res);
        } else {
          setTestCatalogs([]);
        }
      } catch (err) {
        console.error("Failed to load test catalogs:", err);
        setTestCatalogs([]);
      } finally {
        setLoadingCatalogs(false);
      }
    }
  };

  // Fetch parameters for selected test catalog
  const fetchParameters = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoadingParams(true);
    setErrorMsg(null);
    try {
      const res = await testParameterService.getParametersByTestId(idToFetch.trim());
      const data = res?.data || (Array.isArray(res) ? res : []);
      setParameters(data);
      setActiveTestId(idToFetch.trim());
    } catch (err: any) {
      setParameters([]);
      setErrorMsg(Array.isArray(err) ? err.join(", ") : err.toString());
    } finally {
      setLoadingParams(false);
    }
  };

  const handleTestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tId = e.target.value;
    setSelectedTestId(tId);
    if (tId) {
      fetchParameters(tId);
    } else {
      setParameters([]);
      setActiveTestId("");
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Laboratory Test Parameters
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage laboratory test parameters by test catalog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => activeTestId && fetchParameters(activeTestId)}
            disabled={loadingParams || !activeTestId}
            className="rounded-xl h-10 border-slate-200 text-slate-600"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingParams ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <TestParameterForm
            defaultTestId={activeTestId}
            nextSequenceNo={parameters.length + 1}
            onSuccess={() => activeTestId && fetchParameters(activeTestId)}
            disabled={!activeTestId}
          />
        </div>
      </div>

      {/* Department & Test Catalog Selection Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Department Dropdown */}
        <div className="relative">
          <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
          <select
            value={selectedDeptId}
            onChange={handleDepartmentChange}
            disabled={loadingDepts}
            className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
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

        {/* Test Catalog Dropdown */}
        <div className="relative">
          <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
          <select
            value={selectedTestId}
            onChange={handleTestChange}
            disabled={loadingCatalogs || !selectedDeptId}
            className="w-full h-10 pl-10 pr-8 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer"
          >
            <option value="">
              {loadingCatalogs
                ? "Loading test catalogs..."
                : !selectedDeptId
                ? "Select a Department First"
                : testCatalogs.length === 0
                ? "No test catalogs in this department"
                : "Select a Test Catalog"}
            </option>
            {testCatalogs.map((test) => (
              <option key={test.test_catalog_id} value={test.test_catalog_id}>
                {test.test_name} {test.test_code ? `(${test.test_code})` : ""}
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

      {/* Loading or Parameters Data Table View */}
      {loadingParams ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border rounded-2xl">
          Loading test parameter data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              {activeTestName 
                ? `List of all Test Parameters for ${activeTestName}.` 
                : "Select a department and test catalog above to view test parameters."}
            </TableCaption>
            <TableHeader>
              <tr className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-20 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">Test Parameter Name</TableHead>
                <TableHead className="font-bold text-slate-600">Result Type</TableHead>
                <TableHead className="font-bold text-slate-600">Unit</TableHead>
                <TableHead className="w-20 text-right font-bold text-slate-600">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {parameters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        {activeTestName 
                          ? `No test parameters found for catalog "${activeTestName}"` 
                          : "Select a department and test catalog above to view test parameters."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                parameters.map((item, idx) => (
                  <TableRow key={item.parameter_id} className="hover:bg-slate-50/60 transition-colors group">
                    <TableCell className="font-mono text-xs text-slate-400">
                      {item.sequence_no ?? idx + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{item.parameter_name}</TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 bg-emerald-50 text-slate-600 rounded-md text-[11px] font-medium">
                        {item.result_type}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-600">{item.unit || "—"}</TableCell>
                    <TableCell className="text-right">
                      <EditTestParameter
                        item={item}
                        onSuccess={() => activeTestId && fetchParameters(activeTestId)}
                      />
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