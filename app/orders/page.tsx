"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

// Matching schema attributes for order_items and joined relations
interface OrderItem {
  id: number;
  visit_id: number;
  test_id?: number;
  panel_id?: number;
  test_name: string; // Compiled on backend or mapped via joined test_catalog/panels
  status: "pending" | "sample_collected" | "completed" | string;
  price: number;
  sample_collected_by?: string;
  ordered_at: string;
  patient_name: string; // From joined patients relation via visits
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        const data = await apiClient<OrderItem[]>("/orders");
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to load laboratory orders.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Filter matrix logic execution
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery) ||
      order.test_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "sample_collected":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laboratory Orders</h1>
          <p className="text-sm text-muted-foreground">Monitor tracking streams, samples collection, and billing states</p>
        </div>
        <Link
          href="/orders/create"
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors text-center"
        >
          + Create New Order
        </Link>
      </div>

      {/* Filter and Query Pipeline Control Layer */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search order ID, patient, or test..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
          />
        </div>
        <div className="w-full sm:w-1/4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
          >
            <option value="all">All Tracking Statuses</option>
            <option value="pending">Pending Sample</option>
            <option value="sample_collected">Sample Collected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Orders Data Table Layer */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-muted-foreground font-medium">
                <th className="p-4">Order ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Assigned Test / Panel</th>
                <th className="p-4">Ordered At</th>
                <th className="p-4">Billing Price</th>
                <th className="p-4">Tracking Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No matching laboratory workflow records located.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-xs text-primary">#{order.id}</td>
                    <td className="p-4 font-medium">{order.patient_name}</td>
                    <td className="p-4 text-muted-foreground">{order.test_name}</td>
                    <td className="p-4">{new Date(order.ordered_at).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">Rs. {order.price}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(order.status)}`}>
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={
                          order.status === "completed"
                            ? `/results/entry/${order.id}`
                            : `/results/entry/${order.id}`
                        }
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        {order.status === "pending" ? "Collect Sample" : "Process Entry"}
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