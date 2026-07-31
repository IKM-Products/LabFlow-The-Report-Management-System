"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

import { CreateUserSchema } from "@/schemas/user.schema";
import { userService } from "@/services/user.service";

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

type FormData = z.infer<typeof CreateUserSchema>;

interface UserFormProps {
  onSuccess: () => void;
}

export default function UserForm({ onSuccess }: UserFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      role_name: "",
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    try {
      // Convert empty strings ("") to null so backend validators accept optional fields
      const payload = Object.fromEntries(
        Object.entries(values).map(([key, val]) => [
          key,
          typeof val === "string" && val.trim() === "" ? null : val,
        ])
      );

      await userService.createUser(payload as FormData);
      toast.success("New user account created successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages || error?.messages;
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
        Add User
      </button>

      <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Add New User
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enter the required details to create and provision a new user in the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">First Name</Label>
                <Input
                  type="text"
                  {...register("first_name")}
                  disabled={isSubmitting}
                  placeholder="First name"
                  className="rounded-xl border-slate-200"
                />
                {errors.first_name && (
                  <p className="text-[10px] text-red-500 font-medium">{errors.first_name.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Last Name</Label>
                <Input
                  type="text"
                  {...register("last_name")}
                  disabled={isSubmitting}
                  placeholder="Last name"
                  className="rounded-xl border-slate-200"
                />
                {errors.last_name && (
                  <p className="text-[10px] text-red-500 font-medium">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Email Address</Label>
                <Input
                  type="email"
                  {...register("email")}
                  disabled={isSubmitting}
                  placeholder="operator@example.com"
                  className="rounded-xl border-slate-200"
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Phone Contact</Label>
                <Input
                  type="text"
                  {...register("phone")}
                  disabled={isSubmitting}
                  placeholder="+123456789"
                  className="rounded-xl border-slate-200"
                />
                {errors.phone && (
                  <p className="text-[10px] text-red-500 font-medium">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Password</Label>
                <Input
                  type="password"
                  {...register("password")}
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  className="rounded-xl border-slate-200"
                />
                {errors.password && (
                  <p className="text-[10px] text-red-500 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Role Designation</Label>
                <Input
                  type="text"
                  {...register("role_name")}
                  disabled={isSubmitting}
                  placeholder="E.g., TECHNICIAN"
                  className="rounded-xl border-slate-200"
                />
                {errors.role_name && (
                  <p className="text-[10px] text-red-500 font-medium">{errors.role_name.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-xl text-xs h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25"
              >
                {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}