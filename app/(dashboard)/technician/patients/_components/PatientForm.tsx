// app/(dashboard)/technician/patients/_components/PatientForm.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { patientSchema, PatientFormValues } from "@/schemas/patient.schema";
import { patientService } from "@/services/patient.service";

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

interface PatientFormProps {
  onSuccess: () => void;
}

export default function PatientForm({ onSuccess }: PatientFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema) as any,
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      dob: "",
      gender: "M",
      address: "",
      mrn: "",
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (values: PatientFormValues) => {
    setIsSubmitting(true);
    try {
      await patientService.createPatient(values);
      toast.success("New medical record registry established successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = serverMessages ? serverMessages.join(", ") : "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
      <DialogTrigger>
        <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-xs text-xs h-10">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Register Medical Patient
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Initialize new record tracking metadata for diagnostic monitoring.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">First Name</Label>
              <Input {...register("first_name")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
              {errors.first_name && <p className="text-[10px] text-red-500 font-medium">{errors.first_name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Last Name</Label>
              <Input {...register("last_name")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
              {errors.last_name && <p className="text-[10px] text-red-500 font-medium">{errors.last_name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Medical Record Number (MRN)</Label>
              <Input {...register("mrn")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs font-mono" />
              {errors.mrn && <p className="text-[10px] text-red-500 font-medium">{errors.mrn.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Date of Birth</Label>
              <Input type="date" {...register("dob")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
              {errors.dob && <p className="text-[10px] text-red-500 font-medium">{errors.dob.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Email Address</Label>
              <Input type="email" {...register("email")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
              {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Phone Connection</Label>
              <Input {...register("phone")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
              {errors.phone && <p className="text-[10px] text-red-500 font-medium">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Gender</Label>
              <select 
                {...register("gender")} 
                disabled={isSubmitting} 
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              {errors.gender && <p className="text-[10px] text-red-500 font-medium">{errors.gender.message}</p>}
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Address Residence</Label>
              <Input {...register("address")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
              {errors.address && <p className="text-[10px] text-red-500 font-medium">{errors.address.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="rounded-xl text-xs h-10">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25">
              {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Verify Register"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}