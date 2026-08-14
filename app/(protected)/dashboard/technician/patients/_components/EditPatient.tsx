// app/(dashboard)/technician/patients/_components/EditPatient.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { patientSchema, PatientFormValues } from "@/schemas/patient.schema";
import { patientService } from "@/services/patient.service";
import { Patient } from "@/types/patient.types";

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

interface EditPatientProps {
  patient: Patient;
  onSuccess: () => void;
}

export default function EditPatient({ patient, onSuccess }: EditPatientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      first_name: patient.first_name,
      last_name: patient.last_name,
      email: patient.email,
      phone: patient.phone,
      dob: patient.dob,
      gender: patient.gender,
      address: patient.address,
      mrn: patient.mrn,
    },
  });

  const onSubmit = async (values: PatientFormValues) => {
    setIsSubmitting(true);
    try {
      await patientService.updatePatient(patient.id, values);
      toast.success("Patient updated successfully.");
      onSuccess();
      setIsOpen(false);
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = serverMessages ? serverMessages.join(", ") : "Operation failed.";
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
        className="inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 h-8 px-2 border border-transparent hover:border-blue-100 transition-colors cursor-pointer"
      >
        <Edit2 className="h-3.5 w-3.5" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Edit Patient
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Edit the patient information in the system.
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
                <Label className="text-xs font-semibold text-slate-700">Email</Label>
                <Input type="email" {...register("email")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
                {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Contact</Label>
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
                  <option value="ALL">Select a Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
                {errors.gender && <p className="text-[10px] text-red-500 font-medium">{errors.gender.message}</p>}
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Address</Label>
                <Input {...register("address")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
                {errors.address && <p className="text-[10px] text-red-500 font-medium">{errors.address.message}</p>}
              </div>
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
    </>
  );
}