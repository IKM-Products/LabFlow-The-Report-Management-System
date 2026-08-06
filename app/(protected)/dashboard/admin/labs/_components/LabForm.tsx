"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { labFormSchema, LabFormValues } from "@/schemas/lab.schema";
import { labService } from "@/services/lab.service";

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

interface LabFormProps {
  onSuccess: () => void;
}

export default function LabForm({ onSuccess }: LabFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LabFormValues>({
    resolver: zodResolver(labFormSchema),
    defaultValues: {
      lab_name: "",
      tagline: "",
      address: "",
      phone: "",
      email: "",
      registration_no: "",
      report_footer: "",
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (values: LabFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert empty strings ("") to null so backend validators accept optional fields
      const payload = Object.fromEntries(
        Object.entries(values).map(([key, val]) => [
          key,
          typeof val === "string" && val.trim() === "" ? null : val,
        ])
      );

      await labService.createLab(payload as LabFormValues);
      toast.success("New laboratory profile initiated successfully.");
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
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm h-10 px-4 py-2 bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl font-medium shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Laboratory
      </button>

      <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Add New Lab
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enter the required information to create a new lab in the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Lab Name</Label>
                <Input {...register("lab_name")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
                {errors.lab_name && <p className="text-[10px] text-red-500 font-medium">{errors.lab_name.message}</p>}
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Tagline / Motto</Label>
                <Input {...register("tagline")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
                {errors.tagline && <p className="text-[10px] text-red-500 font-medium">{errors.tagline.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Address</Label>
              <Input {...register("address")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
              {errors.address && <p className="text-[10px] text-red-500 font-medium">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Email</Label>
                <Input type="email" {...register("email")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
                {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Contact</Label>
                <Input {...register("phone")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
                {errors.phone && <p className="text-[10px] text-red-500 font-medium">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Official Registration No</Label>
              <Input {...register("registration_no")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
              {errors.registration_no && <p className="text-[10px] text-red-500 font-medium">{errors.registration_no.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">PDF Report Footer Settings1</Label>
              <Input {...register("report_footer")} placeholder="System footer copyright or terms statement" disabled={isSubmitting} className="rounded-xl border-slate-200" />
              {errors.report_footer && <p className="text-[10px] text-red-500 font-medium">{errors.report_footer.message}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="rounded-xl text-xs h-10">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25">
                {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}