"use client";

import React, { useState, useEffect } from "react";
import { useForm, type Resolver, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ReferenceRangeSchema, ReferenceRangeFormData } from "@/schemas/reference-range.schema";
import { referenceRangeService, type ReferenceRangePayload } from "@/services/reference-range.service";
import { ReferenceRangeItem } from "@/types/reference-range.types";

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

interface EditReferenceRangeProps {
  item?: ReferenceRangeItem;
  onSuccess: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  disabled?: boolean;
  trigger?: React.ReactNode;
}

const parseNumRange = (strVal?: string) => {
  if (!strVal) return { min: 0, max: 0 };
  const parts = strVal.split("-").map((p) => parseFloat(p.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { min: parts[0], max: parts[1] };
  }
  return { min: 0, max: 0 };
};

export default function EditReferenceRange({
  item,
  onSuccess,
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  disabled = false,
  trigger,
}: EditReferenceRangeProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const getInitialValues = (itemData?: ReferenceRangeItem): ReferenceRangeFormData => {
    if (!itemData) {
      return {
        id: "",
        parameter_id: "",
        gender: "",
        min_age: 0,
        max_age: 100,
        min_value: 0,
        max_value: 0,
        text_range: "",
        note: "",
      };
    }

    const itemAny = (itemData as any) || {};
    const initialAge = parseNumRange(itemData?.age);
    const initialValue = parseNumRange(itemData?.value);

    const minAge = itemAny.min_age ?? initialAge.min ?? 0;
    const maxAge = itemAny.max_age ?? (initialAge.max || 100);
    const minValue = itemAny.min_value ?? initialValue.min ?? 0;
    const maxValue = itemAny.max_value ?? initialValue.max ?? 0;

    return {
      id: itemData?.ref_id || itemAny.id || "",
      parameter_id: itemData?.parameter_id || "",
      gender: itemData?.gender || "",
      min_age: Number(minAge),
      max_age: Number(maxAge),
      min_value: Number(minValue),
      max_value: Number(maxValue),
      text_range: itemData?.text_range || "",
      note: itemData?.note || "",
    };
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReferenceRangeFormData>({
    resolver: zodResolver(ReferenceRangeSchema) as Resolver<ReferenceRangeFormData, any>,
    defaultValues: getInitialValues(item),
  });

  useEffect(() => {
    if (isOpen && item) {
      reset(getInitialValues(item));
    }
  }, [isOpen, item, reset]);

  const handleClose = () => {
    if (isControlled && externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    } else if (!isControlled) {
      setInternalIsOpen(true);
    }
  };

  const handleTriggerClick = () => {
    if (!isControlled) {
      setInternalIsOpen(true);
    }
  };

  const onSubmit = async (values: ReferenceRangeFormData) => {
    setIsSubmitting(true);
    try {
      const targetId = item?.ref_id || (item as any)?.id || values.id;

      const payload = {
        ...values,
        id: targetId,
        text_range: values.text_range || "",
        note: values.note || "",
      } as ReferenceRangePayload;

      const res = await referenceRangeService.updateReference(payload);
      if (res?.success || res) {
        toast.success("Reference range updated successfully.");
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

  const onInvalid = (formErrors: FieldErrors<ReferenceRangeFormData>) => {
    console.error("Edit Reference Range Form Validation Errors:", formErrors);
    toast.error("Please correct the highlighted form errors before saving.");
  };

  return (
    <>
      {!isControlled && (
        <div onClick={handleTriggerClick} className="inline-block cursor-pointer">
          {trigger || (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              className="gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
              Edit
            </Button>
          )}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Edit Reference Range
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Edit the test reference range in the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 mt-2">
            
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Gender</Label>
              <select
                {...register("gender")}
                disabled={isSubmitting}
                className="w-full h-10 px-3 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-800 disabled:opacity-50 cursor-pointer"
              >
                <option value="" disabled>
                  Select a Gender
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Min Age (years)</Label>
                <Input
                  type="number"
                  {...register("min_age", {
                    setValueAs: (v) => (v === "" || isNaN(v) ? 0 : Number(v)),
                  })}
                  placeholder="0"
                  disabled={isSubmitting || disabled}
                  className="rounded-xl border-slate-200 text-xs"
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
                  {...register("max_age", {
                    setValueAs: (v) => (v === "" || isNaN(v) ? 0 : Number(v)),
                  })}
                  placeholder="100"
                  disabled={isSubmitting || disabled}
                  className="rounded-xl border-slate-200 text-xs"
                />
                {errors.max_age && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.max_age.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Min Value</Label>
                <Input
                  type="number"
                  step="any"
                  {...register("min_value", {
                    setValueAs: (v) => (v === "" || isNaN(v) ? 0 : Number(v)),
                  })}
                  placeholder="0"
                  disabled={isSubmitting || disabled}
                  className="rounded-xl border-slate-200 text-xs"
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
                  {...register("max_value", {
                    setValueAs: (v) => (v === "" || isNaN(v) ? 0 : Number(v)),
                  })}
                  placeholder="0"
                  disabled={isSubmitting || disabled}
                  className="rounded-xl border-slate-200 text-xs"
                />
                {errors.max_value && (
                  <p className="text-[10px] text-red-500 font-medium">
                    {errors.max_value.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Text Range (Qualitative)</Label>
              <Input
                {...register("text_range")}
                placeholder="e.g. Negative / Normal"
                disabled={isSubmitting || disabled}
                className="rounded-xl border-slate-200 text-xs"
              />
              {errors.text_range && (
                <p className="text-[10px] text-red-500 font-medium">
                  {errors.text_range.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-xl text-xs h-10 cursor-pointer border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || disabled}
                className="rounded-xl text-xs h-10 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isSubmitting ? "Saving..." : "Save"}</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}