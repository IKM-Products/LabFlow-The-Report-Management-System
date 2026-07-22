"use client";

import React, { useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { panelFormSchema, PanelFormValues } from "@/schemas/panel.schema";
import { panelService } from "@/services/panel.service";
import { departmentService } from "@/services/department.service";
import { Department } from "@/types/department.types";
import { CreatePanelPayload } from "@/types/panel.types";

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

interface PanelFormProps {
  defaultDeptId?: string;
  onSuccess: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function PanelForm({
  defaultDeptId = "",
  onSuccess,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: PanelFormProps) {
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
    formState: { errors },
  } = useForm<PanelFormValues>({
    resolver: zodResolver(panelFormSchema) as Resolver<PanelFormValues, any>,
    defaultValues: {
      panel_code: "",
      panel_name: "",
      dept_id: defaultDeptId,
      panel_price: 0,
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

  const onSubmit = async (values: PanelFormValues) => {
    setIsSubmitting(true);
    try {
      const { id, ...restPayload } = values;
      const payload = (
        id && id.trim() !== "" ? values : restPayload
      ) as CreatePanelPayload;

      await panelService.createPanel(payload);
      toast.success("New panel record created successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = serverMessages
        ? serverMessages.join(", ")
        : "Operation process rejected.";
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
          Add Panel
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setInternalIsOpen(true))}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Add New Panel
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enter the required information to create a new panel in the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Panel Code</Label>
                <Input
                  {...register("panel_code")}
                  placeholder="e.g. CBC-01"
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200"
                />
                {errors.panel_code && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.panel_code.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Department</Label>
                <select
                  {...register("dept_id")}
                  disabled={isSubmitting || loadingDepts}
                  className="w-full h-9 px-3 text-xs font-medium rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 cursor-pointer disabled:bg-slate-50"
                >
                  <option value="">
                    {loadingDepts ? "Loading..." : "Select Department"}
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.dept_id} value={dept.dept_id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>
                {errors.dept_id && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.dept_id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Panel Name</Label>
              <Input
                {...register("panel_name")}
                placeholder="e.g. Complete Blood Count"
                disabled={isSubmitting}
                className="rounded-xl border-slate-200"
              />
              {errors.panel_name && (
                <p className="text-[10px] text-red-500 font-medium">
                  {errors.panel_name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                {...register("panel_price", { valueAsNumber: true })}
                disabled={isSubmitting}
                className="rounded-xl border-slate-200"
              />
              {errors.panel_price && (
                <p className="text-[10px] text-red-500 font-medium">
                  {errors.panel_price.message}
                </p>
              )}
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