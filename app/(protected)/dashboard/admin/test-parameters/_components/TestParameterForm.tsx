"use client";

import React, { useState, useEffect } from "react";
import { useForm, type Resolver, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { TestParameterSchema, TestParameterFormData } from "@/schemas/test-parameter.schema";
import { testParameterService } from "@/services/test-parameter.service";

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

interface TestParameterFormProps {
  defaultTestId?: string;
  nextSequenceNo?: number;
  onSuccess: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  disabled?: boolean;
}

export default function TestParameterForm({
  defaultTestId = "",
  nextSequenceNo = 1,
  onSuccess,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  disabled = false,
}: TestParameterFormProps) {
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
      test_id: defaultTestId,
      parameter_name: "",
      result_type: "Numeric",
      unit: "",
      sequence_no: nextSequenceNo,
    },
  });

  // Re-initialize form values cleanly whenever the modal opens or parent props change
  useEffect(() => {
    if (isOpen) {
      reset({
        test_id: defaultTestId,
        parameter_name: "",
        result_type: "Numeric",
        unit: "",
        sequence_no: nextSequenceNo,
      });
    }
  }, [isOpen, defaultTestId, nextSequenceNo, reset]);

  const handleClose = () => {
    if (isControlled && externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
    reset({
      test_id: defaultTestId,
      parameter_name: "",
      result_type: "Numeric",
      unit: "",
      sequence_no: nextSequenceNo,
    });
  };

  const onSubmit = async (values: TestParameterFormData) => {
    setIsSubmitting(true);
    try {
      // Exclude optional 'id' and default 'unit' to a string for API payload compatibility
      const { id, unit, ...rest } = values;
      const payload = {
        ...rest,
        unit: unit ?? "",
      };

      const res = await testParameterService.createParameter(payload as any);
      if (res?.success || res) {
        toast.success("New test parameter created successfully.");
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

  // Triggered if Zod schema validation fails when clicking submit
  const onInvalid = (formErrors: FieldErrors<TestParameterFormData>) => {
    console.error("Test Parameter Form Validation Errors:", formErrors);
    toast.error("Please correct the highlighted form errors before saving.");
  };

  return (
    <>
      {!isControlled && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setInternalIsOpen(true)}
          className="font-medium h-10 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Test Parameter
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setInternalIsOpen(true))}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Add New Test Parameter
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enter the required information to create a new parameter for this test catalog in the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 mt-2">
            {/* Hidden registered field for test_id */}
            <input type="hidden" {...register("test_id")} />

            {/* Parameter Name */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Parameter Name</Label>
              <Input
                {...register("parameter_name")}
                placeholder="e.g. Hemoglobin"
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
                  placeholder="e.g. Numeric"
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
                  placeholder="e.g. g/dL"
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
                placeholder="1"
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-10 px-4 font-bold shadow-xs min-w-25"
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