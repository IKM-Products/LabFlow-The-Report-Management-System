"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { editOrderSchema, EditOrderFormValues } from "@/schemas/order.schema";
import { orderService } from "@/services/order.service";
import { Order } from "@/types/order.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditOrderProps {
  order: Order;
  onSuccess: () => void;
}

export default function EditOrder({ order, onSuccess }: EditOrderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditOrderFormValues>({
    resolver: zodResolver(editOrderSchema) as any,
    defaultValues: {
      panel_id: order.panel_id,
      price: order.price,
      status: order.status,
    },
  });

  const onSubmit = async (values: EditOrderFormValues) => {
    setIsSubmitting(true);
    try {
      await orderService.updateOrder(order.id, values);
      toast.success("Order status attributes modified successfully.");
      onSuccess();
      setIsOpen(false);
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = serverMessages ? serverMessages.join(", ") : "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 h-8 px-2 border border-transparent hover:border-blue-100"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Modify Order Parameters
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Alter tracking metadata profiles for specific diagnostic units.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Panel ID Mapping</Label>
            <Input {...register("panel_id")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs font-mono" />
            {errors.panel_id && <p className="text-[10px] text-red-500 font-medium">{errors.panel_id.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Adjusted Pricing</Label>
            <Input type="number" step="0.01" {...register("price")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
            {errors.price && <p className="text-[10px] text-red-500 font-medium">{errors.price.message}</p>}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Workflow Status</Label>
            <Input {...register("status")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
            {errors.status && <p className="text-[10px] text-red-500 font-medium">{errors.status.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting} className="rounded-xl text-xs h-10">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25">
              {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Shifts"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}