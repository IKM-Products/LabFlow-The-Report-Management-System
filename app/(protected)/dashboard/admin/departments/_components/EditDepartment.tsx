"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { departmentFormSchema, DepartmentFormValues } from "@/schemas/department.schema";
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
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditDepartmentProps {
  department: Department;
  onSuccess: () => void;
}

export default function EditDepartment({ department, onSuccess }: EditDepartmentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      dept_name: department.dept_name,
      dept_description: department.dept_description,
    },
  });

  const onSubmit = async (values: DepartmentFormValues) => {
    setIsSubmitting(true);
    try {
      await departmentService.updateDepartment({
        id: department.dept_id,
        ...values,
      });
      toast.success("Department updated successfully.");
      onSuccess();
      setIsOpen(false);
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = serverMessages ? serverMessages.join(", ") : "The operation could not be completed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* FIXED: Removed inner <Button> and moved all styles directly onto the trigger to avoid nested button components */}
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 h-8 px-2 border border-transparent hover:border-blue-100">
        <Edit2 className="h-3.5 w-3.5" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Edit Department
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Edit the department information in the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Department Name</Label>
            <Input {...register("dept_name")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
            {errors.dept_name && <p className="text-[10px] text-red-500 font-medium">{errors.dept_name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Department Description</Label>
            <Input {...register("dept_description")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
            {errors.dept_description && <p className="text-[10px] text-red-500 font-medium">{errors.dept_description.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting} className="rounded-xl text-xs h-10">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25">
              {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}