"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { doctorFormSchema, DoctorFormValues } from "@/schemas/doctor.schema";
import { doctorService } from "@/services/doctor.service";
import { DoctorListItem } from "@/types/doctor.types";

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

interface EditDoctorProps {
  doctor: DoctorListItem;
  onSuccess: () => void;
}

export default function EditDoctor({ doctor, onSuccess }: EditDoctorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      email: doctor.email,
      first_name: doctor.first_name,
      last_name: doctor.last_name,
      phone: doctor.phone,
      qualification: doctor.qualification,
      registration_no: doctor.registration_no,
    },
  });

  const onSubmit = async (values: DoctorFormValues) => {
    setIsSubmitting(true);
    try {
      await doctorService.updateDoctor(doctor.id, values);
      toast.success("Doctor profile configuration modified.");
      onSuccess();
      setIsOpen(false);
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = serverMessages ? serverMessages.join(", ") : "Operation process rejected.";
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
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Edit Doctor
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Edit the doctor information in the system.
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
              <Label className="text-xs font-semibold text-slate-700">Email</Label>
              <Input type="email" {...register("email")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
              {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Contact</Label>
              <Input {...register("phone")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
              {errors.phone && <p className="text-[10px] text-red-500 font-medium">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Qualifications</Label>
              <Input {...register("qualification")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
              {errors.qualification && <p className="text-[10px] text-red-500 font-medium">{errors.qualification.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Registration No.</Label>
              <Input {...register("registration_no")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
              {errors.registration_no && <p className="text-[10px] text-red-500 font-medium">{errors.registration_no.message}</p>}
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