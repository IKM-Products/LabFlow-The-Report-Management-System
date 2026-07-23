"use client";

import React, { useState, useEffect } from "react";
import { useForm, type Resolver, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ReferenceRangeSchema, ReferenceRangeFormData } from "@/schemas/reference-range.schema";
import { referenceRangeService, type ReferenceRangePayload } from "@/services/reference-range.service";

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

interface ReferenceRangeFormProps {
  defaultParameterId?: string;
  onSuccess: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  disabled?: boolean;
}

export default function ReferenceRangeForm({
  defaultParameterId = "",
  onSuccess,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  disabled = false,
}: ReferenceRangeFormProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReferenceRangeFormData>({
    resolver: zodResolver(ReferenceRangeSchema) as Resolver<ReferenceRangeFormData, any>,
    defaultValues: {
      parameter_id: defaultParameterId,
      gender: "",
      min_age: 0,
      max_age: 100,
      min_value: 0,
      max_value: 0,
      text_range: "",
      note: "",
    },
  });

  // Re-initialize form values cleanly whenever the modal opens or parent props change
  useEffect(() => {
    if (isOpen) {
      reset({
        parameter_id: defaultParameterId,
        gender: "",
        min_age: 0,
        max_age: 100,
        min_value: 0,
        max_value: 0,
        text_range: "",
        note: "",
      });
    }
  }, [isOpen, defaultParameterId, reset]);

  const handleClose = () => {
    if (isControlled && externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
    reset({
      parameter_id: defaultParameterId,
      gender: "",
      min_age: 0,
      max_age: 100,
      min_value: 0,
      max_value: 0,
      text_range: "",
      note: "",
    });
  };

  const onSubmit = async (values: ReferenceRangeFormData) => {
    setIsSubmitting(true);
    try {
      // Destructure 'id' out so undefined isn't passed in payload
      const { id, ...restValues } = values;

      const payload = {
        ...restValues,
        ...(id ? { id } : {}),
        parameter_id: defaultParameterId || values.parameter_id,
        text_range: values.text_range || "",
        note: values.note || "",
      } as ReferenceRangePayload;

      const res = await referenceRangeService.createReference(payload);
      if (res?.success || res) {
        toast.success("New reference range created successfully.");
        onSuccess();
        handleClose();
      }
    } catch (error: any) {
      const serverMessages = error.response?.data?.messages;
      const errorMsg = Array.isArray(serverMessages)
        ? serverMessages.join(", ")
        : typeof serverMessages === "string"
        ? serverMessages
        : Array.isArray(error)
        ? error.join(", ")
        : error?.message || "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Triggered if Zod schema validation fails when clicking submit
  const onInvalid = (formErrors: FieldErrors<ReferenceRangeFormData>) => {
    console.error("Reference Range Form Validation Errors:", formErrors);
    toast.error("Please correct the highlighted form errors before saving.");
  };

  return (
    <>
      {!isControlled && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setInternalIsOpen(true)}
          className="font-medium h-10 px-4 py-2 bg-emerald-600 hover:bg-emerald-600 text-white rounded-xl text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Reference Range
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : setInternalIsOpen(true))}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
              Add New Reference Range
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Configure biological reference ranges, demographic rules, and clinical values.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 mt-2">
            {/* Hidden Parameter ID bound to form state */}
            <input type="hidden" {...register("parameter_id")} />

            {/* Gender */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Gender</Label>
              <select
                {...register("gender")}
                disabled={isSubmitting}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 disabled:opacity-50"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Others</option>
              </select>
              {errors.gender && (
                <p className="text-[10px] text-red-500 font-medium">
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Min & Max Age */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Min Age (years)</Label>
                <Input
                  type="number"
                  {...register("min_age", { valueAsNumber: true })}
                  placeholder="0"
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200"
                />
                {errors.min_age && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.min_age.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Max Age (years)</Label>
                <Input
                  type="number"
                  {...register("max_age", { valueAsNumber: true })}
                  placeholder="100"
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200"
                />
                {errors.max_age && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.max_age.message}
                  </p>
                )}
              </div>
            </div>

            {/* Min & Max Value */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Min Value</Label>
                <Input
                  type="number"
                  step="any"
                  {...register("min_value", { valueAsNumber: true })}
                  placeholder="12.0"
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200"
                />
                {errors.min_value && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.min_value.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Max Value</Label>
                <Input
                  type="number"
                  step="any"
                  {...register("max_value", { valueAsNumber: true })}
                  placeholder="16.0"
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200"
                />
                {errors.max_value && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.max_value.message}
                  </p>
                )}
              </div>
            </div>

            {/* Text Range */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Text Range (Qualitative)</Label>
              <Input
                {...register("text_range")}
                placeholder="e.g. Negative / Normal"
                disabled={isSubmitting}
                className="rounded-xl border-slate-200"
              />
              {errors.text_range && (
                <p className="text-[10px] text-red-500 font-medium">
                  {errors.text_range.message}
                </p>
              )}
            </div>

            {/* Note */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Note / Remarks</Label>
              <textarea
                {...register("note")}
                placeholder="e.g. Applicable for fasting patients..."
                rows={2}
                disabled={isSubmitting}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none disabled:opacity-50 text-slate-800"
              />
              {errors.note && (
                <p className="text-[10px] text-red-500 font-medium">
                  {errors.note.message}
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