"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { apiClient } from "@/lib/api-client";

// Mapped Lookups matching schema structural entities
interface PatientLookup { id: number; full_name: string; test_id: string }
interface DoctorLookup { id: number; full_name: string }
interface ClinicLookup { id: number; name: string }
interface CatalogLookup { id: number; name: string; price: number; type: "single" | "panel" }

const orderFormSchema = zod.object({
  patient_id: zod.coerce.number().min(1, "Please select a patient"),
  doctor_id: zod.coerce.number().min(1, "Please select a referring doctor"),
  clinic_id: zod.coerce.number().min(1, "Please select an originating clinic"),
  catalog_item_id: zod.string().min(1, "Please select at least one test or panel item"),
});

type OrderFormValues = zod.infer<typeof orderFormSchema>;

export default function CreateOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatientId = searchParams.get("patientId");

  // Lookup selection array sets
  const [patients, setPatients] = useState<PatientLookup[]>([]);
  const [doctors, setDoctors] = useState<DoctorLookup[]>([]);
  const [clinics, setClinics] = useState<ClinicLookup[]>([]);
  const [catalog, setCatalog] = useState<CatalogLookup[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema) as Resolver<OrderFormValues>,
    defaultValues: {
      patient_id: preselectedPatientId ? Number(preselectedPatientId) : undefined,
    },
  });

  // Keep a watch on item price calculation variables
  const selectedItemId = watch("catalog_item_id");
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  useEffect(() => {
    async function loadDataLookups() {
      try {
        const [patientsData, doctorsData, clinicsData, catalogData] = await Promise.all([
          apiClient<PatientLookup[]>("/patients"),
          apiClient<DoctorLookup[]>("/doctors"),
          apiClient<ClinicLookup[]>("/clinics"),
          apiClient<CatalogLookup[]>("/test-catalog"),
        ]);
        setPatients(patientsData);
        setDoctors(doctorsData);
        setClinics(clinicsData);
        setCatalog(catalogData);

        if (preselectedPatientId) {
          setValue("patient_id", Number(preselectedPatientId));
        }
      } catch (err: any) {
        setError("Failed to initialize lookup dropdown metadata configurations.");
      }
    }
    loadDataLookups();
  }, [preselectedPatientId, setValue]);

  useEffect(() => {
    if (selectedItemId) {
      const match = catalog.find((item) => `${item.type}-${item.id}` === selectedItemId);
      setCalculatedPrice(match ? match.price : 0);
    }
  }, [selectedItemId, catalog]);

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setError(null);
      
      // Separate our type prefix ('single' or 'panel') to build the dynamic structure payload
      const [itemType, actualId] = data.catalog_item_id.split("-");
      
      const payload = {
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        clinic_id: data.clinic_id,
        test_id: itemType === "single" ? Number(actualId) : null,
        panel_id: itemType === "panel" ? Number(actualId) : null,
        price: calculatedPrice,
      };

      await apiClient("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      router.push("/orders");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to finalize structural processing rules.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Lab Order</h1>
        <p className="text-sm text-muted-foreground">Register an diagnostic panel item under active systemic tracking matrix paths</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card border rounded-xl p-6 shadow-sm">
        {/* Patient Selection Dropdown */}
        <div>
          <label className="text-sm font-medium block mb-1">Select Patient</label>
          <select
            {...register("patient_id")}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
          >
            <option value="">-- Choose Patient --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name} ({p.test_id})
              </option>
            ))}
          </select>
          {errors.patient_id && <p className="text-xs text-destructive mt-1">{errors.patient_id.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Doctor Dropdown Mapping */}
          <div>
            <label className="text-sm font-medium block mb-1">Referring Doctor</label>
            <select
              {...register("doctor_id")}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
            >
              <option value="">-- Choose Doctor --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.full_name}
                </option>
              ))}
            </select>
            {errors.doctor_id && <p className="text-xs text-destructive mt-1">{errors.doctor_id.message}</p>}
          </div>

          {/* Clinic Dropdown Mapping */}
          <div>
            <label className="text-sm font-medium block mb-1">Originating Clinic</label>
            <select
              {...register("clinic_id")}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
            >
              <option value="">-- Choose Clinic --</option>
              {clinics.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.clinic_id && <p className="text-xs text-destructive mt-1">{errors.clinic_id.message}</p>}
          </div>
        </div>

        {/* Catalog Item Test/Panel Core Selection Matrix */}
        <div className="border-t pt-4">
          <label className="text-sm font-medium block mb-1">Select Test or Panel Package</label>
          <select
            {...register("catalog_item_id")}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
          >
            <option value="">-- Choose Test/Panel --</option>
            {catalog.map((item) => (
              <option key={`${item.type}-${item.id}`} value={`${item.type}-${item.id}`}>
                [{item.type.toUpperCase()}] {item.name} — Rs. {item.price}
              </option>
            ))}
          </select>
          {errors.catalog_item_id && <p className="text-xs text-destructive mt-1">{errors.catalog_item_id.message}</p>}
        </div>

        {/* Dynamic Pricing Metadata Footer Context */}
        {calculatedPrice > 0 && (
          <div className="rounded-lg bg-muted p-4 flex justify-between items-center text-sm font-medium">
            <span className="text-muted-foreground">Total Billable Amount:</span>
            <span className="text-lg text-primary font-bold">Rs. {calculatedPrice}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Generating Blueprint..." : "Create Order & Visit"}
          </button>
        </div>
      </form>
    </div>
  );
}