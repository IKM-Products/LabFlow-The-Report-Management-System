"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/axios/instance"; 

// Zod schema utilizing globally compatible error structures
const patientRegistrationSchema = zod.object({
  full_name: zod.string().min(2, "Full name required"),
  age: zod.number({ message: "Age is required" }).min(1, "Please define valid numerical ages"),
  gender: zod.enum(["male", "female", "other"], { message: "Gender selection required" }),
  phone: zod.string().min(7, "Valid contact stream path required"),
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
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(patientRegistrationSchema),
    // Added gender fallback to prevent the transition from uncontrolled to controlled
    defaultValues: {
      full_name: "",
      phone: "",
      gender: "" as unknown as "male" | "female" | "other", 
    },
  });

  const selectedGender = watch("gender");

  const onSubmit = async (values: RegistrationValues) => {
    try {
      // 🎯 FIX: Updated to correct non-pluralized "/patient" route
      await api.post("/patient", values);
      
      toast.success("Demographic matrix registered inside repository system.");
      reset();
      setOpen(false);
      onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to commit system entry parameters.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) reset(); }}>
      {/* 
        Removed 'asChild' to resolve Radix primitive type mismatch errors.
        Styles are applied directly to the DialogTrigger component itself.
      */}
      <DialogTrigger className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 px-4 rounded-xl shadow-xs transition-colors inline-flex items-center justify-center text-sm cursor-pointer border-0">
        Register New Patient
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">Patient Registration</DialogTitle>
          <DialogDescription className="text-xs text-slate-500 mt-1">
            Input primary demographic data variables to register a patient entry file
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Full Identity Name</Label>
            <Input 
              {...register("full_name")} 
              placeholder="Hari Prasad" 
              className="rounded-xl h-10 focus-visible:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.full_name && (
              <p className="text-xs font-medium text-destructive">{errors.full_name.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Age (Years)</Label>
              <Input 
                type="number" 
                {...register("age", { valueAsNumber: true })} 
                className="rounded-xl h-10 focus-visible:ring-blue-500"
                disabled={isSubmitting}
              />
              {errors.age && (
                <p className="text-xs font-medium text-destructive">{errors.age.message}</p>
              )}
            </div>
            
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Gender</Label>
              {/* Added safe empty string fallback during initialization */}
              <Select 
                value={selectedGender ?? ""}
                onValueChange={(v) => 
                  setValue("gender", v as "male" | "female" | "other", { 
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                  })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="rounded-xl h-10 focus:ring-blue-500 bg-white">
                  <SelectValue placeholder="Identify gender" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl border border-slate-200 shadow-sm">
                  <SelectItem value="male" className="text-sm rounded-lg">Male</SelectItem>
                  <SelectItem value="female" className="text-sm rounded-lg">Female</SelectItem>
                  <SelectItem value="other" className="text-sm rounded-lg">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs font-medium text-destructive">{errors.gender.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Contact Phone Number</Label>
            <Input 
              type="tel" 
              {...register("phone")} 
              placeholder="98XXXXXXXX" 
              className="rounded-xl h-10 focus-visible:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-xs font-medium text-destructive">{errors.phone.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-xs transition-all mt-2 cursor-pointer" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Syncing Workspace Data..." : "Create Identity Account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}