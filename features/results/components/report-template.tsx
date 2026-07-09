"use client";

import { ParameterResultValues } from "../schema";

interface ReportTemplateProps {
  report: {
    report_id: string;
    patient_name: string;
    patient_age: number;
    patient_gender: string;
    patient_id: string;
    referred_by: string;
    date: string;
    test_name: string;
    results: ParameterResultValues[];
  };
}

export function ReportTemplate({ report }: ReportTemplateProps) {
  return (
    <div className="bg-background p-8 max-w-4xl mx-auto border print:border-none print:shadow-none print:p-0">
      {/* Clinic/Lab Header Banner */}
      <div className="border-b pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-primary tracking-tight">LABFLOW DIAGNOSTICS</h1>
          <p className="text-xs text-muted-foreground">Pathology & Clinical Reference Laboratory</p>
        </div>
        <div className="text-right text-xs">
          <p className="font-mono font-bold">Report ID: {report.report_id}</p>
          <p className="text-muted-foreground">Date: {report.date}</p>
        </div>
      </div>

      {/* Patient & Referral Info Box */}
      <div className="grid grid-cols-2 gap-4 text-xs bg-muted/30 p-4 rounded-lg mb-6 border">
        <div>
          <p><span className="font-semibold">Patient Name:</span> {report.patient_name}</p>
          <p><span className="font-semibold">Patient ID:</span> {report.patient_id}</p>
          <p><span className="font-semibold">Age/Gender:</span> {report.patient_age} Y / {report.patient_gender}</p>
        </div>
        <div>
          <p><span className="font-semibold">Referred By:</span> {report.referred_by}</p>
          <p><span className="font-semibold">Test Requested:</span> {report.test_name}</p>
        </div>
      </div>

      {/* Primary Results Table */}
      <table className="w-full text-xs text-left mb-8 border-collapse">
        <thead>
          <tr className="border-b-2 border-primary/20 bg-muted/40">
            <th className="py-2 px-3 font-semibold">TEST PARAMETER</th>
            <th className="py-2 px-3 font-semibold">OBSERVED VALUE</th>
            <th className="py-2 px-3 font-semibold">UNIT</th>
            <th className="py-2 px-3 font-semibold">REFERENCE RANGE</th>
          </tr>
        </thead>
        <tbody>
          {report.results.map((res) => {
            const isAbnormal = res.flag === "high" || res.flag === "low";
            return (
              <tr key={res.parameter_id} className="border-b border-muted">
                <td className="py-2.5 px-3 font-medium">{res.parameter_name}</td>
                <td className={`py-2.5 px-3 font-bold ${isAbnormal ? "text-red-600 dark:text-red-400" : ""}`}>
                  {res.result_value} {isAbnormal && `(${res.flag.toUpperCase()})`}
                </td>
                <td className="py-2.5 px-3 text-muted-foreground">{res.unit}</td>
                <td className="py-2.5 px-3 font-mono text-muted-foreground">{res.reference_range}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Signature Section */}
      <div className="pt-12 mt-12 border-t flex justify-between items-end text-xs">
        <div>
          <p className="text-muted-foreground">End of Lab Report</p>
        </div>
        <div className="text-center">
          <div className="h-10 border-b border-dashed mb-1 w-40" />
          <p className="font-semibold">Pathologist Signature</p>
        </div>
      </div>
    </div>
  );
}