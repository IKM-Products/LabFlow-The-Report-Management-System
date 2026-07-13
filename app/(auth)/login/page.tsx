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
import { User, Lock, ArrowRight, CheckCircle2, ShieldCheck, ShieldAlert, Wrench } from "lucide-react";

type UserRole = "admin" | "technician";

// Login structural criteria validation schema
const loginSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(1, "Password is required"),
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
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);

    try {
      // Execute the credentials login sequence using NextAuth
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        role: activeRole,
        redirect: false, // Prevents NextAuth from navigating away unexpectedly
      });

      if (res?.error) {
        console.error("Login verification framework dropped status:", res.error);
        toast.error(res.error || "Authentication failed. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      // CRITICAL FIX: Fetch the actual verified session profile directly from the authentication context
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      
      // Extract the ground-truth role configuration assigned by your database model
      const trueUserRole = session?.user?.role?.toLowerCase() || activeRole;

      toast.success("Authentication sequence authorized! Redirecting...");
      localStorage.setItem("userRole", trueUserRole);

      // Branch application workspaces safely by utilizing verified token definitions
      if (trueUserRole === "admin") {
        router.push("/admin");
      } else if (trueUserRole === "technician") {
        router.push("/technician");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Critical login process drop:", error);
      toast.error("An unexpected error occurred during access validation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-[#062315] via-[#0b3a22] to-[#125835] p-4 sm:p-6 md:p-12 font-sans selection:bg-emerald-100 relative overflow-hidden">
      
      {/* Premium Kinetic Mesh Radial Glow Overlays */}
      <div className="absolute top-[-20%] left-[-20%] h-225 w-225 rounded-full bg-emerald-400/12 blur-[160px] pointer-events-none animate-pulse duration-8000" />
      <div className="absolute bottom-[-20%] right-[-20%] h-225 w-225 rounded-full bg-teal-300/8 blur-[160px] pointer-events-none animate-pulse duration-6000" />

      {/* Main Structural Layout Card */}
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(4,28,16,0.3)] overflow-hidden flex flex-col md:flex-row min-h-160 relative z-10 border border-emerald-950/5">
        
        {/* LEFT PANEL: Geometric Green Canvas with Premium Editorial Typography */}
        <div className="w-full md:w-[45%] bg-linear-to-b from-[#0e9352] to-[#085a32] p-10 sm:p-12 md:p-14 flex flex-col justify-between relative overflow-hidden text-white min-h-95 md:min-h-auto">
          
          {/* Overlapping Organic Geometric Spheres with Smooth Backdrop Gradients */}
          <div className="absolute top-[-10%] right-[-15%] w-95 h-95 rounded-full bg-linear-to-br from-[#0a7e45] to-[#054b29] shadow-inner opacity-95 pointer-events-none transition-transform duration-700 hover:scale-105" />
          <div className="absolute bottom-[-12%] left-[-12%] w-70 h-70 rounded-full bg-linear-to-tr from-[#11c26d] to-[#0b834a] shadow-lg opacity-30 pointer-events-none" />
          <div className="absolute bottom-[10%] right-[5%] w-47.5 h-47.5 rounded-full bg-linear-to-b from-[#14e281]/90 via-[#0cbd6a] to-[#076839] shadow-2xl shadow-emerald-950/50 pointer-events-none" />

          {/* Top Segment: Brand Logo with LIVE, Active Breathing Telemetry Wave */}
          <div className="flex items-center gap-4 relative z-20 group cursor-default">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#085a32] border border-emerald-100 shadow-md relative transition-transform duration-500 group-hover:scale-105">
              
              {/* Animated Live Heartbeat Waveform SVG */}
              <svg
                className="w-5.5 h-5.5 text-emerald-600 relative z-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path 
                  d="M22 12h-4l-3 9L9 3l-3 9H2" 
                  className="animate-[dash_2.5s_linear_infinite]"
                  style={{
                    strokeDasharray: '50',
                    strokeDashoffset: '0'
                  }}
                />
              </svg>

              {/* Multi-layered live ring ripples */}
              <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-[ping_1.6s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-[0.2em] font-serif italic bg-clip-text bg-linear-to-r from-white to-emerald-100">
                LabFlow
              </span>
              <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-emerald-200/70 uppercase">
                Platform
              </span>
            </div>
          </div>

          {/* Central Segment: Main Editorial Copy and Verification Checklist */}
          <div className="relative z-20 my-auto space-y-8 pt-10 md:pt-0">
            <div className="space-y-4">
              <h1 className="text-3xl xl:text-4xl font-serif font-normal italic tracking-tight text-white leading-tight">
                Built for Precise <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-emerald-50 to-emerald-200 font-serif font-extrabold not-italic drop-shadow-md">
                  Report Management.
                </span>
              </h1>
              <p className="justify-center text-emerald-50/75 text-sm font-sans font-light leading-relaxed max-w-[92%] tracking-wide">
                Simplify laboratory documentation with seamless report submissions, centralized management, and real-time workflow tracking.
              </p>
            </div>
            
            {/* Fine-line Checklist Feature Group */}
            <div className="space-y-3 pt-6 border-t border-white/15 max-w-[85%]">
              <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-emerald-50/90">
                <CheckCircle2 className="h-4 w-4 text-emerald-300 stroke-[2.5] shrink-0" /> Paperless Laboratory Management
              </div>
              <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-emerald-50/90">
                <CheckCircle2 className="h-4 w-4 text-emerald-300 stroke-[2.5] shrink-0" /> Centralized Report Repository
              </div>
            </div>
          </div>

          {/* Bottom Segment: Compliance Certification Seal */}
          <div className="flex items-center gap-2.5 text-[10px] font-sans tracking-[0.2em] text-emerald-100/60 font-bold uppercase relative z-20 mt-6 md:mt-0">
            <ShieldCheck className="h-4 w-4 text-emerald-300 animate-pulse" /> NHRC Certified
          </div>
        </div>

        {/* RIGHT PANEL: Crisp White Minimal Presentation Form Screen */}
        <div className="w-full md:w-[55%] p-8 sm:p-12 md:p-16 flex flex-col justify-between bg-white relative">
          
          {/* Decorative Corner Light Ring */}
          <div className="absolute -bottom-7.5 -right-7.5 w-37.5 h-37.5 rounded-full bg-emerald-50/60 pointer-events-none hidden md:block" />

          <div className="max-w-sm w-full mx-auto my-auto space-y-7 relative z-10">
            
            {/* Header Content Hierarchy */}
            <div className="space-y-1.5">
              <h2 className="text-3xl font-normal font-serif italic text-neutral-900 tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-[11px] font-sans font-bold text-neutral-400 tracking-widest uppercase transition-all duration-300">
                Enter Your Credentials Below
              </p>
            </div>

            {/* Binary Switcher Framework strictly formatted for 2 roles */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100/80 rounded-xl border border-neutral-200/40 text-center">
              <button
                type="button"
                onClick={() => setActiveRole("admin")}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold font-sans tracking-wide rounded-lg transition-all select-none cursor-pointer ${
                  activeRole === "admin"
                    ? "bg-white text-[#0a7e45] shadow-xs"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5 stroke-[2.5]" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => setActiveRole("technician")}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold font-sans tracking-wide rounded-lg transition-all select-none cursor-pointer ${
                  activeRole === "technician"
                    ? "bg-white text-[#0a7e45] shadow-xs"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                <Wrench className="h-3.5 w-3.5 stroke-[2.5]" />
                Technician
              </button>
            </div>

            {/* Main Interactive Input Fields Framework */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5">
              
              {/* Username Input Field */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs font-sans font-bold tracking-wide text-neutral-500">
                  Email Address
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-neutral-300 group-focus-within:text-[#0a7e45] transition-colors stroke-2" />
                  <Input
                    id="username"
                    type="email"
                    placeholder="labflow@gmail.com"
                    className="pl-12 h-12 bg-neutral-50 border-neutral-200/70 focus:bg-white focus:border-emerald-600 focus-visible:ring-0 rounded-xl font-sans text-sm tracking-wide text-neutral-800 placeholder:text-neutral-400 transition-all shadow-sm"
                    disabled={isLoading}
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive font-semibold mt-1">{errors.email.message}</p>}
              </div>

              {/* Password Input Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-sans font-bold tracking-wide text-neutral-500">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors tracking-wide">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-neutral-300 group-focus-within:text-[#0a7e45] transition-colors stroke-2" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="pl-12 pr-16 h-12 bg-neutral-50 border-neutral-200/70 focus:bg-white focus:border-emerald-600 focus-visible:ring-0 rounded-xl font-sans text-sm transition-all text-neutral-800 placeholder:text-neutral-300 shadow-sm"
                    disabled={isLoading}
                    {...register("password")}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-[10px] font-black text-neutral-400 hover:text-[#0a7e45] uppercase tracking-widest transition-colors select-none cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive font-semibold mt-1">{errors.password.message}</p>}
              </div>

              {/* Utility Feature Layout Layer */}
              <div className="flex items-center text-xs font-semibold pt-1.5">
                <label className="flex items-center gap-2.5 cursor-pointer text-neutral-500 hover:text-neutral-800 transition-colors select-none">
                  <input 
                    type="checkbox" 
                    className="rounded-md border-neutral-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 accent-emerald-600 cursor-pointer"
                  />
                  Remember Me
                </label>
              </div>

              {/* Action Button: Vibrant Jade Green Submit Trigger */}
              <Button 
                type="submit" 
                className="w-full h-12 mt-3 bg-[#00a365] hover:bg-[#008f58] text-white font-sans font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 group shadow-md shadow-emerald-950/10 active:scale-[0.98] cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In as {activeRole === "admin" ? "Admin" : "Technician"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 stroke-[2.5]" />
                  </>
                )}
              </Button>

              {/* Elegant Accent Splitter Divider */}
              <div className="relative flex py-2.5 items-center">
                <div className="grow border-t border-neutral-100"></div>
                <span className="shrink mx-4 text-[10px] text-neutral-400 font-extrabold uppercase tracking-[0.25em]">Or</span>
                <div className="grow border-t border-neutral-100"></div>
              </div>

              {/* Outlined Secondary Sign-In Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-white hover:bg-neutral-50 text-neutral-700 font-sans font-bold text-sm rounded-xl border border-neutral-200 transition-all active:scale-[0.99] shadow-sm cursor-pointer"
              >
                Sign In With Other Accounts
               </Button>
            </form>

            {/* Sign Up Redirect Text */}
            <div className="text-center pt-2 text-xs text-neutral-400 font-semibold">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded CSS Keyframes for custom stroke heartbeat loop animation */}
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </div>
  );
}