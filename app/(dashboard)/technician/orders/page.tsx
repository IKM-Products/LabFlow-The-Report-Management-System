"use client";

import React, { useState } from "react";
import { 
  ClipboardList, 
  Search, 
  FlaskConical, 
  ChevronRight, 
  Clock, 
  User, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock Data representing pending order_items linked to patient visits
const MOCK_QUEUE = [
  { id: 101, patient_name: "John Doe", test_name: "Complete Blood Count", status: "pending", priority: "normal" },
  { id: 102, patient_name: "Jane Smith", test_name: "Fasting Blood Sugar", status: "pending", priority: "high" },
  { id: 103, patient_name: "Ram Bahadur", test_name: "Lipid Profile", status: "in-progress", priority: "normal" },
];

export default function OrderQueuePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQueue = MOCK_QUEUE.filter(item => 
    item.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.test_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-serif font-normal italic tracking-tight text-neutral-900">
          Order Queue
        </h1>
        <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase mt-1">
          Pending clinical tests awaiting result entry
        </p>
      </div>

      {/* Controls */}
      <div className="relative w-full sm:max-w-md group">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400" />
        <Input 
          placeholder="Search patient or test name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 h-11 bg-white border-neutral-200 focus:border-emerald-600 focus-visible:ring-0 rounded-xl"
        />
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-xs overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50/70 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase">
            <tr>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Test Requested</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredQueue.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-neutral-900 flex items-center gap-2">
                  <User className="h-4 w-4 text-neutral-400" />
                  {item.patient_name}
                </td>
                <td className="px-6 py-4 text-neutral-600">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-emerald-600" />
                    {item.test_name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={item.priority === "high" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"}>
                    {item.priority}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-neutral-500 font-mono text-xs uppercase">
                  {item.status}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/technician/order-queue/${item.id}`}>
                    <Button variant="ghost" className="text-emerald-700 font-bold hover:bg-emerald-50">
                      Process <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}