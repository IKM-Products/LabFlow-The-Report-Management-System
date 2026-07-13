"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { toast } from "sonner";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Phone, ArrowRight, ShieldAlert, Wrench, Eye, EyeOff, FlaskConical } from "lucide-react";

type UserRole = "admin" | "technician";

const signupSchema = zod.object({
  first_name: zod.string().min(2, "First name is required"),
  last_name: zod.string().min(2, "Last name is required"),
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  phone: zod.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone format"),
});

type SignupValues = zod.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>("technician");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { first_name: "", last_name: "", email: "", password: "", phone: "" },
  });

  const onSubmit = async (values: SignupValues) => {
    setIsLoading(true);
    try {
      await axios.post("/api/user/create", { 
        ...values, 
        role_name: `ROLE_${activeRole.toUpperCase()}` 
      });
      toast.success("Account created successfully! Redirecting to credentials gateway...");
      router.push("/login");
    } catch (error: any) {
      console.error("Critical registration process drop:", error);
      toast.error(error.response?.data?.message || "An unexpected error occurred during access registration.");
    } finally {
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
            Join for Precise <br />
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
              Create Account!
            </h2>
            <p className="text-xs text-stone-500 tracking-wide font-light leading-relaxed uppercase">
              Register Your Credentials Below
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Split Row for First and Last Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="first_name" className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 block pl-1">
                  First Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-stone-300 group-focus-within:text-green-700 transition-colors" />
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="John"
                    className="pl-11 h-12 bg-stone-50/50 border-stone-200/80 focus:bg-white focus:border-green-700 focus-visible:ring-4 focus-visible:ring-green-700/10 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 transition-all shadow-xs"
                    disabled={isLoading}
                    {...register("first_name")}
                  />
                </div>
                {errors.first_name && <p className="text-xs text-red-600 font-medium mt-1 pl-1">{errors.first_name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="last_name" className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 block pl-1">
                  Last Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-stone-300 group-focus-within:text-green-700 transition-colors" />
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Doe"
                    className="pl-11 h-12 bg-stone-50/50 border-stone-200/80 focus:bg-white focus:border-green-700 focus-visible:ring-4 focus-visible:ring-green-700/10 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 transition-all shadow-xs"
                    disabled={isLoading}
                    {...register("last_name")}
                  />
                </div>
                {errors.last_name && <p className="text-xs text-red-600 font-medium mt-1 pl-1">{errors.last_name.message}</p>}
              </div>
            </div>

            {/* Email Field Block */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 block pl-1">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-stone-300 group-focus-within:text-green-700 transition-colors" />
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

            {/* Phone Field Block */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 block pl-1">
                Phone Number
              </Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-3.5 h-4 w-4 text-stone-300 group-focus-within:text-green-700 transition-colors" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+977XXXXXXXXXX"
                  className="pl-11 h-12 bg-stone-50/50 border-stone-200/80 focus:bg-white focus:border-green-700 focus-visible:ring-4 focus-visible:ring-green-700/10 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 transition-all shadow-xs"
                  disabled={isLoading}
                  {...register("phone")}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-600 font-medium mt-1 pl-1">{errors.phone.message}</p>}
            </div>

            {/* Password Field Block */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400 block pl-1">
                Password
              </Label>
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

              <div className="flex items-center text-xs font-semibold pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-neutral-500 hover:text-neutral-800 transition-colors select-none">
                  <input type="checkbox" className="rounded-md border-neutral-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 accent-emerald-600 cursor-pointer" required />
                  I agree to the platform&apos;s Terms and Privacy Policy.
                </label>
              </div>

            {/* Submit Action Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-bold text-xs tracking-[0.15em] uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/15 active:scale-[0.99] cursor-pointer group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Secondary Action Link Footer */}
          <div className="text-center text-xs text-stone-400 font-light pt-4 border-t border-stone-100">
            Already have an account?{" "}
            <Link href="/login" className="text-green-700 hover:text-green-800 font-bold transition-colors shadow-xs">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}