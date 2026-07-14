"use client";

import React from "react";
import { OrderStatus } from "../lib/order-types";

interface OrderStatusBadgeProps {
  status: OrderStatus | string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  // Normalize string from the backend just in case case-matching shifts
  const normalizedStatus = (status || "").toUpperCase() as OrderStatus;

  const config: Record<OrderStatus, { text: string; styles: string }> = {
    PENDING: {
      text: "Pending",
      styles: "bg-amber-50 text-amber-700 border-amber-200/60",
    },
    PROCESSING: {
      text: "Processing",
      styles: "bg-blue-50 text-blue-700 border-blue-200/60",
    },
    COMPLETED: {
      text: "Completed",
      styles: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    },
    CANCELLED: {
      text: "Cancelled",
      styles: "bg-slate-100 text-slate-600 border-slate-200",
    },
  };

  const current = config[normalizedStatus] || {
    text: typeof status === "string" ? status : "Unknown",
    styles: "bg-slate-50 text-slate-500 border-slate-200",
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border transition-colors select-none ${current.styles}`}
    >
      {current.text}
    </span>
  );
}