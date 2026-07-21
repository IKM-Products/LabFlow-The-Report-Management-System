"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { doctorFormSchema, DoctorFormValues } from "@/schemas/doctor.schema";
import { doctorService } from "@/services/doctor.service";

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

interface DoctorFormProps {
  onSuccess: () => void;
}

export default function DoctorForm({ onSuccess }: DoctorFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      qualification: "",
      registration_no: "",
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (values: DoctorFormValues) => {
    setIsSubmitting(true);
    try {
      await doctorService.createDoctor(values);
      toast.success("New doctor record created successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = serverMessages ? serverMessages.join(", ") : "Operation process rejected.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
      <DialogTrigger>
        <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-xs">
          <Plus className="h-4 w-4 mr-2" />
          Add New Doctor
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Register New Practitioner
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Fill out structural parameters to persist configuration properties.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">First Name</Label>
              <Input {...register("first_name")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
              {errors.first_name && <p className="text-[10px] text-red-500 font-medium">{errors.first_name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Last Name</Label>
              <Input {...register("last_name")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
              {errors.last_name && <p className="text-[10px] text-red-500 font-medium">{errors.last_name.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Email Address</Label>
            <Input type="email" {...register("email")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
            {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Phone Connection Line</Label>
            <Input {...register("phone")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
            {errors.phone && <p className="text-[10px] text-red-500 font-medium">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Professional Qualifications</Label>
            <Input {...register("qualification")} placeholder="MD, MBBS, PhD" disabled={isSubmitting} className="rounded-xl border-slate-200" />
            {errors.qualification && <p className="text-[10px] text-red-500 font-medium">{errors.qualification.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Medical Registration Number</Label>
            <Input {...register("registration_no")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
            {errors.registration_no && <p className="text-[10px] text-red-500 font-medium">{errors.registration_no.message}</p>}
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