"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema } from "@/schemas/user.schema";
import { userService } from "@/services/user.service";
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = z.infer<typeof CreateUserSchema>;

export default function UserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ status: "success" | "error"; messages: string[] } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(CreateUserSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const response = await userService.createUser(data);
      if (response.success) {
        setFeedback({
          status: "success",
          messages: [response.message || "Operator pipeline account sync active"],
        });
        reset();
      }
    } catch (err: any) {
      setFeedback({
        status: "error",
        messages: err?.messages || ["Critical system structural failure writing operator mapping details."],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Add New User
        </h3>
        <p className="text-xs text-slate-500">
          Inject data attributes validating target structural access vectors
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 border rounded-xl flex gap-3 items-start ${
            feedback.status === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          {feedback.status === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <p className="text-xs font-bold">
              {feedback.status === "success" ? "Deployment Matrix OK:" : "Transaction Halted:"}
            </p>
            <ul className="list-none text-[11px] opacity-90 font-medium">
              {feedback.messages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">First Name</Label>
            <Input
              type="text"
              {...register("first_name")}
              disabled={isLoading}
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
              disabled={isLoading}
              placeholder="Last name"
              className="rounded-xl border-slate-200"
            />
            {errors.last_name && (
              <p className="text-[10px] text-red-500 font-medium">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Email Address</Label>
            <Input
              type="email"
              {...register("email")}
              disabled={isLoading}
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
              disabled={isLoading}
              placeholder="+123456789"
              className="rounded-xl border-slate-200"
            />
            {errors.phone && (
              <p className="text-[10px] text-red-500 font-medium">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Password</Label>
            <Input
              type="password"
              {...register("password")}
              disabled={isLoading}
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
              disabled={isLoading}
              placeholder="E.g., TECHNICIAN"
              className="rounded-xl border-slate-200"
            />
            {errors.role_name && (
              <p className="text-[10px] text-red-500 font-medium">{errors.role_name.message}</p>
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}