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
    <Card className="rounded-xl shadow-sm border">
      <CardHeader className="pb-3 border-b bg-muted/20">
        <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          Historical Diagnostics Profile Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="pl-4">Visit ID</TableHead>
              <TableHead>Execution Date</TableHead>
              <TableHead>Test Profile Package</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-4">Charges</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground italic">
                  No previous records registered under this profile index matrix.
                </TableCell>
              </TableRow>
            ) : (
              history.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-xs text-primary pl-4">
                    <Link href={`/orders?id=${record.id}`} className="hover:underline">
                      #{record.id}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(record.visit_date).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium">{record.test_name}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${
                      record.status === "completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-4 font-medium">Rs. {record.billing_amount}</td>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}