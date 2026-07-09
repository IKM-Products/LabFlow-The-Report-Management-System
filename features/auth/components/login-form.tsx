"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";

const loginSchema = zod.object({
  email: zod.string().email("Please enter a valid institutional email address"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
});

type LoginValues = zod.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      setIsLoading(true);
      
      const response = await apiClient<{ token: string; user: { role: string; name: string } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });

      // Save credentials secure context locally
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success(`Welcome back, ${response.user.name}!`);
      
      // Dynamic operational matrix rerouting based on clinical access tier role
      if (response.user.role === "technician") {
        router.push("/results");
      } else {
        router.push("/orders");
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Invalid authentication credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">LabFlow Portal</CardTitle>
        <CardDescription>Enter your laboratory operational credentials to sign in</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@labflow.com"
              disabled={isLoading}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive mt-0.5">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive mt-0.5">{form.formState.errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Verifying Authorization..." : "Sign In to Workspace"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}