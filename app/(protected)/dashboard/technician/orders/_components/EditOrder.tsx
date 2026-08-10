"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { editOrderSchema } from "@/schemas/order.schema";
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
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      panel_id: order?.panel_id || "",
      price: order?.price ?? 0,
      status: order?.status || "collected",
    },
  });

  // Keep form values in sync whenever the modal opens or order changes
  useEffect(() => {
    if (isOpen && order) {
      reset({
        panel_id: order.panel_id || "",
        price: order.price ?? 0,
        status: order.status || "collected",
      });
    }
  }, [isOpen, order, reset]);

  const handleClose = () => {
    setIsOpen(false);
    reset({
      panel_id: order?.panel_id || "",
      price: order?.price ?? 0,
      status: order?.status || "collected",
    });
  };

  const onSubmit = async (values: any) => {
    const orderId = order.id || (order as any).order_id || (order as any)._id;

    if (!orderId) {
      toast.error("Unable to update: Missing order ID.");
      return;
    }

    setIsSubmitting(true);
    try {
      await orderService.updateOrder(orderId, values);
      toast.success("Order status attributes modified successfully.");
      onSuccess();
      setIsOpen(false);
    } catch (error: any) {
      const serverMessages =
        error.response?.data?.messages || error.response?.data?.message;
      const errorMsg = Array.isArray(serverMessages)
        ? serverMessages.join(", ")
        : typeof serverMessages === "string"
        ? serverMessages
        : error.message || "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (formErrors: any) => {
    console.error("Form Validation Errors:", formErrors);
    toast.error("Please fix the validation errors in the form.");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogTrigger
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 h-8 px-2 border border-transparent hover:border-blue-100 transition-colors cursor-pointer"
      >
        <Edit2 className="h-3.5 w-3.5" />
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

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 mt-2">
          {/* Price & Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">
                Adjusted Pricing
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                disabled={isSubmitting}
                className="rounded-xl border-slate-200 text-xs"
              />
              {errors.price && (
                <p className="text-[10px] text-red-500 font-medium">
                  {String(errors.price.message || "")}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">
                Workflow Status
              </Label>
              <select
                {...register("status")}
                disabled={isSubmitting}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white outline-hidden cursor-pointer disabled:opacity-50"
              >
                <option value="collected">Collected</option>
                <option value="result_entered">Result Entered</option>
                <option value="completed">Completed</option>
              </select>
              {errors.status && (
                <p className="text-[10px] text-red-500 font-medium">
                  {String(errors.status.message || "")}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl text-xs h-10 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Save Shifts"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}