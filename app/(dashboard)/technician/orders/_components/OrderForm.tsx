"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { orderFormSchema, OrderFormValues } from "@/schemas/order.schema";
import { orderService } from "@/services/order.service";

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

interface OrderFormProps {
  defaultVisitId?: string;
  onSuccess: () => void;
}

export default function OrderForm({ defaultVisitId = "", onSuccess }: OrderFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema) as any,
    defaultValues: {
      panel_id: "",
      price: 0,
      status: "pending",
      test_id: "",
      visit_id: defaultVisitId,
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset({
      panel_id: "",
      price: 0,
      status: "pending",
      test_id: "",
      visit_id: defaultVisitId,
    });
  };

  const onSubmit = async (values: OrderFormValues) => {
    setIsSubmitting(true);
    try {
      await orderService.createOrder(values);
      toast.success("New diagnostic order generated successfully.");
      onSuccess();
      handleClose();
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = serverMessages ? serverMessages.join(", ") : "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setIsOpen(true))}>
      <DialogTrigger>
        <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-xs">
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
            Generate Lab Order
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Provision processing steps for laboratory data panels.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Visit ID Mapping</Label>
              <Input {...register("visit_id")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs font-mono" />
              {errors.visit_id && <p className="text-[10px] text-red-500 font-medium">{errors.visit_id.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Test ID Target</Label>
              <Input {...register("test_id")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs font-mono" />
              {errors.test_id && <p className="text-[10px] text-red-500 font-medium">{errors.test_id.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Panel ID Link</Label>
              <Input {...register("panel_id")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs font-mono" />
              {errors.panel_id && <p className="text-[10px] text-red-500 font-medium">{errors.panel_id.message}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Assigned Price</Label>
              <Input type="number" step="0.01" {...register("price")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
              {errors.price && <p className="text-[10px] text-red-500 font-medium">{errors.price.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">Initial Status</Label>
            <Input {...register("status")} disabled={isSubmitting} className="rounded-xl border-slate-200 text-xs" />
            {errors.status && <p className="text-[10px] text-red-500 font-medium">{errors.status.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="rounded-xl text-xs h-10">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25">
              {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Target"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}