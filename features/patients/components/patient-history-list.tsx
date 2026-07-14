"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface HistoryRecord {
  id: number;
  visit_date: string;
  test_name: string;
  status: string;
  billing_amount: number;
}

interface PatientHistoryListProps {
  history: HistoryRecord[];
}

export function PatientHistoryList({ history }: PatientHistoryListProps) {
  return (
    <Card className="rounded-xl shadow-xs border border-slate-200">
      <CardHeader className="pb-3 border-b bg-slate-50/50">
        <CardTitle className="text-xs font-bold tracking-wider uppercase text-slate-500">
          Historical Diagnostics Profile Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/70">
            <TableRow>
              <TableHead className="pl-4 text-xs font-semibold text-slate-600">Visit ID</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Execution Date</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Test Profile Package</TableHead>
              <TableHead className="text-xs font-semibold text-slate-600">Status</TableHead>
              <TableHead className="text-right pr-4 text-xs font-semibold text-slate-600">Charges</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-sm text-slate-400 italic">
                  No previous records registered under this profile index matrix.
                </TableCell>
              </TableRow>
            ) : (
              history.map((record) => (
                <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Swapped native td elements for clean Shadcn TableCell components */}
                  <TableCell className="p-4 font-mono font-bold text-xs text-blue-600 pl-4">
                    <Link href={`/orders?id=${record.id}`} className="hover:underline">
                      #{record.id}
                    </Link>
                  </TableCell>
                  
                  <TableCell className="p-4 text-sm text-slate-500">
                    {new Date(record.visit_date).toLocaleDateString()}
                  </TableCell>
                  
                  <TableCell className="p-4 text-sm font-medium text-slate-900">
                    {record.test_name}
                  </TableCell>
                  
                  <TableCell className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      record.status === "completed" 
                        ? "bg-green-50 text-green-700 border border-green-200" 
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {record.status}
                    </span>
                  </TableCell>
                  
                  <TableCell className="p-4 text-right pr-4 text-sm font-semibold text-slate-900">
                    Rs. {record.billing_amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}