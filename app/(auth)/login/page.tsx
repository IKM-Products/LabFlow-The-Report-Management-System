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
import { User, Lock, ArrowRight, ShieldAlert, Wrench, Eye, EyeOff, Sparkles } from "lucide-react";

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
    <div className="min-h-screen w-full flex bg-[#F7F5F0] text-stone-900 font-sans selection:bg-emerald-950 selection:text-emerald-200 antialiased relative overflow-hidden">
      
      {/* Background Radial Textures */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-amber-50/60 rounded-full blur-[100px] pointer-events-none" />

      {/* LEFT PANEL: High-Contrast Editorial Showpiece */}
      <div className="hidden lg:flex lg:w-[42%] bg-linear-to-br from-[#062012] via-[#0A2E1A] to-[#04160C] p-16 flex-col justify-between relative overflow-hidden shadow-[10px_0_50px_rgba(0,0,0,0.15)] z-10">
        
        {/* Subtle geometric structural accents */}
        <div className="absolute inset-0 bg-[radial-gradient(#104026_1px,transparent_1px)] bg-size-[24px_24px] opacity-30 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />
        
        {/* Elegant Brand Architecture */}
        <div className="flex items-center gap-3 z-10 group cursor-default">
          <div className="w-8 h-8 rounded-full border border-emerald-400/30 flex items-center justify-center bg-emerald-950/60 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
          </div>
          <span className="text-xs italic font-black tracking-[0.4em] uppercase text-stone-100 font-mono">
            LabFlow
          </span>
        </div>

        {/* Dynamic, Eye-Catching Typography Block */}
        <div className="space-y-8 z-10 max-w-sm my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Core Engine v2.6
          </div>
          <h1 className="text-4xl xl:text-5xl font-extralight tracking-tight text-stone-100 leading-[1.15]">
            The beauty of <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-linear-to-r from-emerald-300 via-emerald-100 to-amber-200">
              absolute clarity.
            </span>
          </h1>
          <div className="h-0.5 w-12 bg-[#D4AF37]" />
          <p className="text-stone-300/70 text-sm font-light leading-relaxed tracking-wide">
            A premium diagnostic interface calculated for maximum structural security, clean automation metrics, and secure credential handling.
          </p>
        </div>

        {/* Minimal Footprint Metadata */}
        <div className="text-[10px] text-emerald-600/60 font-mono tracking-widest z-10 flex items-center gap-4">
          <span>SECURE PROTOCOL // 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>SYS: ACTIVE</span>
        </div>
      </div>

      {/* RIGHT PANEL: Floating Glass-Accent Interactive Canvas */}
      <div className="w-full lg:w-[58%] flex flex-col justify-center px-6 sm:px-12 md:px-20 xl:px-32 py-12 relative">
        
        {/* Floating White Island Card for extreme contrast and focus */}
        <div className="max-w-md w-full mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(10,46,26,0.06)] border border-white/60 space-y-8 relative">
          
          {/* Header Segment */}
          <div className="space-y-2.5">
            <div className="lg:hidden flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-800" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase font-mono text-stone-400">LabFlow</span>
            </div>
            <h2 className="text-3xl font-serif text-[#0A2E1A] font-normal tracking-tight">
              System Gateway
            </h2>
            <p className="text-xs text-stone-500 tracking-wide font-light">
              Provide identity coordinates to authorize your security clearance token.
            </p>
          </div>

          {/* Premium Minimalist Segmented Tab Strip */}
          <div className="grid grid-cols-2 p-1 bg-[#F5F3ED] rounded-xl border border-stone-200/40 text-center relative shadow-inner">
            <button
              type="button"
              onClick={() => !isLoading && setActiveRole("admin")}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold tracking-wider uppercase rounded-lg transition-all relative select-none cursor-pointer ${
                activeRole === "admin"
                  ? "bg-white text-[#0A2E1A] shadow-xs font-black"
                  : "text-stone-400 hover:text-stone-600"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              <ShieldAlert className={`h-3.5 w-3.5 transition-colors ${activeRole === "admin" ? "text-emerald-700" : ""}`} />
              Admin
            </button>
            <button
              type="button"
              onClick={() => !isLoading && setActiveRole("technician")}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold tracking-wider uppercase rounded-lg transition-all relative select-none cursor-pointer ${
                activeRole === "technician"
                  ? "bg-white text-[#0A2E1A] shadow-xs font-black"
                  : "text-stone-400 hover:text-stone-600"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              <Wrench className={`h-3.5 w-3.5 transition-colors ${activeRole === "technician" ? "text-emerald-700" : ""}`} />
              Technician
            </button>
          </div>

          {/* Interactive Form Controller */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Input Wrapper with elegant focus animations */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">
                Identity Core Email
              </Label>
              <div className="relative group">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-300 group-focus-within:text-emerald-800 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="operator@labflow.com"
                  className="pl-10 h-11 bg-[#FAF9F6]/60 border-stone-200/80 focus:bg-white focus:border-emerald-800 focus-visible:ring-1 focus-visible:ring-emerald-800/30 rounded-xl shadow-inner text-sm text-stone-800 placeholder:text-stone-300 transition-all"
                  disabled={isLoading}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-xs text-red-700 font-medium mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">
                  Security Passcode
                </Label>
                <Link href="/forgot-password" className="text-xs text-stone-400 hover:text-emerald-800 font-medium transition-colors tracking-wide">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-300 group-focus-within:text-emerald-800 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="pl-10 pr-10 h-11 bg-[#FAF9F6]/60 border-stone-200/80 focus:bg-white focus:border-emerald-800 focus-visible:ring-1 focus-visible:ring-emerald-800/30 rounded-xl shadow-inner text-sm text-stone-800 placeholder:text-stone-200 transition-all"
                  disabled={isLoading}
                  {...register("password")}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-stone-300 hover:text-emerald-800 transition-colors select-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-700 font-medium mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember Switch Line */}
            <div className="flex items-center text-xs pt-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer text-stone-400 hover:text-stone-700 transition-colors select-none">
                <input 
                  type="checkbox" 
                  className="rounded border-stone-300 bg-transparent text-emerald-800 focus:ring-emerald-800 h-3.5 w-3.5 accent-emerald-800 cursor-pointer"
                  disabled={isLoading}
                  {...register("rememberMe")}
                />
                Remember operational profile
              </label>
            </div>

            {/* CTA Button Block */}
            <div className="pt-3 space-y-4">
              <Button 
                type="submit" 
                className="w-full h-11 bg-[#0A2E1A] hover:bg-[#124227] text-stone-100 font-bold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-950/10 active:scale-[0.99] cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Initialize Connection
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 stroke-[2.5]" />
                  </>
                )}
              </Button>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-stone-200/60"></div>
                <span className="shrink mx-3 text-[9px] text-stone-400 font-mono tracking-[0.2em] uppercase">Federated Sync</span>
                <div className="grow border-t border-stone-200/60"></div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 bg-transparent hover:bg-stone-50/80 text-stone-600 font-bold text-[10px] tracking-widest uppercase rounded-xl border border-stone-200 transition-all cursor-pointer shadow-2xs"
                disabled={isLoading}
              >
                Single Sign-On (SSO)
              </Button>
            </div>
          </form>

          {/* Registration Trigger Footer */}
          <div className="text-center text-xs text-stone-400 font-light pt-4 border-t border-stone-100">
            Missing access profiles?{" "}
            <Link href="/signup" className="text-emerald-800 hover:text-emerald-600 font-bold transition-colors">
              Request terminal registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}