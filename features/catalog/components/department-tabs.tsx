"use client";

import { Button } from "@/components/ui/button";
import { Department } from "../lib/catalog-types";

interface DepartmentTabsProps {
  departments: Department[];
  selectedId: number | "all";
  onChange: (id: number | "all") => void;
}

export function DepartmentTabs({ departments, selectedId, onChange }: DepartmentTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 pb-2">
      <Button
        variant={selectedId === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("all")}
      >
        All Departments
      </Button>
      {departments.map((dept) => (
        <Button
          key={dept.id}
          variant={selectedId === dept.id ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(dept.id)}
        >
          {dept.name}
        </Button>
      ))}
    </div>
  );
}