"use client";

import React, { useState } from "react";
import { Order } from "../lib/order-types";
import { OrderStatusBadge } from "./order-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, ArrowRight, RefreshCw } from "lucide-react";

interface OrderListTableProps {
  orders: Order[];
  isLoading: boolean;
  onSelectOrder: (order: Order) => void;
  onRefresh?: () => void;
}

export function OrderListTable({ orders, isLoading, onSelectOrder, onRefresh }: OrderListTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter orders by Order Number or Visit ID securely
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      order.order_number.toLowerCase().includes(query) ||
      order.visit_id.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Action Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by Order No. or Visit ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl h-10 border-slate-200 focus-visible:ring-blue-500 bg-white text-slate-900"
          />
        </div>
        
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 h-10 px-4"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Queue
          </Button>
        )}
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Order Number</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Visit ID</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">Last Updated</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-150">
              {isLoading ? (
                // Loading Skeleton Rows
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded-sm w-28" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded-sm w-48" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-full w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded-sm w-36" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-100 rounded-lg w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="h-8 w-8 text-slate-300" />
                      <p className="font-medium text-sm text-slate-600">No orders found matching the filters</p>
                      <p className="text-xs text-slate-400">Try adjusting your search criteria or refresh the pipeline.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Content Data Rows
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50/70 transition-colors group border-b border-slate-100"
                  >
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-50">
                      {order.visit_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                      {formatDate(order.updated_at)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onSelectOrder(order)}
                        className="rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 font-medium text-xs h-8 px-3 inline-flex items-center gap-1 border border-transparent hover:border-blue-100"
                      >
                        Manage
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Button>
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