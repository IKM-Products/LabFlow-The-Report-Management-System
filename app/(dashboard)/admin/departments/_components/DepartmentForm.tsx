"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { departmentFormSchema, DepartmentFormValues } from "@/schemas/department.schema";
import { departmentService } from "@/services/department.service";

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

interface DepartmentFormProps {
  onSuccess: () => void;
}

export default function DepartmentForm({ onSuccess }: DepartmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      dept_name: "",
      dept_description: "",
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (values: DepartmentFormValues) => {
    setIsSubmitting(true);
    try {
      await departmentService.createDepartment(values);
      toast.success("New department created successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = serverMessages ? serverMessages.join(", ") : "The operation could not be completed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
      {/* FIXED: Removed inner <Button> and moved all classes directly to the trigger to avoid nesting */}
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer">
        <Plus className="h-4 w-4 mr-2" />
        Add Department
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Create Department
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Add a new department to the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Department Name</Label>
            <Input {...register("dept_name")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
            {errors.dept_name && <p className="text-[10px] text-red-500 font-medium">{errors.dept_name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Description</Label>
            <Input {...register("dept_description")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
            {errors.dept_description && <p className="text-[10px] text-red-500 font-medium">{errors.dept_description.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="rounded-xl text-xs h-10">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25">
              {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}