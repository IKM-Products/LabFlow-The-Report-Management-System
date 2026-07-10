"use client";

import React, { useState } from "react";
import { 
  FlaskConical, 
  Layers, 
  Plus, 
  Search, 
  DollarSign, 
  Clock, 
  Droplet, 
  Grid,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data structure mirroring your test_catalog schema
const MOCK_TESTS = [
  { id: 1, name: "Complete Blood Count", code: "CBC", sample_type: "Whole Blood", price: 450, turnaround_hours: 4, is_active: true },
  { id: 2, name: "Fasting Blood Sugar", code: "FBS", sample_type: "Plasma", price: 150, turnaround_hours: 2, is_active: true },
  { id: 3, name: "Lipid Profile", code: "LIPID", sample_type: "Serum", price: 1200, turnaround_hours: 6, is_active: true },
  { id: 4, name: "Thyroid Stimulating Hormone", code: "TSH", sample_type: "Serum", price: 650, turnaround_hours: 8, is_active: true },
];

// Mock Data structure mirroring your panels schema (linked to departments)
const MOCK_PANELS = [
  { id: 1, name: "Executive Health Checkup", code: "EHC01", panel_price: 3500, testCount: 12, is_active: true },
  { id: 2, name: "Liver Function Test Panel", code: "LFT", panel_price: 1500, testCount: 7, is_active: true },
  { id: 3, name: "Renal Function Profile", code: "RFT", panel_price: 1100, testCount: 5, is_active: true },
];

export default function TestsCatalogPage() {
  const [activeTab, setActiveTab] = useState<"tests" | "panels">("tests");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = MOCK_TESTS.filter(test => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPanels = MOCK_PANELS.filter(panel => 
    panel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    panel.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Upper Title Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-neutral-100">
        <div>
          <h1 className="text-3xl font-serif font-normal italic tracking-tight text-neutral-900">
            Tests & Panels Catalog
          </h1>
          <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase mt-1">
            Maintain your test inventories, active panels, configurations, and pricing indices
          </p>
        </div>
        
        <Button className="bg-[#00a365] hover:bg-[#008f58] text-white font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]">
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Create {activeTab === "tests" ? "Individual Test" : "Custom Panel"}
        </Button>
      </div>

      {/* Control Utility Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-neutral-50 p-3 rounded-2xl border border-neutral-200/50">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400 group-focus-within:text-[#00a365] transition-colors" />
          <Input 
            placeholder={activeTab === "tests" ? "Search items by test title, shorthand code..." : "Search packages by panel name..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 bg-white border-neutral-200 focus:border-emerald-600 focus-visible:ring-0 rounded-xl text-sm"
          />
        </div>

        <Button variant="outline" className="w-full sm:w-auto h-11 border-neutral-200 text-neutral-600 rounded-xl flex items-center gap-2 bg-white font-medium">
          <SlidersHorizontal className="h-4 w-4" />
          Refine
        </Button>
      </div>

      {/* Primary Content Segments */}
      <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value as "tests" | "panels"); setSearchQuery(""); }} className="w-full">
        <TabsList className="bg-neutral-100/80 p-1 rounded-xl mb-6">
          <TabsTrigger value="tests" className="rounded-lg font-semibold tracking-wide text-xs px-4 py-2.5 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs">
            <FlaskConical className="h-4 w-4" />
            Individual Tests ({MOCK_TESTS.length})
          </TabsTrigger>
          <TabsTrigger value="panels" className="rounded-lg font-semibold tracking-wide text-xs px-4 py-2.5 flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs">
            <Layers className="h-4 w-4" />
            Test Panels ({MOCK_PANELS.length})
          </TabsTrigger>
        </TabsList>

        {/* INDIVIDUAL TESTS VIEW */}
        <TabsContent value="tests" className="focus-visible:outline-hidden">
          <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-neutral-600">
                <thead className="bg-neutral-50/70 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Test Description</th>
                    <th className="px-6 py-4">Specimen Type</th>
                    <th className="px-6 py-4">Turnaround (TAT)</th>
                    <th className="px-6 py-4">Base Pricing</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {filteredTests.length > 0 ? (
                    filteredTests.map((test) => (
                      <tr key={test.id} className="hover:bg-neutral-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-neutral-900">{test.name}</div>
                          <div className="text-xs font-mono text-neutral-400 font-normal">{test.code}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-neutral-600">
                            <Droplet className="h-3.5 w-3.5 text-rose-500 fill-rose-50" />
                            {test.sample_type}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutral-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-neutral-400" />
                            {test.turnaround_hours} Hours
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-neutral-900">
                          Rs. {test.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 w-fit shadow-none">
                            <CheckCircle className="h-3 w-3 text-emerald-600" /> Active
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-bold rounded-lg px-3 py-1.5">
                            Modify
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-neutral-400 font-medium">No test definitions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* COMPOSITE PANELS VIEW */}
        <TabsContent value="panels" className="focus-visible:outline-hidden">
          <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-neutral-600">
                <thead className="bg-neutral-50/70 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Panel Structure Package</th>
                    <th className="px-6 py-4">Composition Size</th>
                    <th className="px-6 py-4">Package Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {filteredPanels.length > 0 ? (
                    filteredPanels.map((panel) => (
                      <tr key={panel.id} className="hover:bg-neutral-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-neutral-900">{panel.name}</div>
                          <div className="text-xs font-mono text-neutral-400 font-normal">{panel.code}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 px-2 py-1 rounded-lg w-fit text-xs font-semibold text-neutral-600">
                            <Grid className="h-3 w-3 text-emerald-600" />
                            {panel.testCount} Underlined Parameters
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-700">
                          Rs. {panel.panel_price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 flex items-center gap-1 w-fit shadow-none">
                            <CheckCircle className="h-3 w-3 text-emerald-600" /> Active
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-bold rounded-lg px-3 py-1.5">
                            Edit Cluster
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-neutral-400 font-medium">No testing panels found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}