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
import { User, Mail, Lock, Phone, ArrowRight, CheckCircle2, ShieldCheck, ShieldAlert } from "lucide-react";

// Updated matching validation strategy for the exact backend API payload mapping keys
const signupSchema = zod.object({
  first_name: zod.string().min(2, "First name must be at least 2 characters long"),
  last_name: zod.string().min(2, "Last name must be at least 2 characters long"),
  email: zod.string().email("Please enter a valid institutional email address"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
  phone: zod.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number format"),
});

type SignupValues = zod.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "technician">("technician");

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
      // Maps configuration data exactly to your expected API payload keys
      await axios.post(
        "/api/user/create", 
        {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          phone: values.phone,
          role_name: `ROLE_${selectedRole.toUpperCase()}`,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Successfully triggered Sonner notification banner
      toast.success(`Success! Registered completely as ${selectedRole === "admin" ? "an Admin" : "a Technician"}.`);
      
      // Safe routing without triggering unconfigured NextAuth paths
      router.push("/login");
      
    } catch (error: any) {
      console.error("Signup network chain failure status:", error.response?.status);
      console.error("Signup network chain failure data:", error.response?.data);

      let errorMsg = "Registration sequence dropped. Check network configuration.";
      
      // Safely parse out nested error strings returned from your local route proxy
      if (error.response?.data?.message) {
        try {
          const parsedData = JSON.parse(error.response.data.message);
          if (parsedData.messages && parsedData.messages.length > 0) {
            errorMsg = parsedData.messages[0];
          }
        } catch {
          errorMsg = error.response.data.message;
        }
      }

      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-[#062315] via-[#0b3a22] to-[#125835] p-4 sm:p-6 md:p-12 font-sans selection:bg-emerald-100 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] h-225 w-225 rounded-full bg-emerald-400/12 blur-[160px] pointer-events-none animate-pulse duration-8000" />
      <div className="absolute bottom-[-20%] right-[-20%] h-225 w-225 rounded-full bg-teal-300/8 blur-[160px] pointer-events-none animate-pulse duration-6000" />

      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(4,28,16,0.3)] overflow-hidden flex flex-col md:flex-row min-h-160 relative z-10 border border-emerald-950/5">
        <div className="w-full md:w-[45%] bg-linear-to-b from-[#0e9352] to-[#085a32] p-10 sm:p-12 md:p-14 flex flex-col justify-between relative overflow-hidden text-white min-h-95 md:min-h-auto">
          <div className="absolute top-[-10%] right-[-15%] w-95 h-95 rounded-full bg-linear-to-br from-[#0a7e45] to-[#054b29] shadow-inner opacity-95 pointer-events-none transition-transform duration-700 hover:scale-105" />
          <div className="absolute bottom-[-12%] left-[-12%] w-70 h-70 rounded-full bg-linear-to-tr from-[#11c26d] to-[#0b834a] shadow-lg opacity-30 pointer-events-none" />
          <div className="absolute bottom-[10%] right-[5%] w-47.5 h-47.5 rounded-full bg-linear-to-b from-[#14e281]/90 via-[#0cbd6a] to-[#076839] shadow-2xl shadow-emerald-950/50 pointer-events-none" />

          <div className="flex items-center gap-4 relative z-20 group cursor-default">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#085a32] border border-emerald-100 shadow-md relative transition-transform duration-500 group-hover:scale-105">
              <svg className="w-5.5 h-5.5 text-emerald-600 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" className="animate-[dash_2.5s_linear_infinite]" style={{ strokeDasharray: "50", strokeDashoffset: "0" }} />
              </svg>
              <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-[ping_1.6s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-[0.2em] font-serif italic bg-clip-text bg-linear-to-r from-white to-emerald-100">LabFlow</span>
              <span className="text-[9px] font-sans font-bold tracking-[0.25em] text-emerald-200/70 uppercase">Platform</span>
            </div>
          </div>

          <div className="relative z-20 my-auto space-y-8 pt-10 md:pt-0">
            <div className="space-y-4">
              <h1 className="text-3xl xl:text-4xl font-serif font-normal italic tracking-tight text-white leading-tight">
                Join for Precise <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-emerald-50 to-emerald-200 font-serif font-extrabold not-italic drop-shadow-md">Report Management.</span>
              </h1>
              <p className="justify-center text-emerald-50/75 text-sm font-sans font-light leading-relaxed max-w-[92%] tracking-wide">
                Simplify laboratory documentation with seamless report submissions, centralized management, and real-time workflow tracking.
              </p>
            </div>
            <div className="space-y-3 pt-6 border-t border-white/15 max-w-[85%]">
              <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-emerald-50/90"><CheckCircle2 className="h-4 w-4 text-emerald-300 stroke-[2.5] shrink-0" /> Paperless Laboratory Management</div>
              <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-emerald-50/90"><CheckCircle2 className="h-4 w-4 text-emerald-300 stroke-[2.5] shrink-0" /> Centralized Report Repository</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[10px] font-sans tracking-[0.2em] text-emerald-100/60 font-bold uppercase relative z-20 mt-6 md:mt-0">
            <ShieldCheck className="h-4 w-4 text-emerald-300 animate-pulse" /> NHRC Certified
          </div>
        </div>

        <div className="w-full md:w-[55%] p-8 sm:p-12 md:p-16 flex flex-col justify-between bg-white relative max-h-screen overflow-y-auto">
          <div className="absolute -bottom-7.5 -right-7.5 w-37.5 h-37.5 rounded-full bg-emerald-50/60 pointer-events-none hidden md:block" />

          <div className="max-w-md w-full mx-auto my-auto space-y-7 relative z-10">
            <div className="space-y-1.5">
              <h2 className="text-3xl font-normal font-serif italic text-neutral-900 tracking-tight">Create Account!</h2>
              <p className="text-[11px] font-sans font-bold text-neutral-400 tracking-widest uppercase">Register Your Credentials Below</p>
            </div>

            <div className="grid grid-cols-2 p-1 bg-neutral-100/80 rounded-xl border border-neutral-200/40">
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all select-none ${selectedRole === "admin" ? "bg-white text-emerald-700 shadow-sm border border-neutral-200/30" : "text-neutral-400 hover:text-neutral-600"}`}
              >
                <ShieldAlert className="h-3.5 w-3.5" /> Admin
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("technician")}
                className={`py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all select-none ${selectedRole === "technician" ? "bg-white text-emerald-700 shadow-sm border border-neutral-200/30" : "text-neutral-400 hover:text-neutral-600"}`}
              >
                <User className="h-3.5 w-3.5" /> Technician
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name" className="text-xs font-sans font-bold tracking-wide text-neutral-500">First Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 h-4 w-4 text-neutral-300 group-focus-within:text-[#0a7e45] transition-colors stroke-2" />
                    <Input id="first_name" type="text" placeholder="John" disabled={isLoading} className="pl-12 h-12 bg-neutral-50 border-neutral-200/70 focus:bg-white focus:border-emerald-600 focus-visible:ring-0 rounded-xl font-sans text-sm tracking-wide text-neutral-800 placeholder:text-neutral-400 transition-all shadow-sm" {...register("first_name")} />
                  </div>
                  {errors.first_name && <p className="text-xs text-destructive font-semibold mt-1">{errors.first_name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="last_name" className="text-xs font-sans font-bold tracking-wide text-neutral-500">Last Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 h-4 w-4 text-neutral-300 group-focus-within:text-[#0a7e45] transition-colors stroke-2" />
                    <Input id="last_name" type="text" placeholder="Doe" disabled={isLoading} className="pl-12 h-12 bg-neutral-50 border-neutral-200/70 focus:bg-white focus:border-emerald-600 focus-visible:ring-0 rounded-xl font-sans text-sm tracking-wide text-neutral-800 placeholder:text-neutral-400 transition-all shadow-sm" {...register("last_name")} />
                  </div>
                  {errors.last_name && <p className="text-xs text-destructive font-semibold mt-1">{errors.last_name.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-sans font-bold tracking-wide text-neutral-500">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-neutral-300 group-focus-within:text-[#0a7e45] transition-colors stroke-2" />
                  <Input id="email" type="email" placeholder="labflow@gmail.com" disabled={isLoading} className="pl-12 h-12 bg-neutral-50 border-neutral-200/70 focus:bg-white focus:border-emerald-600 focus-visible:ring-0 rounded-xl font-sans text-sm tracking-wide text-neutral-800 placeholder:text-neutral-400 transition-all shadow-sm" {...register("email")} />
                </div>
                {errors.email && <p className="text-xs text-destructive font-semibold mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-sans font-bold tracking-wide text-neutral-500">Phone Number</Label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-3.5 h-4 w-4 text-neutral-300 group-focus-within:text-[#0a7e45] transition-colors stroke-2" />
                  <Input id="phone" type="tel" placeholder="+97798XXXXXXXX" disabled={isLoading} className="pl-12 h-12 bg-neutral-50 border-neutral-200/70 focus:bg-white focus:border-emerald-600 focus-visible:ring-0 rounded-xl font-sans text-sm tracking-wide text-neutral-800 placeholder:text-neutral-400 transition-all shadow-sm" {...register("phone")} />
                </div>
                {errors.phone && <p className="text-xs text-destructive font-semibold mt-1">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-sans font-bold tracking-wide text-neutral-500">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-neutral-300 group-focus-within:text-[#0a7e45] transition-colors stroke-2" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••••••" disabled={isLoading} className="pl-12 pr-16 h-12 bg-neutral-50 border-neutral-200/70 focus:bg-white focus:border-emerald-600 focus-visible:ring-0 rounded-xl font-sans text-sm transition-all text-neutral-800 placeholder:text-neutral-300 shadow-sm" {...register("password")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-[10px] font-black text-neutral-400 hover:text-[#0a7e45] uppercase tracking-widest transition-colors select-none">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive font-semibold mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center text-xs font-semibold pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-neutral-500 hover:text-neutral-800 transition-colors select-none">
                  <input type="checkbox" className="rounded-md border-neutral-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 accent-emerald-600 cursor-pointer" required />
                  I agree to the platform&apos;s Terms and Privacy Policy.
                </label>
              </div>

              <Button type="submit" className="w-full h-12 mt-2 bg-[#00a365] hover:bg-[#008f58] text-white font-sans font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 group shadow-md shadow-emerald-950/10 active:scale-[0.98]" disabled={isLoading}>
                {isLoading ? (
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign Up as {selectedRole === "admin" ? "Admin" : "Technician"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 stroke-[2.5]" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-2 text-xs text-neutral-400 font-semibold">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
      `}</style>
    </div>
  );
}