"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/auth.schema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { ShieldCheck, Loader2, AlertTriangle, KeyRound } from "lucide-react";
import * as z from "zod";

type FormData = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuthSession = useUserStore((state) => state.setAuthSession);
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setGlobalErrors([]);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setGlobalErrors(result.error.split(", "));
        setIsLoading(false);
      } else {
        // Fetch active session attributes to initialize state store safely
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        if (session?.userId) {
          setAuthSession(session.userId, session.userType || "USER", session.sessionId || "");
          
          if (session.userType === "ADMIN") {
            router.push("/dashboard/admin");
          } else {
            router.push("/dashboard/technician");
          }
        }
      }
    } catch (err) {
      setGlobalErrors(["Fatal synchronization breakdown crossing gateway route boundaries."]);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 font-sans selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 flex flex-col space-y-6 relative overflow-hidden">
        
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Telemetry System Authorization</h2>
          <p className="text-xs text-slate-400 font-medium">Initialize connection vector mapping to core node variables</p>
        </div>

        {globalErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 items-start">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-red-900">Handshake Validation Exceptions:</p>
              <ul className="list-disc list-inside text-[11px] text-red-700 space-y-0.5 font-medium">
                {globalErrors.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Node Identifier Email</label>
            <input
              type="email"
              {...register("email")}
              disabled={isLoading}
              placeholder="operator@network.local"
              className="w-full h-11 px-4 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all disabled:opacity-60"
            />
            {errors.email && <p className="text-[10px] text-red-600 font-semibold mt-0.5">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cryptographic Access Token</label>
            <input
              type="password"
              {...register("password")}
              disabled={isLoading}
              placeholder="••••••••••••"
              className="w-full h-11 px-4 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all disabled:opacity-60"
            />
            {errors.password && <p className="text-[10px] text-red-600 font-semibold mt-0.5">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Synchronizing Session Interface...</span>
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                <span>Establish Handshake Connection</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}