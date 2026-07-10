"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { 
  Building2, 
  Save, 
  Sliders, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  FileCheck, 
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Validation schema matching your lab_settings structural table parameters
const labSettingsSchema = zod.object({
  lab_name: zod.string().min(1, "Laboratory Name is required"),
  tagline: zod.string().optional(),
  address: zod.string().min(1, "Physical address framework is required"),
  phone: zod.string().min(1, "Contact routing phone number is required"),
  email: zod.string().email("Please supply a valid corporate email configuration"),
  website: zod.string().url("Please supply a valid platform URI route format").or(zod.literal("")),
  registration_no: zod.string().min(1, "Regulatory authority registration token required"),
  report_footer: zod.string().optional(),
});

type LabSettingsValues = zod.infer<typeof labSettingsSchema>;

export default function LabSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  // Initializing schema values mock mapping back to your DB defaults
  const { register, handleSubmit, formState: { errors } } = useForm<LabSettingsValues>({
    resolver: zodResolver(labSettingsSchema),
    defaultValues: {
      lab_name: "LabFlow Advanced Diagnostics",
      tagline: "Precision Analytics, Trusted Clinical Reporting",
      address: "Gairidhara, Kathmandu, Nepal",
      phone: "+977-1-4412345",
      email: "operations@labflow.org",
      website: "https://labflow.org",
      registration_no: "NHRC-2026-MED-891",
      report_footer: "CONFIDENTIAL MEDICAL REPORT: Generated electronically via LabFlow pipeline nodes. Valid without physical seals under NHRC regulation parameters.",
    }
  });

  const onSubmit = async (values: LabSettingsValues) => {
    setIsSaving(true);
    try {
      // Logic pipeline interaction to update `lab_settings` via proxy goes here
      console.log("Committed settings payload mapping:", values);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Network simulation delay
      toast.success("Laboratory environmental profiles refreshed securely!");
    } catch (error) {
      toast.error("Failed to commit settings metadata overrides.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto font-sans">
      
      {/* Upper Segment Title Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-neutral-100">
        <div>
          <h1 className="text-3xl font-serif font-normal italic tracking-tight text-neutral-900">
            System Profiles
          </h1>
          <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase mt-1">
            Overhaul system metadata, report contexts, and operational records
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* SECTION 1: Core Corporate Data Elements */}
        <div className="bg-white rounded-2xl border border-neutral-200/70 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <Building2 className="h-4 w-full max-w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-neutral-800 tracking-wide uppercase">Identity and Metadata</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="lab_name" className="text-xs font-bold text-neutral-500">Laboratory Title Name</Label>
              <Input id="lab_name" className="h-11 rounded-xl text-sm" {...register("lab_name")} disabled={isSaving} />
              {errors.lab_name && <p className="text-xs text-destructive font-semibold">{errors.lab_name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="registration_no" className="text-xs font-bold text-neutral-500">NHRC Registration / License Number</Label>
              <Input id="registration_no" className="h-11 rounded-xl font-mono text-sm" {...register("registration_no")} disabled={isSaving} />
              {errors.registration_no && <p className="text-xs text-destructive font-semibold">{errors.registration_no.message}</p>}
            </div>

            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <Label htmlFor="tagline" className="text-xs font-bold text-neutral-500">Brand Tagline slogan</Label>
              <Input id="tagline" className="h-11 rounded-xl text-sm" {...register("tagline")} disabled={isSaving} />
            </div>
          </div>
        </div>

        {/* SECTION 2: Structural Routing Context Points */}
        <div className="bg-white rounded-2xl border border-neutral-200/70 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <Sliders className="h-4 w-full max-w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-neutral-800 tracking-wide uppercase">Communication and Location Links</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-bold text-neutral-500 flex items-center gap-1.5"><Phone className="h-3 w-3" /> Routing Phone Line</Label>
              <Input id="phone" className="h-11 rounded-xl text-sm" {...register("phone")} disabled={isSaving} />
              {errors.phone && <p className="text-xs text-destructive font-semibold">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-neutral-500 flex items-center gap-1.5"><Mail className="h-3 w-3" /> System Contact Email</Label>
              <Input id="email" type="email" className="h-11 rounded-xl text-sm" {...register("email")} disabled={isSaving} />
              {errors.email && <p className="text-xs text-destructive font-semibold">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs font-bold text-neutral-500 flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Physical Office Address</Label>
              <Input id="address" className="h-11 rounded-xl text-sm" {...register("address")} disabled={isSaving} />
              {errors.address && <p className="text-xs text-destructive font-semibold">{errors.address.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="website" className="text-xs font-bold text-neutral-500 flex items-center gap-1.5"><Globe className="h-3 w-3" /> Web Portal URL Route</Label>
              <Input id="website" className="h-11 rounded-xl text-sm" {...register("website")} disabled={isSaving} />
              {errors.website && <p className="text-xs text-destructive font-semibold">{errors.website.message}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 3: Diagnostic Report Processing Configurations */}
        <div className="bg-white rounded-2xl border border-neutral-200/70 p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
            <FileCheck className="h-4 w-full max-w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-neutral-800 tracking-wide uppercase">Report Output Customizations</h2>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report_footer" className="text-xs font-bold text-neutral-500">PDF Report Disclaimers Footer</Label>
            <Textarea 
              id="report_footer" 
              rows={3} 
              className="rounded-xl text-sm focus:border-emerald-600 focus-visible:ring-0 bg-neutral-50/20" 
              {...register("report_footer")} 
              disabled={isSaving} 
            />
          </div>
        </div>

        {/* Action Triggers Frame */}
        <div className="flex justify-end gap-3 pt-2">
          <Button 
            type="submit" 
            className="bg-[#00a365] hover:bg-[#008f58] text-white font-sans font-bold text-sm rounded-xl px-5 h-12 flex items-center gap-2 shadow-md transition-all active:scale-[0.98]"
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                Commit Configuration
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}