"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { orderFormSchema, OrderFormValues } from "@/schemas/order.schema";
import { orderService } from "@/services/order.service";
import { testCatalogService } from "@/services/test-catalog.service";
import { panelService } from "@/services/panel.service";
import { departmentService } from "@/services/department.service";
import { Department } from "@/types/department.types";
import { PanelListItem } from "@/types/panel.types";
import { TestCatalogItem } from "@/types/test-catalog.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OrderFormProps {
  defaultVisitId?: string;
  onSuccess: () => void;
}

interface DepartmentOption {
  id: string;
  name: string;
}

interface PanelOption {
  id: string;
  name: string;
}

interface TestOption {
  id: string;
  name: string;
  price: number;
}

export default function OrderForm({ defaultVisitId = "", onSuccess }: OrderFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [panels, setPanels] = useState<PanelOption[]>([]);
  const [tests, setTests] = useState<TestOption[]>([]);

  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedPanelId, setSelectedPanelId] = useState("");
  const [selectedTestId, setSelectedTestId] = useState("");

  const [isLoadingDepts, setIsLoadingDepts] = useState(false);
  const [isLoadingPanels, setIsLoadingPanels] = useState(false);
  const [isLoadingTests, setIsLoadingTests] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema) as any,
    defaultValues: {
      panel_id: "",
      price: 0,
      status: "",
      test_id: "",
      visit_id: defaultVisitId,
    },
  });

  // Keep hidden visit_id synchronized
  useEffect(() => {
    if (defaultVisitId) {
      setValue("visit_id", defaultVisitId);
    }
  }, [defaultVisitId, setValue]);

  // Fetch departments matching TestCatalogPage implementation
  useEffect(() => {
    if (!isOpen) return;

    const fetchDepartments = async () => {
      setIsLoadingDepts(true);
      try {
        const departmentsResponse = await departmentService.getDepartments();
        const rawDepts = Array.isArray(departmentsResponse) 
          ? departmentsResponse 
          : (departmentsResponse as any)?.data || (departmentsResponse as any)?.departments || [];
        
        setDepartments(
          rawDepts.map((d: Department | any) => ({
            id: String(d.dept_id || d.id || ""),
            name: String(d.dept_name || d.name || ""),
          }))
        );
      } catch (error) {
        console.error("Error loading departments:", error);
        setDepartments([]);
      } finally {
        setIsLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, [isOpen]);

  // Fetch panels and test catalogs by department ID using testCatalogService.getCatalogByDeptId
  useEffect(() => {
    if (!selectedDeptId) {
      setPanels([]);
      setTests([]);
      setSelectedPanelId("");
      setSelectedTestId("");
      setValue("panel_id", "");
      setValue("test_id", "");
      return;
    }

    const fetchDataByDepartment = async () => {
      setIsLoadingPanels(true);
      setIsLoadingTests(true);
      setPanels([]);
      setTests([]);
      setSelectedPanelId("");
      setSelectedTestId("");
      setValue("panel_id", "");
      setValue("test_id", "");

      // Fetch Panels by Dept ID
      try {
        const panelsData = await panelService.getPanelsByDeptId(selectedDeptId);
        const rawPanels = Array.isArray(panelsData) ? panelsData : (panelsData as any)?.data || [];
        setPanels(
          rawPanels.map((p: PanelListItem | any) => ({
            id: String(p.panel_id || p.id || ""),
            name: String(p.panel_name || p.name || ""),
          }))
        );
      } catch (error) {
        console.error("Error loading panels for department:", error);
        setPanels([]);
      } finally {
        setIsLoadingPanels(false);
      }

      // Fetch Test Catalogs by Dept ID (matching TestCatalogPage pattern)
      try {
        const catalogResponse = await testCatalogService.getCatalogByDeptId(selectedDeptId);
        const rawCatalogs = Array.isArray(catalogResponse) ? catalogResponse : (catalogResponse as any)?.data || [];
        setTests(
          rawCatalogs.map((item: TestCatalogItem | any) => ({
            id: String(item.test_catalog_id || item.id || ""),
            name: String(item.test_name || item.name || ""),
            price: Number(item.test_price || item.price || 0),
          }))
        );
      } catch (error) {
        console.error("Error loading test catalog by department:", error);
        setTests([]);
      } finally {
        setIsLoadingTests(false);
      }
    };

    fetchDataByDepartment();
  }, [selectedDeptId, setValue]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedDeptId("");
    setSelectedPanelId("");
    setSelectedTestId("");
    setPanels([]);
    setTests([]);
    reset({
      panel_id: "",
      price: 0,
      status: "",
      test_id: "",
      visit_id: defaultVisitId,
    });
  };

  const onSubmit = async (values: OrderFormValues) => {
    setIsSubmitting(true);
    try {
      await orderService.createOrder({
        ...values,
        visit_id: defaultVisitId || values.visit_id,
      });
      toast.success("New order created successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages || error.response?.data?.message;
      const errorMsg = Array.isArray(serverMessages) 
        ? serverMessages.join(", ") 
        : typeof serverMessages === "string" 
        ? serverMessages 
        : "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
      <DialogTrigger className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium shadow-xs h-10 px-4 transition-colors cursor-pointer">
        <Plus className="h-4 w-4 mr-2" />
        Add Order
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Add New Order
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Enter the required information to create a new order in the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Hidden Visit ID Field */}
          <input type="hidden" {...register("visit_id")} />

          {/* Department Select */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Department</Label>
            <select
              value={selectedDeptId}
              disabled={isSubmitting || isLoadingDepts}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white outline-hidden cursor-pointer disabled:opacity-50"
            >
              <option value="">
                {isLoadingDepts ? "Loading departments..." : "Select a Department"}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Panel Select */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Test Panel</Label>
            <select
              {...register("panel_id")}
              value={selectedPanelId}
              disabled={isSubmitting || isLoadingPanels || !selectedDeptId}
              onChange={(e) => {
                setSelectedPanelId(e.target.value);
                setValue("panel_id", e.target.value);
              }}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white outline-hidden cursor-pointer disabled:opacity-50"
            >
              <option value="">
                {!selectedDeptId
                  ? "Select Department First"
                  : isLoadingPanels
                  ? "Loading panels..."
                  : "Select a Test Panel"}
              </option>
              {panels.map((panel) => (
                <option key={panel.id} value={panel.id}>
                  {panel.name}
                </option>
              ))}
            </select>
            {errors.panel_id && (
              <p className="text-[10px] text-red-500 font-medium">{errors.panel_id.message}</p>
            )}
          </div>

          {/* Test Catalog Select (Fetched by Department ID) */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Test Catalog</Label>
            <select
              {...register("test_id")}
              value={selectedTestId}
              disabled={isSubmitting || isLoadingTests || !selectedDeptId}
              onChange={(e) => {
                const testId = e.target.value;
                setSelectedTestId(testId);
                setValue("test_id", testId);
                
                // Automatically update price if test has catalog price
                const foundTest = tests.find((t) => t.id === testId);
                if (foundTest && foundTest.price) {
                  setValue("price", foundTest.price);
                }
              }}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white outline-hidden cursor-pointer disabled:opacity-50"
            >
              <option value="">
                {!selectedDeptId
                  ? "Select a Department First"
                  : isLoadingTests
                  ? "Loading tests..."
                  : "Select a Test Catalog"}
              </option>
              {tests.map((test) => (
                <option key={test.id} value={test.id}>
                  {test.name} {test.price ? `($${test.price.toFixed(2)})` : ""}
                </option>
              ))}
            </select>
            {errors.test_id && (
              <p className="text-[10px] text-red-500 font-medium">{errors.test_id.message}</p>
            )}
          </div>

          {/* Price & Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Price</Label>
              <Input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                disabled={isSubmitting}
                className="rounded-xl border-slate-200 text-xs h-10"
              />
              {errors.price && (
                <p className="text-[10px] text-red-500 font-medium">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Order Status</Label>
              <select
                {...register("status")}
                disabled={isSubmitting}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white outline-hidden cursor-pointer disabled:opacity-50"
              >
                <option value="">Select a Order Status</option>
                <option value="collected">Collected</option>
                <option value="result_entered">Result Entered</option>
                <option value="completed">Completed</option>
              </select>
              {errors.status && (
                <p className="text-[10px] text-red-500 font-medium">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl text-xs h-10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25"
            >
              {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}