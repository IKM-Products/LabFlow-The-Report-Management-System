// app/(auth)/signup/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle, Eye, EyeOff, CheckCircle2, FlaskConical, ChevronDown } from "lucide-react";
import * as z from "zod";
import Link from "next/link";

const SignupSchema = z.object({
  email: z.string().trim().min(1, "Email address is required.").pipe(z.email("Please enter a valid email address.")),
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  role_name: z.enum(["ROLE_USER", "ROLE_TECHNICIAN", "ROLE_ADMIN"], {
    message: "Please select a valid role.",
  }),
  terms: z.literal(true, { error: "Please accept the Terms and Conditions to continue." }),
});

type FormData = z.infer<typeof SignupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      role_name: "ROLE_USER",
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setGlobalErrors([]);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        setGlobalErrors([result.message || "Failed to create the account."]);
        setIsLoading(false);
      } else {
        setIsSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setGlobalErrors(["Failed to sign-up. Please try again."]);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      
      {/* Left Column: Dark Green Brand Display Panel */}
      <div className="bg-[#051610] p-8 sm:p-12 md:p-16 flex flex-col justify-between relative overflow-hidden text-white min-h-125 lg:min-h-screen">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <div className="w-125 h-125 border border-emerald-500 rounded-full absolute" />
          <div className="w-175 h-175 border border-emerald-500 rounded-full absolute" />
        </div>

        <p className="text-xs font-normal italic text-emerald-500/80 tracking-wide relative z-10 max-w-xs">
          Empowering healthcare through fast, precise lab reporting.
        </p>

        <div className="my-auto space-y-12 relative z-10 flex flex-col items-center lg:items-start w-full">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.1] text-center lg:text-left">
            Manage <br /> your reports
          </h1>
          
          <div className="w-64 h-340px bg-[#030d0a] rounded-[36px] border-[6px] border-[#0e271f] shadow-2xl overflow-hidden p-4 flex flex-col justify-between relative transform rotate-[-4deg] hover:rotate-0 transition-transform duration-500 origin-bottom">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-center" />
            
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center text-[9px] text-emerald-500/60 font-medium">
                <span>Report Analytics</span>
                <div className="w-2.5 h-2.5 bg-emerald-950 rounded-full flex items-center justify-center text-[7px] text-emerald-400">i</div>
              </div>

              <div>
                <p className="text-xl font-semibold text-white tracking-tight">98.4 <span className="text-xs font-normal text-emerald-400">%</span></p>
                <p className="text-[8px] text-emerald-500/60 mt-0.5">Throughput Efficiency Rate</p>
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

            <div className="flex justify-between items-center border-t border-emerald-950 pt-2 text-emerald-800 px-2 text-[10px]">
              <span>⌂</span>
              <div className="w-4 h-4 rounded-full border border-emerald-500" />
              <span>⚙</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between mt-6 lg:mt-0">
          <div className="w-5 h-5 rounded-full border border-emerald-500 flex items-center justify-center text-[9px] font-bold text-emerald-500 opacity-80">
            LF
          </div>
        </div>
      </div>

      {/* Right Column: Form Area */}
      <div className="p-8 sm:p-12 md:p-16 flex flex-col justify-between bg-white w-full lg:min-h-screen">
        
        <div className="flex items-center justify-between w-full mb-8 lg:mb-12">
          <div className="flex items-center gap-3 cursor-pointer select-none group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
              <div className="absolute inset-0 rounded-xl bg-emerald-400/40 blur-md animate-pulse" />
              <FlaskConical className="relative w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 animate-bounce" />
            </div>

            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              LabFlow
            </span>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">Create Account!</h2>
          </div>

          {globalErrors.length > 0 && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex gap-3 items-start animate-fade-in">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-rose-950">Secure Sign-Up to LabFlow</p>
                <ul className="list-none text-[11px] text-rose-700 font-medium space-y-0.5">
                  {globalErrors.map((msg, i) => (
                    <li key={i}>{msg}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3 items-start animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-emerald-950">Account created successfully!</p>
                <p className="text-[11px] text-emerald-700 font-medium">Redirecting to the signin page...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  {...register("first_name")}
                  disabled={isLoading || isSuccess}
                  placeholder="First Name"
                  className="w-full h-13 px-6 text-sm font-medium rounded-full border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all disabled:opacity-60 bg-white"
                />
                {errors.first_name && <p className="text-[10px] text-rose-600 font-semibold px-4 mt-0.5">{errors.first_name.message}</p>}
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  {...register("last_name")}
                  disabled={isLoading || isSuccess}
                  placeholder="Last Name"
                  className="w-full h-13 px-6 text-sm font-medium rounded-full border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all disabled:opacity-60 bg-white"
                />
                {errors.last_name && <p className="text-[10px] text-rose-600 font-semibold px-4 mt-0.5">{errors.last_name.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <input
                type="email"
                {...register("email")}
                disabled={isLoading || isSuccess}
                placeholder="Email"
                className="w-full h-13 px-6 text-sm font-medium rounded-full border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all disabled:opacity-60 bg-white"
              />
              {errors.email && <p className="text-[10px] text-rose-600 font-semibold px-4 mt-0.5">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="tel"
                  {...register("phone")}
                  disabled={isLoading || isSuccess}
                  placeholder="Phone Number"
                  className="w-full h-13 px-6 text-sm font-medium rounded-full border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all disabled:opacity-60 bg-white"
                />
                {errors.phone && <p className="text-[10px] text-rose-600 font-semibold px-4 mt-0.5">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1 relative">
                <select
                  {...register("role_name")}
                  disabled={isLoading || isSuccess}
                  className="w-full h-13 pl-6 pr-12 text-sm font-medium rounded-full border border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all disabled:opacity-60 bg-white cursor-pointer appearance-none"
                >
                  <option value="ROLE_USER">Select Your Role</option>
                  <option value="ROLE_TECHNICIAN">Technician</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
                {errors.role_name && <p className="text-[10px] text-rose-600 font-semibold px-4 mt-0.5">{errors.role_name.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  disabled={isLoading || isSuccess}
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

            <div className="space-y-1 pt-1">
              <div className="flex items-start gap-3 px-4">
                <input
                  id="terms"
                  type="checkbox"
                  {...register("terms")}
                  disabled={isLoading || isSuccess}
                  className="w-4 h-4 mt-0.5 text-emerald-600 border-slate-200 rounded-sm focus:ring-emerald-500 outline-none transition-all disabled:opacity-60 bg-white cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs font-medium text-slate-500 select-none cursor-pointer">
                  I agree to the platform's{" "}
                  <Link href="/terms" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {errors.terms && <p className="text-[10px] text-rose-600 font-semibold px-4 mt-0.5">{errors.terms.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full h-13 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:opacity-95 text-white font-semibold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading your profile...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                </>
              )}
            </button>

            <div className="text-center text-xs font-medium text-slate-500 mt-4">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium text-slate-400 pt-8 border-t border-slate-100 gap-4 w-full mt-6">
          <span>© 2026 LabFlow Inc.</span>
        </div>

      </div>

    </div>
  );
}