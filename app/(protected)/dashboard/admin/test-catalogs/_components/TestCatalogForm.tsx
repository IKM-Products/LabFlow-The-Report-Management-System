"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { TestCatalogSchema, TestCatalogFormData } from "@/schemas/test-catalog.schema";
import { testCatalogService } from "@/services/test-catalog.service";
import { departmentService } from "@/services/department.service";
import { Department } from "@/types/department.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TestCatalogFormProps {
  defaultDeptId?: string;
  onSuccess: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function TestCatalogForm({
  defaultDeptId = "",
  onSuccess,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: TestCatalogFormProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<TestCatalogFormData>({
    resolver: zodResolver(TestCatalogSchema) as Resolver<TestCatalogFormData, any>,
    defaultValues: {
      dept_id: defaultDeptId,
      test_code: "",
      sample_type: "",
      test_name: "",
      test_price: 0,
      turnaround_time: 0,
    },
  });

  // Fetch departments list for the dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepts(true);
      try {
        const response = await departmentService.getDepartments();
        if (Array.isArray(response)) {
          setDepartments(response);
        }
      } catch (err: any) {
        console.error("Failed to load departments:", err);
      } finally {
        setLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (defaultDeptId) {
      setValue("dept_id", defaultDeptId);
    }
  }, [defaultDeptId, setValue]);

  const handleClose = () => {
    if (isControlled && externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
    reset();
  };

  const onSubmit = async (values: TestCatalogFormData) => {
    setIsSubmitting(true);
    try {
      const { id, ...payload } = values;

      await testCatalogService.createCatalog(
        payload as Parameters<typeof testCatalogService.createCatalog>[0]
      );
      toast.success("New test catalog record created successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages || error.message;
      const errorMsg = Array.isArray(serverMessages)
        ? serverMessages.join(", ")
        : typeof serverMessages === "string"
        ? serverMessages
        : "Failed to create test catalog record.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isControlled && (
        <button
          type="button"
          onClick={() => setInternalIsOpen(true)}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm h-10 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Test Catalog
        </button>
      )}

      <Dialog
        open={isOpen}
        onOpenChange={(open) => (!open ? handleClose() : setInternalIsOpen(true))}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Add New Test Catalog
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enter the required information to create a new test catalog in the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Department</Label>
              <Controller
                name="dept_id"
                control={control}
                render={({ field }) => {
                  const selectedDept = departments.find(
                    (d) => String(d.dept_id) === String(field.value)
                  );

                  return (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ? String(field.value) : ""}
                      disabled={isSubmitting || loadingDepts}
                    >
                      <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 text-xs bg-white">
                        <SelectValue
                          placeholder={
                            loadingDepts ? "Loading..." : "Select Department"
                          }
                        >
                          {selectedDept ? selectedDept.dept_name : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem
                            key={dept.dept_id}
                            value={String(dept.dept_id)}
                          >
                            {dept.dept_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.dept_id && (
                <p className="text-[10px] text-red-500 font-medium">
                  {errors.dept_id.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Test Code</Label>
                <Input
                  {...register("test_code")}
                  placeholder="e.g. GLU-01"
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200"
                />
                {errors.test_code && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.test_code.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Sample Type</Label>
                <Input
                  {...register("sample_type")}
                  placeholder="e.g. Serum / Plasma"
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200"
                />
                {errors.sample_type && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.sample_type.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Test Name</Label>
              <Input
                {...register("test_name")}
                placeholder="e.g. Fasting Blood Glucose"
                disabled={isSubmitting}
                className="rounded-xl border-slate-200"
              />
              {errors.test_name && (
                <p className="text-[10px] text-red-500 font-medium">
                  {errors.test_name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("test_price", { valueAsNumber: true })}
                  placeholder="0.00"
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200"
                />
                {errors.test_price && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.test_price.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">
                  Turnaround Time (hrs)
                </Label>
                <Input
                  type="number"
                  {...register("turnaround_time", { valueAsNumber: true })}
                  placeholder="24"
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200"
                />
                {errors.turnaround_time && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.turnaround_time.message}
                  </p>
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
                {isSubmitting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}