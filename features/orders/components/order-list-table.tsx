"use client";

import { useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { OrderItem } from "../lib/order-types";
import { OrderStatusBadge } from "./order-status-badge";

interface OrderListTableProps {
  initialOrders: OrderItem[];
}

export function OrderListTable({ initialOrders }: OrderListTableProps) {
  const [orders] = useState<OrderItem[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusChange = (value: string | null) => setStatusFilter(value ?? "all");

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery) ||
      order.test_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Control Filters Layer */}
      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
        <div className="w-full sm:w-1/3">
          <Input
            placeholder="Search order ID, patient, or test profile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter tracking status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending Sample</SelectItem>
              <SelectItem value="sample_collected">Sample Collected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Grid Logging Layer */}
      <Card className="rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-25 pl-4">Order ID</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Assigned Test Profile</TableHead>
                <TableHead>Ordered At</TableHead>
                <TableHead>Billing Price</TableHead>
                <TableHead>Tracking Status</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No matching laboratory workflow records located.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-xs text-primary pl-4">#{order.id}</td>
                    <td className="p-4 font-medium">{order.patient_name}</td>
                    <td className="p-4 text-muted-foreground">{order.test_name}</td>
                    <td className="p-4 text-xs">{new Date(order.ordered_at).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">Rs. {order.price}</td>
                    <td className="p-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-right pr-4">
                      <Link
                        href={`/results/entry/${order.id}`}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        {order.status === "pending" ? "Collect Sample" : "Process Entry"}
                      </Link>
                    </td>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}