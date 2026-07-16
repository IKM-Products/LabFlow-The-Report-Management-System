"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import {
  signupSchema,
  type SignupFormValues,
} from "@/schemas/auth.schema";

// FIXED: Imports all individual exports as a unified authService object
import * as authService from "@/services/auth.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      role_name: "ROLE_TECHNICIAN",
    },
  });

  async function onSubmit(values: SignupFormValues) {
    try {

      await authService.signup(values);


      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {

    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <Card className="w-full max-w-lg shadow-xl">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">LabFlow</h1>
            <p className="mt-2 text-muted-foreground">
              Create your account
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  First Name
                </label>
                <Input
                  {...register("first_name")}
                  placeholder="First Name"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Last Name
                </label>
                <Input
                  {...register("last_name")}
                  placeholder="Last Name"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>
              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone
              </label>
              <Input
                placeholder="98XXXXXXXX"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Role
              </label>
              <select
                {...register("role_name")}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="ROLE_ADMIN">Administrator</option>
                <option value="ROLE_TECHNICIAN">Technician</option>
              </select>
              {errors.role_name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.role_name.message}
                </p>
              )}
            </div>

            

            
            <Button
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}