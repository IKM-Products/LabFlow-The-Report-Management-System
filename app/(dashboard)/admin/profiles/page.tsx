// app/(dashboard)/admin/profiles/page.tsx

import { ProfileTable } from "@/components/profiles/profile-table";

export default function ProfilesPage() {
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Profiles
        </h1>

        <p className="text-muted-foreground">
          View LabFlow user profiles.
        </p>
      </div>

      <ProfileTable />
    </main>
  );
}