"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleSchema } from "@/schemas/role.schema";
import { roleService } from "@/services/role.service";
import { ShieldPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import * as z from "zod";

type FormData = z.infer<typeof RoleSchema>;

interface RoleFormProps {
  onSuccessTrigger?: () => void;
}

export default function RoleForm({ onSuccessTrigger }: RoleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ status: "success" | "error"; messages: string[] } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(RoleSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const response = await roleService.createRole({ role_name: data.role_name });
      if (response.success) {
        setFeedback({ status: "success", messages: [response.message || "Role configuration injected successfully"] });
        reset();
        if (onSuccessTrigger) onSuccessTrigger();
      }
    } catch (err: any) {
      setFeedback({
        status: "error",
        messages: err?.messages || ["Pipeline transaction failure generating target matrix context role."],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldPlus className="h-4 w-4 text-blue-600" />
          Initialize Authority Role Definition
        </h3>
        <p className="text-[11px] text-slate-500">Append high-level credential definitions into database routing schema matrices</p>
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
            <p className="text-xs font-bold">{feedback.status === "success" ? "Transaction Committed:" : "Pipeline Exception:"}</p>
            <ul className="list-none text-[11px] opacity-90 font-medium">
              {feedback.messages.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Descriptor Key Identifier</label>
          <input
            type="text"
            {...register("role_name")}
            disabled={isLoading}
            placeholder="E.g., SENIOR_LAB_TECHNICIAN"
            className="w-full h-10 px-4 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
          />
          {errors.role_name && <p className="text-[10px] text-red-600 font-semibold mt-0.5">{errors.role_name.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-slate-950 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-200 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Provisioning Pipeline Matrix Configuration...</span>
            </>
          ) : (
            <span>Commit Role Configurations</span>
          )}
        </button>
      </form>
    </div>
  );
}