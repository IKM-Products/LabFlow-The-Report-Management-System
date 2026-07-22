"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { TestCatalogSchema, TestCatalogFormData } from "@/schemas/test-catalog.schema";
import { testCatalogService } from "@/services/test-catalog.service";
import { departmentService } from "@/services/department.service";
import { Department } from "@/types/department.types";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditTestCatalogProps {
  item: TestCatalogItem;
  onSuccess: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function EditTestCatalog({
  item,
  onSuccess,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: EditTestCatalogProps) {
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
    control,
    formState: { errors },
  } = useForm<TestCatalogFormData>({
    resolver: zodResolver(TestCatalogSchema) as Resolver<TestCatalogFormData, any>,
    defaultValues: {
      id: item.test_catalog_id,
      dept_id: item.dept_id,
      sample_type: item.sample_type,
      test_code: item.test_code,
      test_name: item.test_name,
      test_price: item.test_price,
      turnaround_time: item.turnaround_time,
    },
  });

  // Keep form values in sync when item prop or modal state changes
  useEffect(() => {
    if (isOpen && item) {
      reset({
        id: item.test_catalog_id,
        dept_id: item.dept_id,
        sample_type: item.sample_type,
        test_code: item.test_code,
        test_name: item.test_name,
        test_price: item.test_price,
        turnaround_time: item.turnaround_time,
      });
    }
  }, [isOpen, item, reset]);

  // Fetch departments list for the dropdown selector
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
      const payload = {
        ...values,
        id: values.id || item.test_catalog_id,
      };

      await testCatalogService.updateCatalog(payload);
      toast.success("Test catalog updated successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
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
    <>
      {!isControlled && (
        <button
          type="button"
          onClick={() => setInternalIsOpen(true)}
          className="inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 h-8 px-2 border border-transparent hover:border-emerald-100 transition-colors cursor-pointer"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
      )}

      <Dialog
        open={isOpen}
        onOpenChange={(open) => (!open ? handleClose() : setInternalIsOpen(true))}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Edit Test Catalog
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update the test catalog information in the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Test Code</Label>
                <Input
                  {...register("test_code")}
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
                <Label className="text-xs font-semibold text-slate-700">Department</Label>
                <Controller
                  name="dept_id"
                  control={control}
                  render={({ field }) => (
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
                        />
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
                  )}
                />
                {errors.dept_id && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.dept_id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Test Name</Label>
                <Input
                  {...register("test_name")}
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200"
                />
                {errors.test_name && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.test_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Sample Type</Label>
                <Input
                  {...register("sample_type")}
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("test_price", { valueAsNumber: true })}
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
                <Label className="text-xs font-semibold text-slate-700">TAT (Hours)</Label>
                <Input
                  type="number"
                  {...register("turnaround_time", { valueAsNumber: true })}
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
                  "Update Catalog"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}