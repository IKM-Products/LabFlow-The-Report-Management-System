"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  FlaskConical, 
  Save, 
  ArrowLeft, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock data representing test_parameters for a specific Order Item
const TEST_PARAMS = [
  { id: 1, name: "Hemoglobin", unit: "g/dL", ref_range: "13.5 - 17.5" },
  { id: 2, name: "WBC Count", unit: "10^9/L", ref_range: "4.5 - 11.0" },
  { id: 3, name: "Platelets", unit: "10^9/L", ref_range: "150 - 450" },
];

export default function OrderEntryPage() {
  const params = useParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveResults = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call to save to 'results' table
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Result recorded successfully.");
    setIsSaving(false);
    router.push("/technician/order-queue");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-serif">Result Entry</h1>
          <p className="text-sm text-neutral-500">Processing Order Item: #{params.orderItemId}</p>
        </div>
      </div>

      <form onSubmit={handleSaveResults} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
          <FlaskConical className="h-5 w-5 text-emerald-600" />
          <h2 className="font-bold text-neutral-800">Parameters</h2>
        </div>

        {/* Dynamic Parameter Inputs */}
        <div className="space-y-4">
          {TEST_PARAMS.map((param) => (
            <div key={param.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4">
                <Label className="text-sm font-semibold text-neutral-700">{param.name}</Label>
                <p className="text-xs text-neutral-400">Range: {param.ref_range}</p>
              </div>
              <div className="col-span-4">
                <Input type="number" required placeholder={`Value in ${param.unit}`} className="rounded-xl" />
              </div>
              <div className="col-span-4 text-sm font-medium text-neutral-500">{param.unit}</div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-neutral-100">
          <Label className="text-sm font-bold text-neutral-700">Technician Remarks</Label>
          <Textarea className="mt-2 rounded-xl" placeholder="Add observations..." />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-xl">Cancel</Button>
          <Button type="submit" disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-6">
            {isSaving ? "Saving..." : "Save Results"}
          </Button>
        </div>
      </form>
    </div>
  );
}