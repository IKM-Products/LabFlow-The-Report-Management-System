export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm"><h3 className="font-semibold text-muted-foreground text-sm">Active Patients</h3><p className="text-2xl font-bold mt-2">--</p></div>
        <div className="rounded-xl border bg-card p-6 shadow-sm"><h3 className="font-semibold text-muted-foreground text-sm">Pending Orders</h3><p className="text-2xl font-bold mt-2">--</p></div>
        <div className="rounded-xl border bg-card p-6 shadow-sm"><h3 className="font-semibold text-muted-foreground text-sm">Completed Reports</h3><p className="text-2xl font-bold mt-2">--</p></div>
      </div>
    </div>
  );
}