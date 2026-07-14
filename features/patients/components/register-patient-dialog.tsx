"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/axios/instance"; 

// 🎯 VALIDATION SCHEMA
const patientRegistrationSchema = zod.object({
  first_name: zod.string().min(1, "First name is required"),
  last_name: zod.string().min(1, "Last name is required"),
  email: zod.string().email("Invalid email address").or(zod.literal("")),
  phone: zod.string().min(1, "Phone number is required"),
  mrn: zod.string().min(1, "MRN identifier is required"),
  dob: zod.string().min(1, "Date of birth is required"),
  gender: zod.string().min(1, "Gender selection is required"),
  address: zod.string().min(1, "Address is required"),
});

type RegistrationValues = zod.infer<typeof patientRegistrationSchema>;

interface RegisterPatientDialogProps {
  onSuccess: () => void;
}

export function RegisterPatientDialog({ onSuccess }: RegisterPatientDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      mrn: "",
      dob: "",
      gender: "",
      address: "",
    },
  });

  const onSubmit = async (values: RegistrationValues) => {
    try {
      const genderMap: Record<string, string> = {
        MALE: "M",
        FEMALE: "F",
        OTHER: "O"
      };

      // 🎯 FIX: Construct payload dynamically to omit email completely if empty
      const payload: Record<string, any> = {
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        mrn: values.mrn,
        dob: values.dob, 
        gender: genderMap[values.gender] || values.gender, 
        address: values.address,
      };

      // Only attach email key if it actually contains characters
      if (values.email && values.email.trim() !== "") {
        payload.email = values.email.trim();
      } else {
        payload.email = null; // Send explicit null to prevent backend fallback to ""
      }

      await api.post("/patient", payload);
      
      toast.success("Patient registered successfully.");
      reset();
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      const backendErrorMsg = err.response?.data?.messages?.[0] || 
                             err.response?.data?.message || 
                             err.response?.data?.error ||
                             "Database operation failed.";
                             
      toast.error(backendErrorMsg);
      
      console.warn("--- BACKEND SERVER REJECTION DETAILS ---");
      console.log("Raw Server Error Object:", err.response?.data);
      console.log("HTTP Status Code Received:", err.response?.status);
      
      if (err.response?.data?.messages && Array.isArray(err.response.data.messages)) {
        console.group("🚨 Server Rejection Messages");
        err.response.data.messages.forEach((msg: any, index: number) => {
          console.log(`[Message ${index}]:`, msg);
        });
        console.groupEnd();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) reset(); }}>
      <DialogTrigger className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 px-4 rounded-xl shadow-xs transition-colors inline-flex items-center justify-center text-sm cursor-pointer border-0">
        Register New Patient
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Patient Registration
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 mt-1">
            Fill in the details below to complete the patient configuration record.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">First Name</Label>
              <Input 
                {...register("first_name")} 
                className="rounded-xl h-10 focus-visible:ring-blue-500 text-slate-900 bg-white" 
                disabled={isSubmitting}
              />
              {errors.first_name && <p className="text-[10px] text-red-500">{errors.first_name.message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Last Name</Label>
              <Input 
                {...register("last_name")} 
                className="rounded-xl h-10 focus-visible:ring-blue-500 text-slate-900 bg-white" 
                disabled={isSubmitting}
              />
              {errors.last_name && <p className="text-[10px] text-red-500">{errors.last_name.message}</p>}
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Email</Label>
              <Input 
                type="email"
                {...register("email")} 
                className="rounded-xl h-10 focus-visible:ring-blue-500 text-slate-900 bg-white" 
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Phone</Label>
              <Input 
                {...register("phone")} 
                className="rounded-xl h-10 focus-visible:ring-blue-500 text-slate-900 bg-white" 
                disabled={isSubmitting}
              />
              {errors.phone && <p className="text-[10px] text-red-500">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Row 3: MRN & Date of Birth */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">MRN</Label>
              <Input 
                {...register("mrn")} 
                className="rounded-xl h-10 focus-visible:ring-blue-500 text-slate-900 bg-white" 
                disabled={isSubmitting}
              />
              {errors.mrn && <p className="text-[10px] text-red-500">{errors.mrn.message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Date of Birth</Label>
              <Input 
                type="date" 
                {...register("dob")} 
                className="rounded-xl h-10 focus-visible:ring-blue-500 text-slate-900 bg-white" 
                disabled={isSubmitting}
              />
              {errors.dob && <p className="text-[10px] text-red-500">{errors.dob.message}</p>}
            </div>
          </div>

          {/* Row 4: Gender Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Gender</Label>
            <select 
              {...register("gender")}
              disabled={isSubmitting}
              className="flex w-full rounded-xl border border-slate-200 bg-white px-3 h-10 text-sm text-slate-900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.gender && <p className="text-[10px] text-red-500">{errors.gender.message}</p>}
          </div>

          {/* Row 5: Full Address */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Address</Label>
            <Input 
              {...register("address")} 
              className="rounded-xl h-10 focus-visible:ring-blue-500 text-slate-900 bg-white" 
              disabled={isSubmitting}
              required
            />
            {errors.address && <p className="text-[10px] text-red-500">{errors.address.message}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 h-11 rounded-xl font-bold mt-2 shadow-xs cursor-pointer text-white" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Syncing..." : "Register Patient"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}