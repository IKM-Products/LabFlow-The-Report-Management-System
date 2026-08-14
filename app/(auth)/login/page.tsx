// app/(auth)/login/page.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/auth.schema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { Loader2, AlertTriangle, Eye, EyeOff, FlaskConical } from "lucide-react";
import * as z from "zod";
import Link from "next/link";

type FormData = z.infer<typeof LoginSchema> & { rememberMe?: boolean };

export default function LoginPage() {
  const router = useRouter();
  const setAuthSession = useUserStore((state) => state.setAuthSession);
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      rememberMe: false,
    }
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
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        
        if (session?.userId) {
          const rawRole = (
            session.userType ||
            session.role ||
            session.userRole ||
            session.user?.role ||
            ""
          ).toString().toUpperCase();

          setAuthSession(session.userId, rawRole, session.sessionId || "");
          
          if (rawRole.includes("ADMIN")) {
            router.push("/dashboard/admin");
          } else {
            router.push("/dashboard/technician");
          }
        }
      }
    } catch (err) {
      setGlobalErrors(["Sync failed while crossing gateway routes."]);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      
      {/* Left Column: Dark Green Brand Display Panel */}
      <div className="bg-[#051610] p-8 sm:p-12 md:p-16 flex flex-col justify-between relative overflow-hidden text-white min-h-125 lg:min-h-screen">
        {/* Subtle Decorative Background Lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <div className="w-125 h-125 border border-emerald-500 rounded-full absolute" />
          <div className="w-175 h-175 border border-emerald-500 rounded-full absolute" />
        </div>

        {/* Top Tagline */}
        <p className="text-xs font-normal italic text-emerald-500/80 tracking-wide relative z-10 max-w-xs">
          Empowering healthcare through fast, precise lab reporting.
        </p>

        {/* Center Content: Headline & Phone Component Mockup */}
        <div className="my-auto space-y-12 relative z-10 flex flex-col items-center lg:items-start w-full">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.1] text-center lg:text-left">
            Manage <br /> your reports
          </h1>
          
          {/* Simulated Smartphone Graphic Device */}
          <div className="w-64 h-340px bg-[#030d0a] rounded-[36px] border-[6px] border-[#0e271f] shadow-2xl overflow-hidden p-4 flex flex-col justify-between relative transform rotate-[-4deg] hover:rotate-0 transition-transform duration-500 origin-bottom">
            {/* Dynamic Island Ear-piece element */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-center" />
            
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center text-[9px] text-emerald-500/60 font-medium">
                <span>Report Analytics</span>
                <div className="w-2.5 h-2.5 bg-emerald-950 rounded-full flex items-center justify-center text-[7px] text-emerald-400">i</div>
              </div>

              {/* Lab Efficiency Widget */}
              <div>
                <p className="text-xl font-semibold text-white tracking-tight">98.4 <span className="text-xs font-normal text-emerald-400">%</span></p>
                <p className="text-[8px] text-emerald-500/60 mt-0.5">Throughput Efficiency Rate</p>
                {/* Micro Bar Chart Cluster */}
                <div className="flex items-end justify-between h-14 mt-3 px-1 gap-1">
                  <div className="w-2.5 h-6 bg-emerald-500/60 rounded-sm" />
                  <div className="w-2.5 h-10 bg-emerald-500/70 rounded-sm" />
                  <div className="w-2.5 h-8 bg-emerald-500/50 rounded-sm" />
                  <div className="w-2.5 h-12 bg-emerald-400 rounded-sm" />
                  <div className="w-2.5 h-7 bg-emerald-500/80 rounded-sm" />
                  <div className="w-2.5 h-9 bg-emerald-500/70 rounded-sm" />
                  <div className="w-2.5 h-5 bg-emerald-500/40 rounded-sm" />
                </div>
              </div>

              {/* Dynamic Categories Deck */}
              <div className="space-y-2 pt-2">
                <p className="text-[9px] text-emerald-500/75 uppercase tracking-wider font-bold">Diagnostics</p>
                <div className="bg-[#081a14] rounded-xl p-2 flex justify-between items-center border border-emerald-900/40">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-emerald-900/40 rounded-lg flex items-center justify-center">
                      <FlaskConical className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-medium text-white">Hematology</p>
                      <p className="text-[7px] text-emerald-500/60">12 pending</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400">99.1%</span>
                </div>
                <div className="bg-[#081a14] rounded-xl p-2 flex justify-between items-center border border-emerald-900/40 opacity-70">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-emerald-900/40 rounded-lg flex items-center justify-center">
                      <FlaskConical className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-medium text-white">Biochemistry</p>
                      <p className="text-[7px] text-emerald-500/60">48 pending</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-500">97.8%</span>
                </div>
              </div>
            </div>

            {/* Simulated Phone Navigation Tabbar */}
            <div className="flex justify-between items-center border-t border-emerald-950 pt-2 text-emerald-800 px-2 text-[10px]">
              <span>⌂</span>
              <div className="w-4 h-4 rounded-full border border-emerald-500" />
              <span>⚙</span>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Identity Icon */}
        <div className="relative z-10 flex items-center justify-between mt-6 lg:mt-0">
          <div className="w-5 h-5 rounded-full border border-emerald-500 flex items-center justify-center text-[9px] font-bold text-emerald-500 opacity-80">
            LF
          </div>
        </div>
      </div>

      {/* Right Column: Clean White Interface Form Layer */}
      <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-between bg-white w-full lg:min-h-screen">
        
        {/* Branding Navigation Header Row */}
        <div className="flex items-center justify-between w-full mb-12">
          {/* Dynamic Geometric Identity Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-emerald-400/40 blur-md animate-pulse" />

              {/* Animated Flask */}
              <FlaskConical className="relative w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 animate-bounce" />
            </div>

            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              LabFlow
            </span>
          </div>
        </div>

        {/* Central Core Input Block Area */}
        <div className="max-w-md w-full mx-auto my-auto space-y-8">
          <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">Welcome Back!</h2>

          {globalErrors.length > 0 && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3 items-start animate-fade-in">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-rose-950">Secure Sign-In to LabFlow</p>
                <ul className="list-none text-[11px] text-rose-700 font-medium space-y-0.5">
                  {globalErrors.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Address Wrapper */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  disabled={isLoading}
                  placeholder="Email"
                  className="w-full h-13 px-6 text-sm font-medium rounded-full border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all disabled:opacity-60 bg-white"
                />
              </div>
              {errors.email && <p className="text-[10px] text-rose-600 font-semibold px-4 mt-0.5">{errors.email.message}</p>}
            </div>

            {/* Password Access Control Wrapper */}
            <div className="space-y-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  disabled={isLoading}
                  placeholder="Password"
                  className="w-full h-13 pl-6 pr-12 text-sm font-medium rounded-full border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all disabled:opacity-60 bg-white"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-rose-600 font-semibold px-4 mt-0.5">{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between px-2 text-xs font-semibold">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <Link href="/forgot-password" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Custom Dynamic Linear Signature Gradient Pill Button Node */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 text-white font-semibold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Toggle Action Container for Sign Up Context */}
            <div className="text-center text-xs font-medium text-slate-500 mt-4">
              Don't have an account?{" "}
              <Link 
                href="/signup" 
                className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>

        {/* Structural Design Form Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium text-slate-400 pt-8 border-t border-slate-100 gap-4 w-full">
          <span>© 2026 LabFlow Inc.</span>
        </div>

      </div>

    </div>
  );
}