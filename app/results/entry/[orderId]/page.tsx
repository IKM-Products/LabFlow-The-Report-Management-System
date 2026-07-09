"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { apiClient } from "@/lib/api-client";

interface ParameterMetadata {
  id: number;
  name: string;
  unit: string;
  reference_range: string;
}

interface OrderDetails {
  id: number;
  patient_name: string;
  test_name: string;
  status: string;
  parameters: ParameterMetadata[];
}

// Zod schema enforcing string/numerical results for array lists
const resultsFormSchema = zod.object({
  results: zod.array(
    zod.object({
      parameter_id: zod.number(),
      parameter_name: zod.string(),
      unit: zod.string(),
      reference_range: zod.string(),
      observed_value: zod.string().min(1, "Value required"),
    })
  ),
});

type ResultsFormValues = zod.infer<typeof resultsFormSchema>;

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function ResultEntryPage({ params }: PageProps) {
  const router = useRouter();
  const { orderId } = use(params);

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ResultsFormValues>({
    resolver: zodResolver(resultsFormSchema),
    defaultValues: { results: [] },
  });

  const { fields } = useFieldArray({
    control,
    name: "results",
  });

  useEffect(() => {
    async function loadOrderAndParameters() {
      try {
        setIsLoading(true);
        // Fetches test order details along with parameter templates built into the profile
        const data = await apiClient<OrderDetails>(`/orders/${orderId}/results-template`);
        setOrder(data);

        // Map data models into form defaults 
        if (data.parameters) {
          reset({
            results: data.parameters.map((param) => ({
              parameter_id: param.id,
              parameter_name: param.name,
              unit: param.unit,
              reference_range: param.reference_range,
              observed_value: "",
            })),
          });
        }
      } catch (err: any) {
        setError(err.message || "Failed to load parameter specifications.");
      } finally {
        setIsLoading(false);
      }
    }
    loadOrderAndParameters();
  }, [orderId, reset]);

  const onSubmit = async (data: ResultsFormValues) => {
    try {
      setError(null);
      const payload = {
        order_id: Number(orderId),
        values: data.results.map((r) => ({
          parameter_id: r.parameter_id,
          observed_value: r.observed_value,
        })),
      };

      // Dispatches the analytical data payload to the company API layer
      await apiClient(`/orders/${orderId}/results`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      router.push("/results");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to submit laboratory parameters.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
        {error || "Order context parameters missing."}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Result Data Intake</h1>
          <p className="text-sm text-muted-foreground">
            Order <span className="font-mono text-primary font-bold">#{order.id}</span> — {order.patient_name} ({order.test_name})
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase border ${
          order.status === "completed" ? "bg-green-100 text-green-800 border-green-200" : "bg-blue-100 text-blue-800 border-blue-200"
        }`}>
          {order.status.replace("_", " ")}
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-muted-foreground font-medium">
                <th className="p-4 w-2/5">Parameter</th>
                <th className="p-4 w-1/5">Reference Range</th>
                <th className="p-4 w-1/5">Unit</th>
                <th className="p-4 w-1/5">Observed Value Value</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{field.parameter_name}</td>
                  <td className="p-4 text-muted-foreground font-mono text-xs">{field.reference_range}</td>
                  <td className="p-4 text-muted-foreground">{field.unit}</td>
                  <td className="p-4">
                    <input
                      type="text"
                      {...register(`results.${index}.observed_value` as const)}
                      className={`w-full border rounded-lg px-3 py-1.5 text-sm bg-background ${
                        errors.results?.[index]?.observed_value ? "border-destructive focus:ring-destructive" : ""
                      }`}
                      placeholder="Enter value"
                    />
                    {errors.results?.[index]?.observed_value && (
                      <p className="text-xs text-destructive mt-1">{errors.results[index].observed_value?.message}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 p-4 bg-muted/20 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting || order.status === "completed"}
            className="rounded bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Saving Matrix..." : "Verify & Complete Report"}
          </button>
        </div>
      </form>
    </div>
  );
}