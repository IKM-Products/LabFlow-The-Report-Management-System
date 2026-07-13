"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Lock, ArrowRight, ShieldAlert, Wrench, Eye, EyeOff, FlaskConical } from "lucide-react";

type UserRole = "admin" | "technician";

const loginSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(1, "Password is required"),
  rememberMe: zod.boolean().optional(),
});

type LoginValues = zod.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>("admin");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        role: activeRole, 
        redirect: false,   
      });

      if (res?.error) {
        console.error("Login verification framework dropped status:", res.error);
        
        const isParsingCrash = 
          res.error.includes("Unexpected") || 
          res.error.includes("JSON") || 
          res.error.includes("invalid response format");
          
        const userFriendlyMessage = isParsingCrash 
          ? "Authentication server returned an unexpected structure. Please check your credentials or database status." 
          : res.error;

        toast.error(userFriendlyMessage);
        setIsLoading(false);
        return;
      }

      toast.success("Authentication sequence authorized! Redirecting...");
      localStorage.setItem("userRole", activeRole);

      if (activeRole === "admin") {
        window.location.href = "/admin";
      } else if (activeRole === "technician") {
        window.location.href = "/technician/patients";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      console.error("Critical login process drop:", error);
      toast.error("An unexpected error occurred during access validation.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F4F2EC] text-stone-900 font-sans selection:bg-green-800 selection:text-white antialiased relative overflow-hidden">
      
      {/* Premium Ambient Background Textures */}
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-100/40 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[30%] w-[50vw] h-[50vw] bg-amber-100/30 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* LEFT PANEL: High-Contrast Green Editorial Side */}
      <div className="hidden lg:flex lg:w-[42%] bg-linear-to-br from-green-800 via-green-700 to-emerald-900 p-16 flex-col justify-between relative overflow-hidden shadow-[12px_0_60px_rgba(15,55,30,0.18)] z-10">
        
        {/* Subtle Luxury Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[32px_32px] opacity-[0.07] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-emerald-500/20 blur-[100px] pointer-events-none" />
        
        {/* Brand Architecture with LIVE Glowing/Bubbling Flask Logo */}
        <div className="flex items-center gap-3.5 z-10 cursor-default group select-none">
          <div className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center bg-white/10 shadow-lg backdrop-blur-md relative overflow-hidden transition-all duration-500 group-hover:border-white/40 group-hover:bg-white/15">
            {/* Live inner ripple element */}
            <span className="absolute inset-0 bg-linear-to-t from-emerald-400/20 to-transparent animate-pulse" />
            <FlaskConical className="w-5 h-5 text-emerald-300 fill-emerald-400/20 transition-all duration-700 group-hover:scale-110 group-hover:text-white group-hover:fill-white/30 animate-bounce animation-duration-[3s]" />
          </div>
          <span className="text-base font-black tracking-[0.45em] uppercase text-white font-mono drop-shadow-xs">
            Lab<span className="text-emerald-300 font-light">Flow</span>
          </span>
        </div>

        {/* Premium Typographic Workspace */}
        <div className="space-y-6 z-10 max-w-sm my-auto">
          <h1 className="italic text-4xl xl:text-5xl font-light tracking-tight text-white leading-[1.2]">
            Built for Precise <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-linear-to-r from-emerald-200 via-green-100 to-amber-100 tracking-normal drop-shadow-xs">
              Report Management.
            </span>
          </h1>
          <div className="h-px w-16 bg-linear-to-r from-amber-300 to-transparent" />
          <p className="text-green-50/80 text-sm font-light leading-relaxed tracking-wide">
            A secure laboratory ecosystem designed for seamless report submissions, centralized management and real-time workflow tracking.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Floating Form Canvas */}
      <div className="w-full lg:w-[58%] flex flex-col justify-center px-6 sm:px-12 md:px-20 xl:px-32 py-12 relative z-10">
        
        {/* Modern Floating Island Card Layout */}
        <div className="max-w-md w-full mx-auto bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 md:p-11 shadow-[0_30px_70px_rgba(15,55,30,0.06)] border border-stone-200/50 space-y-8 relative">
          
          {/* Header Segment */}
          <div className="space-y-3">
            <div className="lg:hidden flex items-center gap-2.5 mb-3 select-none">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center border border-green-100">
                <FlaskConical className="w-4 h-4 text-green-700 fill-green-700/10 animate-pulse" />
              </div>
              <span className="text-xs font-black tracking-[0.3em] uppercase font-mono text-green-800">LabFlow</span>
            </div>
            <h2 className="text-3xl font-serif text-stone-900 font-normal tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-xs text-stone-500 tracking-wide font-light leading-relaxed uppercase">
              Enter Your Credentials Below
            </p>
          </div>

          {/* Premium Segmented Tab Strip */}
          <div className="grid grid-cols-2 p-1.5 bg-stone-100 rounded-2xl border border-stone-200/50 text-center relative shadow-inner">
            <button
              type="button"
              onClick={() => !isLoading && setActiveRole("admin")}
              className={`flex items-center justify-center gap-2.5 py-3 text-xs font-bold tracking-wider uppercase rounded-xl transition-all relative select-none cursor-pointer ${
                activeRole === "admin"
                  ? "bg-white text-green-900 shadow-md shadow-stone-200/60 font-black scale-[1.01]"
                  : "text-stone-400 hover:text-stone-600"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              <ShieldAlert className={`h-4 w-4 transition-colors ${activeRole === "admin" ? "text-green-700" : "text-stone-300"}`} />
              Admin
            </button>
            <button
              type="button"
              onClick={() => !isLoading && setActiveRole("technician")}
              className={`flex items-center justify-center gap-2.5 py-3 text-xs font-bold tracking-wider uppercase rounded-xl transition-all relative select-none cursor-pointer ${
                activeRole === "technician"
                  ? "bg-white text-green-900 shadow-md shadow-stone-200/60 font-black scale-[1.01]"
                  : "text-stone-400 hover:text-stone-600"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              <Wrench className={`h-4 w-4 transition-colors ${activeRole === "technician" ? "text-green-700" : "text-stone-300"}`} />
              Technician
            </button>
          </div>

          {/* Form Controller */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email Field Block */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 block pl-1">
                Email
              </Label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 h-4 w-4 text-stone-300 group-focus-within:text-green-700 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="labflow@gmail.com"
                  className="pl-11 h-12 bg-stone-50/50 border-stone-200/80 focus:bg-white focus:border-green-700 focus-visible:ring-4 focus-visible:ring-green-700/10 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 transition-all shadow-xs"
                  disabled={isLoading}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-xs text-red-600 font-medium mt-1 pl-1">{errors.email.message}</p>}
            </div>

            {/* Password Field Block */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pl-1">
                <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 block">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-xs text-stone-400 hover:text-green-700 font-semibold transition-colors tracking-wide">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-stone-300 group-focus-within:text-green-700 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="pl-11 pr-11 h-12 bg-stone-50/50 border-stone-200/80 focus:bg-white focus:border-green-700 focus-visible:ring-4 focus-visible:ring-green-700/10 rounded-xl text-sm text-stone-800 placeholder:text-stone-200 transition-all shadow-xs"
                  disabled={isLoading}
                  {...register("password")}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-300 hover:text-green-700 transition-colors select-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 font-medium mt-1 pl-1">{errors.password.message}</p>}
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center text-xs pt-1 pl-0.5">
              <label className="flex items-center gap-3 cursor-pointer text-stone-400 hover:text-stone-700 transition-colors select-none">
                <input 
                  type="checkbox" 
                  className="rounded-md border-stone-300 bg-transparent text-green-700 focus:ring-green-700/30 h-4 w-4 accent-green-700 cursor-pointer transition-all"
                  disabled={isLoading}
                  {...register("rememberMe")}
                />
                Remember Me
              </label>
            </div>

            {/* Submit & SSO Action Buttons */}
            <div className="pt-4 space-y-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold text-xs tracking-[0.15em] uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/15 active:scale-[0.99] cursor-pointer group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Secondary Action Link Footer */}
          <div className="text-center text-xs text-stone-400 font-light pt-4 border-t border-stone-100">
            Don't have an account?{" "}
            <Link href="/signup" className="text-green-700 hover:text-green-800 font-bold transition-colors shadow-xs">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}