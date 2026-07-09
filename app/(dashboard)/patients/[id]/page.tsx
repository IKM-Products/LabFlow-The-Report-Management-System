"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

// Matching 'patients' entity attributes from database diagram
interface Patient {
  id: number;
  test_id: string; // Internal identifier code/MRN
  full_name: string;
  dob: string;
  gender: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at: string;
}

// Matching 'visits' or structural 'order_items' dependencies
interface PatientOrder {
  id: number;
  ordered_at: string;
  status: string;
  price: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PatientDetailsPage({ params }: PageProps) {
  // Safe extraction of params string inside App Router client components
  const { id } = use(params);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [orders, setOrders] = useState<PatientOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPatientData() {
      try {
        setIsLoading(true);
        // Concurrent fetching matching backend architecture
        const [patientData, ordersData] = await Promise.all([
          apiClient<Patient>(`/patients/${id}`),
          apiClient<PatientOrder[]>(`/patients/${id}/orders`),
        ]);

        setPatient(patientData);
        setOrders(ordersData);
      } catch (err: any) {
        setError(err.message || "Failed to load patient records.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPatientData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        {error || "Patient not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Navigation bar */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/patients" className="text-sm text-primary hover:underline">
            ← Back to Patients List
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mt-1">{patient.full_name}</h1>
        </div>
        <Link
          href={`/orders/create?patientId=${patient.id}`}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          + New Test Order
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Patient Core Demographics Block */}
        <div className="md:col-span-1 rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Patient Demographics</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground block">Patient ID / Reg No.</span>
              <span className="font-medium">{patient.test_id}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Date of Birth</span>
              <span className="font-medium">{new Date(patient.dob).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Gender</span>
              <span className="font-medium capitalize">{patient.gender}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Phone</span>
              <span className="font-medium">{patient.phone || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Email</span>
              <span className="font-medium">{patient.email || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Address</span>
              <span className="font-medium">{patient.address || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Historical Lab Orders Checklist Block */}
        <div className="md:col-span-2 rounded-xl border bg-card p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground my-auto text-center py-8">
              No laboratory records found for this patient yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                      <td className="py-3 font-medium">#{order.id}</td>
                      <td className="py-3">{new Date(order.ordered_at).toLocaleDateString()}</td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          order.status === "completed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/results/entry/${order.id}`}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          View Report
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}