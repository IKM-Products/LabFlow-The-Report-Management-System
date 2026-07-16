"use client";

import React, { useState } from "react";
import { RefreshCw, ShieldAlert, Search, Calendar, FileText, ClipboardList } from "lucide-react";
import { orderService } from "@/services/order.service";
import { Order } from "@/types/order.types";

import OrderForm from "./_components/OrderForm";
import EditOrder from "./_components/EditOrder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TechnicianOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [visitIdInput, setVisitIdInput] = useState("");
  const [activeVisitId, setActiveVisitId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchOrders = async (targetId: string) => {
    if (!targetId.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await orderService.getOrdersByVisitId(targetId);
      setOrders(data);
      setActiveVisitId(targetId);
    } catch (error) {
      console.error("Critical issue querying order dataset schema structure:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(visitIdInput);
  };

  const reloadActiveRecords = () => {
    if (activeVisitId) {
      fetchOrders(activeVisitId);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Technician Orders Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track diagnostic order lifecycles and collection operations mapped to visit profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeVisitId && (
            <Button
              variant="outline"
              size="sm"
              onClick={reloadActiveRecords}
              disabled={isLoading}
              className="rounded-xl h-10 border-slate-200 text-slate-600"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          )}

          <OrderForm defaultVisitId={activeVisitId} onSuccess={reloadActiveRecords} />
        </div>
      </div>

      {/* Visit Filter Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 flex items-center pl-3">
          <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Query orders by Visit ID..."
            value={visitIdInput}
            onChange={(e) => setVisitIdInput(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent h-8 text-xs font-mono pl-6"
          />
        </div>
        <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs h-9 px-4 font-medium">
          Load Orders
        </Button>
      </form>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-slate-400 animate-pulse bg-white border rounded-2xl">
          Parsing operational clinical workflows...
        </div>
      ) : !hasSearched ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-12 text-center">
          <ClipboardList className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-500">Provide a Visit ID parameters set to extract targeted metrics.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableCaption className="text-xs text-slate-400 pb-4">
              Diagnostic matrix payload showing data segments loaded for Visit ID: {activeVisitId || "N/A"}
            </TableCaption>
            <TableHeader>
              <tr className="bg-slate-50 border-b border-slate-200">
                <TableHead className="font-bold text-slate-600">Order Ref ID</TableHead>
                <TableHead className="font-bold text-slate-600">Test / Panel Mapping</TableHead>
                <TableHead className="font-bold text-slate-600">Assigned Cost</TableHead>
                <TableHead className="font-bold text-slate-600">Collection Metadata</TableHead>
                <TableHead className="font-bold text-slate-600">Status</TableHead>
                <TableHead className="text-right font-bold text-slate-600">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody className="divide-y divide-slate-150">
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <ShieldAlert className="h-6 w-6 text-slate-300" />
                      <p className="font-medium text-slate-500">No laboratory pipeline orders matched this identifier.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-slate-50/60 transition-colors group">
                    <TableCell className="font-mono text-xs text-slate-500 max-w-30 truncate">
                      {order.id}
                    </TableCell>
                    
                    <TableCell className="space-y-1 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-900">Test:</span>
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{order.test_id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className="w-3.5" />
                        <span className="font-medium">Panel:</span>
                        <span className="font-mono text-[10px] text-slate-500">{order.panel_id}</span>
                      </div>
                    </TableCell>

                    <TableCell className="font-medium text-slate-950 text-xs">
                      ${order.price.toFixed(2)}
                    </TableCell>

                    <TableCell className="text-xs text-slate-600 space-y-0.5">
                      {order.collected_at ? (
                        <>
                          <div className="flex items-center gap-1 text-slate-700 font-medium">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span>{new Date(order.collected_at).toLocaleString()}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">By: {order.collected_by || "System Process"}</div>
                        </>
                      ) : (
                        <span className="text-slate-400 italic">Pending collection event</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        order.status === "completed" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap">
                      <EditOrder order={order} onSuccess={reloadActiveRecords} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}