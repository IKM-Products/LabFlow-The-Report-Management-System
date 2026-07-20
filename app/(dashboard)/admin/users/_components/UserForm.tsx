"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema } from "@/schemas/user.schema";
import { userService } from "@/services/user.service";
import { UserPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import * as z from "zod";

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
          <UserPlus className="h-4 w-4 text-blue-600" />
          Provision New Node Operator Account
        </h3>
        <p className="text-[11px] text-slate-500">Inject data attributes validating target structural access vectors</p>
      </div>

      {feedback && (
        <div className={`p-4 border rounded-xl flex gap-3 items-start ${
          feedback.status === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"
        }`}>
          {feedback.status === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <p className="text-xs font-bold">{feedback.status === "success" ? "Deployment Matrix OK:" : "Transaction Halted:"}</p>
            <ul className="list-none text-[11px] opacity-90 font-medium">
              {feedback.messages.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">First Name Identifier</label>
            <input
              type="text"
              {...register("first_name")}
              disabled={isLoading}
              placeholder="Ismael"
              className="w-full h-10 px-4 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
            {errors.first_name && <p className="text-[10px] text-red-600 font-semibold mt-0.5">{errors.first_name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Last Name Vector</label>
            <input
              type="text"
              {...register("last_name")}
              disabled={isLoading}
              placeholder="Manaay"
              className="w-full h-10 px-4 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
            {errors.last_name && <p className="text-[10px] text-red-600 font-semibold mt-0.5">{errors.last_name.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">System Core Email Link</label>
            <input
              type="email"
              {...register("email")}
              disabled={isLoading}
              placeholder="operator@clinical.net"
              className="w-full h-10 px-4 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
            {errors.email && <p className="text-[10px] text-red-600 font-semibold mt-0.5">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Operational Interface Phone</label>
            <input
              type="text"
              {...register("phone")}
              disabled={isLoading}
              placeholder="+977-XXXXXXXXXX"
              className="w-full h-10 px-4 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
            {errors.phone && <p className="text-[10px] text-red-600 font-semibold mt-0.5">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cryptographic Cipher Password</label>
            <input
              type="password"
              {...register("password")}
              disabled={isLoading}
              placeholder="••••••••"
              className="w-full h-10 px-4 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
            {errors.password && <p className="text-[10px] text-red-600 font-semibold mt-0.5">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target Assigned Matrix Role</label>
            <input
              type="text"
              {...register("role_name")}
              disabled={isLoading}
              placeholder="E.g., TECHNICIAN"
              className="w-full h-10 px-4 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
            {errors.role_name && <p className="text-[10px] text-red-600 font-semibold mt-0.5">{errors.role_name.message}</p>}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 h-10 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-200 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Injecting Structural Database Record...</span>
              </>
            ) : (
              <span>Commit Operator Profile</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}