"use client";

import React, { useState, useEffect } from "react";
import { 
  Layers, 
  AlertCircle,
  ShieldAlert,
  RefreshCw,
  Building2
} from "lucide-react";

import { panelService } from "@/services/panel.service";
import { departmentService } from "@/services/department.service";
import { PanelListItem } from "@/types/panel.types";
import { Department } from "@/types/department.types";

import PanelForm from "./_components/PanelForm";
import EditPanel from "./_components/EditPanel";
import PanelComponentForm from "./_components/PanelComponentForm";

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

export default function PanelsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);
  
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [activeDeptId, setActiveDeptId] = useState("");
  const [panels, setPanels] = useState<PanelListItem[]>([]);
  const [loadingPanels, setLoadingPanels] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Catalog modal state management
  const [selectedPanelForCatalog, setSelectedPanelForCatalog] = useState<PanelListItem | null>(null);

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
      } finally {
        setLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, []);

  const fetchPanels = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoadingPanels(true);
    setErrorMsg(null);
    try {
      const response = await panelService.getPanelsByDeptId(idToFetch.trim());
      if (Array.isArray(response)) {
        setPanels(response);
        setActiveDeptId(idToFetch.trim());
      } else {
        setPanels([]);
        setErrorMsg("Unexpected panel response format.");
      }
    } catch (err: any) {
      setPanels([]);
      setErrorMsg(Array.isArray(err) ? err.join(", ") : err.toString());
    } finally {
      setLoadingPanels(false);
    }
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setSelectedDeptId(deptId);
    if (deptId) {
      fetchPanels(deptId);
    } else {
      setPanels([]);
      setActiveDeptId("");
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Laboratory Test Panels
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage laboratory test panels by department.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => activeDeptId && fetchPanels(activeDeptId)}
            disabled={loadingPanels || !activeDeptId}
            className="rounded-xl h-10 border-slate-200 text-slate-600"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingPanels ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <PanelForm
            defaultDeptId={activeDeptId}
            onSuccess={() => activeDeptId && fetchPanels(activeDeptId)}
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

      {/* Loading or Panels Data Table View */}
      {loadingPanels ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border rounded-2xl">
          Loading lab panel data...
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              {activeDeptName 
                ? `List of all Test Panels for ${activeDeptName}.` 
                : "Select a department above to view test panels."}
            </TableCaption>
            <TableHeader>
              <tr className="bg-slate-50 border-b border-slate-200">
                <TableHead className="w-20 font-bold text-slate-600">S.N.</TableHead>
                <TableHead className="font-bold text-slate-600">Test Panel Code</TableHead>
                <TableHead className="font-bold text-slate-600">Test Panel Name</TableHead>
                <TableHead className="font-bold text-slate-600">Price</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {panels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">
                        {activeDeptName 
                          ? `No test panels found for department "${activeDeptName}"` 
                          : "Select a department above to view test panels."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                panels.map((panel, idx) => (
                  <TableRow key={panel.panel_id} className="hover:bg-slate-50/60 transition-colors group">
                    <TableCell className="font-mono text-xs text-slate-400">{idx + 1}</TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 bg-emerald-50 text-slate-600 rounded-md text-[11px] font-medium">
                        {panel.panel_code}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{panel.panel_name}</TableCell>
                    <TableCell className="font-semibold text-emerald-600">${panel.panel_price.toFixed(2)}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPanelForCatalog(panel)}
                          className="px-3 h-8 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                        >
                          <Layers className="w-3.5 h-3.5 mr-1" />
                          Panel Component
                        </Button>
                        <EditPanel
                          panel={panel}
                          onSuccess={() => activeDeptId && fetchPanels(activeDeptId)}
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

      {/* Catalog Component Modal */}
      {selectedPanelForCatalog && (
        <PanelComponentForm
          panelId={selectedPanelForCatalog.panel_id}
          panelName={selectedPanelForCatalog.panel_name}
          onClose={() => setSelectedPanelForCatalog(null)}
        />
      )}
    </div>
  );
}