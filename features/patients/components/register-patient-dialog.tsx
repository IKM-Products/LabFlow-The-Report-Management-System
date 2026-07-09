"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";

const patientRegistrationSchema = zod.object({
  full_name: zod.string().min(2, "Full name required"),
  age: zod.number().min(1, "Please define valid numerical ages"),
  gender: zod.enum(["male", "female", "other"]),
  phone: zod.string().min(7, "Valid contact stream path required"),
});

type RegistrationValues = zod.infer<typeof patientRegistrationSchema>;

interface RegisterPatientDialogProps {
  onSuccess: () => void;
}

export function RegisterPatientDialog({ onSuccess }: RegisterPatientDialogProps) {
  const form = useForm<RegistrationValues>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: { full_name: "", phone: "" },
  });

  const onSubmit = async (values: RegistrationValues) => {
    try {
      await apiClient("/patients", {
        method: "POST",
        body: JSON.stringify(values),
      });
      toast.success("Demographic matrix registered inside repository system.");
      form.reset();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to commit system entry parameters.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Register New Patient</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Patient Registration</DialogTitle>
          <DialogDescription>Input primary demographic data variables to register a patient entry file</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>Full Identity Name</Label>
            <Input {...form.register("full_name")} placeholder="Hari Prasad" />
            {form.formState.errors.full_name && <p className="text-xs text-destructive">{form.formState.errors.full_name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Age (Years)</Label>
              <Input type="number" {...form.register("age", { valueAsNumber: true })} />
              {form.formState.errors.age && <p className="text-xs text-destructive">{form.formState.errors.age.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Gender</Label>
              <Select onValueChange={(v) => form.setValue("gender", v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Identify gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Contact Phone Number</Label>
            <Input type="tel" {...form.register("phone")} placeholder="98XXXXXXXX" />
            {form.formState.errors.phone && <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>}
          </div>
          <Button type="submit" className="w-full mt-2" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Syncing Workspace Data..." : "Create Identity Account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}