"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertTriangle, FlaskConical, ArrowLeft } from "lucide-react";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { ForgotPasswordSchema } from "@/schemas/auth.schema";

const ForgotPasswordFormSchema = ForgotPasswordSchema.extend({
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Please confirm you’re authorized to reset the password.",
  }),
});

type FormData = z.infer<typeof ForgotPasswordFormSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setGlobalErrors([]);
    try {
      const response: any = await authService.forgotPassword({
        email: data.email,
      });

      if (response?.success || response?.status === 200 || response?.data) {
        const otpCode =
          response?.otp ||
          response?.data?.otp ||
          response?.code ||
          response?.data?.code ||
          "123456";

        toast.success(`Your Password Reset OTP is: ${otpCode}`, {
          duration: 8000,
        });

        router.push(
          `/reset-password?email=${encodeURIComponent(data.email)}&otp=${encodeURIComponent(otpCode)}`
        );
      } else {
        setGlobalErrors(["Failed to forget password. Please try again."]);
      }
    } catch (err: any) {
      const apiMessages = err?.response?.data?.messages;
      if (Array.isArray(apiMessages) && apiMessages.length > 0) {
        setGlobalErrors(apiMessages);
      } else if (err?.response?.data?.message) {
        setGlobalErrors([err.response.data.message]);
      } else {
        setGlobalErrors(["Password reset failed while processing the request."]);
      }
    } finally {
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
                <div className="w-2.5 h-2.5 bg-emerald-950 rounded-full flex items-center justify-center text-[7px] text-emerald-400">
                  i
                </div>
              </div>

              {/* Lab Efficiency Widget */}
              <div>
                <p className="text-xl font-semibold text-white tracking-tight">
                  98.4 <span className="text-xs font-normal text-emerald-400">%</span>
                </p>
                <p className="text-[8px] text-emerald-500/60 mt-0.5">
                  Throughput Efficiency Rate
                </p>
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
                <p className="text-[9px] text-emerald-500/75 uppercase tracking-wider font-bold">
                  Diagnostics
                </p>
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
          <div className="space-y-2">
            <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">Forgot Password!</h2>
          </div>

          {globalErrors.length > 0 && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3 items-start animate-fade-in">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-rose-950">Password Reset Request Failed</p>
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
              {errors.email && (
                <p className="text-[10px] text-rose-600 font-semibold px-4 mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-3 pt-1">
              {/* Required Security Checkbox Field */}
              <div className="space-y-1">
                <div className="flex items-start gap-2 px-4">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    {...register("acceptTerms")}
                    disabled={isLoading}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer disabled:opacity-60 shrink-0 mt-0.5"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-xs font-medium text-slate-500 cursor-pointer select-none disabled:opacity-60"
                  >
                    I confirm that I am authorized to reset the password for this account.
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-[10px] text-rose-600 font-semibold px-4 mt-0.5">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Configuration Pill Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 text-white font-semibold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Preparing your password reset...</span>
                </>
              ) : (
                <span>Send Reset Code</span>
              )}
            </button>
          </form>

          {/* Return Navigation Anchor Link Context */}
          <div className="text-center text-xs font-medium text-slate-500 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>

        {/* Structural Design Form Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium text-slate-400 pt-8 border-t border-slate-100 gap-4 w-full">
          <span>© 2026 LabFlow Inc.</span>
        </div>
      </div>
    </div>
  );
}