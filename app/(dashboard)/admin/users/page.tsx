// app/(dashboard)/admin/users/page.tsx

import { SignupForm } from "@/components/auth/signup-form";

export default function UsersPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Create User
        </h1>

        <p className="text-muted-foreground">
          Register an administrator or technician.
        </p>
      </div>

      <SignupForm />
    </main>
  );
}