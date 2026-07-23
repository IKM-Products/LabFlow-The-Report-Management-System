"use client";

import React, { useState, useEffect } from "react";
import { useForm, type Resolver, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { TestParameterSchema, TestParameterFormData } from "@/schemas/test-parameter.schema";
import { testParameterService } from "@/services/test-parameter.service";
import { TestParameterItem } from "@/types/test-parameter.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditTestParameterProps {
  item: TestParameterItem;
  onSuccess: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function EditTestParameter({
  item,
  onSuccess,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
}: EditTestParameterProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestParameterFormData>({
    resolver: zodResolver(TestParameterSchema) as Resolver<TestParameterFormData, any>,
    defaultValues: {
      id: item?.parameter_id,
      test_id: item?.test_id,
      parameter_name: item?.parameter_name,
      result_type: item?.result_type,
      unit: item?.unit || "",
      sequence_no: item?.sequence_no,
    },
  });

  // Keep form values in sync when item prop or modal state changes
  useEffect(() => {
    if (isOpen && item) {
      reset({
        id: item.parameter_id,
        test_id: item.test_id,
        parameter_name: item.parameter_name,
        result_type: item.result_type,
        unit: item.unit || "",
        sequence_no: item.sequence_no,
      });
    }
  }, [isOpen, item, reset]);

  const handleClose = () => {
    if (isControlled && externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
    reset();
  };

  const onSubmit = async (data: TestParameterFormData) => {
    setIsSubmitting(true);
    try {
      const res = await testParameterService.updateParameter({
        ...data,
        id: data.id || item?.parameter_id || "",
        unit: data.unit || "",
      });

      if (res?.success || res) {
        toast.success("Test parameter updated successfully.");
        onSuccess();
        handleClose();
      }
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = Array.isArray(serverMessages)
        ? serverMessages.join(", ")
        : typeof serverMessages === "string"
        ? serverMessages
        : error?.message || "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (formErrors: FieldErrors<TestParameterFormData>) => {
    console.error("Test Parameter Validation Errors:", formErrors);
    toast.error("Please correct highlighted form errors before saving.");
  };

  return (
    <>
      {!isControlled && (
        <button
          type="button"
          onClick={() => setInternalIsOpen(true)}
          className="inline-flex items-center justify-center rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 h-8 px-2 border border-transparent hover:border-emerald-100 transition-colors cursor-pointer"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
      )}

      <Dialog
        open={isOpen}
        onOpenChange={(open) => (!open ? handleClose() : setInternalIsOpen(true))}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Edit Test Parameter
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update the test parameter details in the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 mt-2">
            {/* Hidden fields for ID and Test ID so Zod & API get the values */}
            <input type="hidden" {...register("id")} />
            <input type="hidden" {...register("test_id")} />

            {/* Parameter Name */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Parameter Name</Label>
              <Input
                {...register("parameter_name")}
                disabled={isSubmitting}
                className="rounded-xl border-slate-200"
              />
              {errors.parameter_name && (
                <p className="text-[10px] text-red-500 font-medium">
                  {errors.parameter_name.message}
                </p>
              )}
            </div>

            {/* Result Type & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Result Type</Label>
                <Input
                  {...register("result_type")}
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200"
                />
                {errors.result_type && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.result_type.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Unit</Label>
                <Input
                  {...register("unit")}
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200"
                />
                {errors.unit && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.unit.message}
                  </p>
                )}
              </div>
            </div>

            {/* Sequence Number */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Sequence Number</Label>
              <Input
                type="number"
                {...register("sequence_no", { valueAsNumber: true })}
                disabled={isSubmitting}
                className="rounded-xl border-slate-200"
              />
              {errors.sequence_no && (
                <p className="text-[10px] text-red-500 font-medium">
                  {errors.sequence_no.message}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-xl text-xs h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}