"use client";

import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resultEntryFormSchema, ResultEntryFormValues } from "../schema";
import { evaluateResultFlag } from "../lib/reference-range-utils";
import { apiClient } from "@/lib/api-client";

interface OrderResultDetail {
  order_id: string;
  test_name: string;
  patient_name: string;
  patient_age: string | number;
  patient_gender: string;
  specimen_type: string;
  parameters: {
    id: string;
    name: string;
    unit: string;
    reference_range: string;
  }[];
}

interface ResultEntryFormProps {
  orderData: OrderResultDetail;
  onSuccess?: () => void;
}

export function ResultEntryForm({ orderData, onSuccess }: ResultEntryFormProps) {
  const form = useForm<ResultEntryFormValues>({
    resolver: zodResolver(resultEntryFormSchema) as Resolver<ResultEntryFormValues>,
    defaultValues: {
      order_id: Number(orderData.order_id),
      results: orderData.parameters.map((param) => ({
        parameter_id: Number(param.id),
        parameter_name: param.name,
        unit: param.unit,
        reference_range: param.reference_range,
        result_value: "",
        flag: "normal",
        remarks: "",
      })),
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "results",
  });

  const handleValueChange = (index: number, val: string, refRange: string) => {
    const calculatedFlag = evaluateResultFlag(val, refRange);
    form.setValue(`results.${index}.flag`, calculatedFlag);
  };

  const onSubmit = async (values: ResultEntryFormValues) => {
    try {
      await apiClient(`/results/${values.order_id}`, {
        method: "POST",
        body: JSON.stringify(values),
      });

      toast.success("Test results successfully committed and verified.");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit result entry data.");
    }
  };

  return (
    <Card className="rounded-xl shadow-sm border">
      <CardHeader className="bg-muted/30 pb-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-bold">{orderData.test_name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Patient: <span className="font-semibold text-foreground">{orderData.patient_name}</span> ({orderData.patient_age}Y/{orderData.patient_gender}) • Specimen: {orderData.specimen_type}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-4">Parameter Name</TableHead>
                <TableHead className="w-45">Observed Value</TableHead>
                <TableHead className="w-25">Unit</TableHead>
                <TableHead className="w-40">Reference Range</TableHead>
                <TableHead className="w-30">Flag Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => {
                const currentFlag = form.watch(`results.${index}.flag`);
                return (
                  <TableRow key={field.id} className="hover:bg-muted/20">
                    <TableCell className="pl-4 font-medium text-sm">
                      {field.parameter_name}
                    </TableCell>
                    <TableCell>
                      <Input
                        {...form.register(`results.${index}.result_value`)}
                        placeholder="Enter value"
                        onChange={(e) => {
                          form.register(`results.${index}.result_value`).onChange(e);
                          handleValueChange(index, e.target.value, field.reference_range);
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{field.unit}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{field.reference_range}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          currentFlag === "high" || currentFlag === "low"
                            ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                        }`}
                      >
                        {currentFlag}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="p-4 border-t bg-muted/10 flex justify-end gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving Entry..." : "Submit Results"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}