"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, FlaskConical } from "lucide-react";

const forgotPasswordSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = zod.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsLoading(true);
    // Simulate API verification call matching login/signup timing
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Recovery instructions transmitted successfully!");
    }, 1200);
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
            Recover for Precise <br />
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
              Reset Password!
            </h2>
            <p className="text-xs text-stone-500 tracking-wide font-light leading-relaxed uppercase">
              Recover your account access
            </p>
          </div>

          {/* Form Controller Sequence */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <p className="text-xs text-stone-400 font-light leading-relaxed tracking-wide">
                Enter your registered email below. We will send you a link to reset your password.
              </p>

              {/* Email Field Block */}
              <div className="space-y-2">
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

              {/* Submit Trigger Button */}
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
                      Send Reset Link
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 animate-in fade-in duration-500">
              {/* Submission State Box */}
              <div className="p-5 bg-emerald-50/60 border border-emerald-100/50 text-stone-700 rounded-2xl text-xs font-light leading-relaxed tracking-wide flex items-start gap-3.5 shadow-xs">
                <CheckCircle2 className="h-5 w-5 text-green-700 stroke-[2.5] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-green-900 block mb-1 uppercase tracking-wider text-[10px]">Check your inbox!</strong>
                  A secure cryptographic access recovery package has been dispatched to your validated destination configuration.
                </div>
              </div>
            </div>
          )}

          {/* Secondary Action Navigation Footer */}
          <div className="text-center text-xs text-stone-400 font-light pt-4 border-t border-stone-100">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 text-green-700 hover:text-green-800 font-bold transition-colors group">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 stroke-[2.5]" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}