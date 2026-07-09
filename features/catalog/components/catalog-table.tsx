"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CatalogItem, Department } from "../lib/catalog-types";
import { DepartmentTabs } from "./department-tabs";
import { ParameterList } from "./parameter-list";

interface CatalogTableProps {
  initialCatalog: CatalogItem[];
  departments: Department[];
}

export function CatalogTable({ initialCatalog, departments }: CatalogTableProps) {
  const [catalog] = useState<CatalogItem[]>(initialCatalog);
  const [selectedDept, setSelectedDept] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Filter matrix logic execution
  const filteredCatalog = catalog.filter((item) => {
    const matchesDept = selectedDept === "all" || item.department_id === selectedDept;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const toggleExpandRow = (type: "single" | "panel", id: number) => {
    const key = `${type}-${id}`;
    setExpandedItemId(expandedItemId === key ? null : key);
  };

  return (
    <div className="space-y-4">
      {/* Search and Navigation Integration Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search profile name or testing code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-auto overflow-x-auto">
          <DepartmentTabs
            departments={departments}
            selectedId={selectedDept}
            onChange={setSelectedDept}
          />
        </div>
      </div>

      {/* Main Grid View Layer */}
      <Card className="rounded-xl overflow-hidden shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-30 pl-4">System Code</TableHead>
                <TableHead>Test / Panel Name</TableHead>
                <TableHead>Specimen Matrix</TableHead>
                <TableHead>Turnaround (TAT)</TableHead>
                <TableHead>Standard Cost</TableHead>
                <TableHead className="w-25 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCatalog.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No diagnostics cataloged under selected parameters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCatalog.map((item) => {
                  const rowKey = `${item.type}-${item.id}`;
                  const isExpanded = expandedItemId === rowKey;

                  return (
                    <>
                      <TableRow 
                        key={rowKey} 
                        className="cursor-pointer hover:bg-muted/40 transition-colors"
                        onClick={() => toggleExpandRow(item.type, item.id)}
                      >
                        <TableCell className="font-mono font-bold text-xs text-primary pl-4">
                          {item.code}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.name}</span>
                            <span className={`inline-block text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                              item.type === "panel" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {item.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground capitalize">{item.sample_type}</TableCell>
                        <TableCell>{item.turnaround_hours} hrs</TableCell>
                        <TableCell className="font-medium">Rs. {item.price}</TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-block h-2 w-2 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-zinc-300"}`} />
                        </TableCell>
                      </TableRow>
                      
                      {/* Nested parameters view projection */}
                      {isExpanded && item.parameters && (
                        <TableRow key={`${rowKey}-expanded`} className="bg-muted/20 hover:bg-muted/20">
                          <TableCell colSpan={6} className="p-4 border-t border-b">
                            <ParameterList parameters={item.parameters} />
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}