"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = zod.object({
  username: zod.string().min(1, "Username is required"),
  password: zod.string().min(4, "Password must be at least 4 characters"),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Integration checkpoint with your company's API endpoint:
      // const response = await apiClient<{ user: User; token: string }>("/auth/login", { method: "POST", body: JSON.stringify(data) });
      
      // Mock validation matching the schema attributes for instant testing
      const mockUser = {
        id: 1,
        full_name: "Admin User",
        username: data.username,
        email: "admin@labflow.com",
        role_name: "Admin",
        is_active: true
      };
      
      setAuth(mockUser, "mock-jwt-token");
      router.replace("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-muted/30">
      <div className="w-full max-w-md border bg-card text-card-foreground shadow-sm rounded-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome to LabFlow</h1>
          <p className="text-sm text-muted-foreground">Sign in to your lab ecosystem portal</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Username</label>
            <input 
              {...register("username")}
              className="w-full border rounded px-3 py-2 text-sm bg-background" 
              placeholder="Enter your username"
            />
            {errors.username && <p className="text-xs text-destructive mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <input 
              type="password" 
              {...register("password")}
              className="w-full border rounded px-3 py-2 text-sm bg-background" 
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full rounded bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}