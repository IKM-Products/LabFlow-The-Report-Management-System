"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

// Matching tracking items from your dbdiagram schemas
interface ResultOrder {
  id: number;
  patient_name: string;
  test_name: string;
  status: "sample_collected" | "completed" | string;
  updated_at: string;
  sample_type: string;
}

export default function ResultsPage() {
  const [orders, setOrders] = useState<ResultOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadResultsQueue() {
      try {
        setIsLoading(true);
        // Fetches processed workflow data matching clinical needs
        const data = await apiClient<ResultOrder[]>("/orders?has_samples=true");
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to load laboratory queue.");
      } finally {
        setIsLoading(false);
      }
    }
    loadResultsQueue();
  }, []);

  // Filter matrix handling execution
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery) ||
      order.test_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Result Entry & Verification</h1>
        <p className="text-sm text-muted-foreground">Input parameters, verify value counts, and process data reports</p>
      </div>

      {/* Control Pipeline Layer */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by ID, patient name, or test..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
          >
            <option value="all">All Queue Statuses</option>
            <option value="sample_collected">Awaiting Entry</option>
            <option value="completed">Completed / Verified</option>
          </select>
        </div>
      </div>

      {/* Laboratory Work Desk Layout List */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-muted-foreground font-medium">
                <th className="p-4">Order ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Test Profile</th>
                <th className="p-4">Specimen Type</th>
                <th className="p-4">Last Event Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No active samples awaiting entry processing located.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-xs text-primary">#{order.id}</td>
                    <td className="p-4 font-medium">{order.patient_name}</td>
                    <td className="p-4">{order.test_name}</td>
                    <td className="p-4 text-muted-foreground capitalize">{order.sample_type}</td>
                    <td className="p-4">{new Date(order.updated_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {order.status === "completed" ? "Verified" : "Awaiting Entry"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/results/entry/${order.id}`}
                        className={`inline-block text-sm font-semibold rounded px-3 py-1.5 transition-colors ${
                          order.status === "completed"
                            ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        {order.status === "completed" ? "Review Report" : "Enter Values"}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}