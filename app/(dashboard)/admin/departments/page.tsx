"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  Layers, 
  FlaskConical, 
  FileText, 
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data structure mirroring your schema parameters: id, name, description
const MOCK_DEPARTMENTS = [
  { id: 1, name: "Hematology", description: "Analysis of blood cells, coagulation profiles, and bone marrow cellular structures.", testCount: 24, code: "HEM" },
  { id: 2, name: "Biochemistry", description: "Chemical assessment of bodily fluids including renal, liver, lipid, and metabolic panels.", testCount: 42, code: "BIO" },
  { id: 3, name: "Microbiology", description: "Bacterial cultures, fungal identifications, and antibiotic susceptibility profiles.", testCount: 18, code: "MIC" },
  { id: 4, name: "Immunology & Serology", description: "Antigen-antibody evaluation, viral markers, and autoimmune screening diagnostics.", testCount: 15, code: "IMM" },
];

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDepartments = MOCK_DEPARTMENTS.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Structural Editorial Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-neutral-100">
        <div>
          <h1 className="text-3xl font-serif font-normal italic tracking-tight text-neutral-900">
            Laboratory Departments
          </h1>
          <p className="text-xs font-medium tracking-wider text-neutral-400 uppercase mt-1">
            Configure functional segments and diagnostic work units
          </p>
        </div>
        
        <Button className="bg-[#00a365] hover:bg-[#008f58] text-white font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-all active:scale-[0.98]">
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Create Department
        </Button>
      </div>

      {/* Control Utility Search Bar Container */}
      <div className="flex gap-3 items-center bg-neutral-50 p-3 rounded-2xl border border-neutral-200/50">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400 group-focus-within:text-[#00a365] transition-colors" />
          <Input 
            placeholder="Search segments by title or department code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 bg-white border-neutral-200 focus:border-emerald-600 focus-visible:ring-0 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Grid Network Display Grid mapping current departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDepartments.length > 0 ? (
          filteredDepartments.map((dept) => (
            <div 
              key={dept.id} 
              className="bg-white rounded-2xl border border-neutral-200/70 p-6 flex flex-col justify-between shadow-xs hover:border-emerald-600/30 hover:shadow-md hover:shadow-emerald-950/2 transition-all group relative"
            >
              <div className="space-y-4">
                {/* Upper row header tracking metadata */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-neutral-900 group-hover:text-emerald-800 transition-colors">
                        {dept.name}
                      </h3>
                      <Badge variant="outline" className="font-mono text-[10px] font-bold text-neutral-400 bg-neutral-50 border-neutral-200 uppercase px-1.5 py-0">
                        {dept.code}
                      </Badge>
                    </div>
                  </div>

                  <DropdownMenu>
                    {/* Style applied directly to DropdownMenuTrigger to completely omit button nesting */}
                    <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 cursor-pointer transition-colors focus-visible:outline-hidden">
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-neutral-200 shadow-sm font-sans text-xs">
                      <DropdownMenuItem className="font-semibold text-neutral-700 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer">
                        Edit Metadata
                      </DropdownMenuItem>
                      <DropdownMenuItem className="font-semibold text-neutral-700 focus:text-emerald-700 focus:bg-emerald-50 cursor-pointer">
                        Assign Tests
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Substantive description payload segment */}
                <p className="text-neutral-500 text-xs font-medium leading-relaxed line-clamp-2">
                  {dept.description}
                </p>
              </div>

              {/* Lower segment telemetry layout values */}
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-400">
                <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200/60 px-3 py-1.5 rounded-xl text-neutral-600">
                  <FlaskConical className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{dept.testCount} Associated Tests</span>
                </div>

                <Button variant="ghost" className="text-emerald-700 group-hover:text-emerald-800 hover:bg-emerald-50/60 font-bold text-xs flex items-center gap-1 rounded-xl pr-2">
                  View Catalog
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-neutral-200 text-center py-16 text-neutral-400 font-medium space-y-2">
            <Layers className="h-8 w-8 mx-auto text-neutral-300" />
            <p className="text-sm">No departments match your current query parameter profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}