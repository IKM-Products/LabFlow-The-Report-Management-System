"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { profileFormSchema, ProfileFormValues } from "@/schemas/profile.schema";
import { profileService } from "@/services/profile.service";
import { Profile } from "@/types/profile.types";

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

interface EditProfileProps {
  profile: Profile;
  onSuccess: () => void;
}

export default function EditProfile({ profile, onSuccess }: EditProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      phone: profile.phone,
      role_name: profile.role_name,
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await profileService.updateProfile(profile.user_id, values);
      toast.success("Identity configuration modified successfully.");
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <span
          role="button"
          tabIndex={0}
          className="inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-blue-50 h-8 px-2 border border-transparent hover:border-blue-100 cursor-pointer"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Modify Account Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Edit parameters to update credentials or structural scopes for this specific entity.
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Phone Contact</Label>
              <Input {...register("phone")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
              {errors.phone && <p className="text-[10px] text-red-500 font-medium">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Role Designation</Label>
              <Input {...register("role_name")} disabled={isSubmitting} className="rounded-xl border-slate-200" />
              {errors.role_name && <p className="text-[10px] text-red-500 font-medium">{errors.role_name.message}</p>}
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
  );
}