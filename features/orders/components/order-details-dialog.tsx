"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Order, UpdateOrderInput, OrderStatus } from "../lib/order-types";
import { updateOrderSchema } from "../schemas/orderSchema";
import { useMutateOrder } from "../hooks/use-mutate-order";
import { OrderStatusBadge } from "./order-status-badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onRefreshQueue: () => void;
}

export function OrderDetailsDialog({ order, isOpen, onClose, onRefreshQueue }: OrderDetailsDialogProps) {
  const { updateOrder, isSubmitting } = useMutateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateOrderInput>({
    resolver: zodResolver(updateOrderSchema),
    values: {
      status: order?.status || "PENDING",
    },
  });

  if (!order) return null;

  const onFormSubmit = async (values: UpdateOrderInput) => {
    const updated = await updateOrder(order.id, values);
    if (updated) {
      onRefreshQueue();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Order Configuration Management
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 mt-0.5">
            Review specific item identifiers and alter tracking parameters.
          </DialogDescription>
        </DialogHeader>

        {/* Informational Read-Only Parameters */}
        <div className="mt-4 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-150 text-sm">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
            <span className="text-xs font-semibold text-slate-500">System Order ID</span>
            <span className="font-mono text-xs font-medium text-slate-800">{order.id}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
            <span className="text-xs font-semibold text-slate-500">Visit Instance Link</span>
            <span className="font-mono text-xs font-medium text-slate-800">{order.visit_id}</span>
          </div>
          {(order.test_id || !order.panel_id) && (
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="text-xs font-semibold text-slate-500">Associated Test ID</span>
              <span className="font-mono text-xs text-slate-700">{order.test_id || "None Assigned"}</span>
            </div>
          )}
          {order.panel_id && (
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="text-xs font-semibold text-slate-500">Associated Panel ID</span>
              <span className="font-mono text-xs text-slate-700">{order.panel_id}</span>
            </div>
          )}
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
            <span className="text-xs font-semibold text-slate-500">Billed Processing Cost</span>
            <span className="font-semibold text-slate-900">${Number(order.price).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-semibold text-slate-500">Current Status</span>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Update Order Status Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-4 border-t border-slate-100 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Modify Queue Status</Label>
            <select 
              {...register("status")}
              disabled={isSubmitting}
              className="flex w-full rounded-xl border border-slate-200 bg-white px-3 h-10 text-sm text-slate-900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="PENDING">Pending Execution</option>
              <option value="PROCESSING">Currently Processing</option>
              <option value="COMPLETED">Completed / Finalized</option>
              <option value="CANCELLED">Cancelled Record</option>
            </select>
            {errors.status && <p className="text-[10px] text-red-500">{errors.status.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl h-10 border-slate-200 text-slate-600 hover:text-slate-900 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-4 text-xs font-bold shadow-xs cursor-pointer"
            >
              {isSubmitting ? "Updating..." : "Save State Configuration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}