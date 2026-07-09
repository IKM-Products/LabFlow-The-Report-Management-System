"use client";

import { Input } from "@/components/ui/input";

interface PatientSearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export function PatientSearchBar({ value, onChange }: PatientSearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Input
        type="text"
        placeholder="Search directory by Patient ID, Name, or Mobile..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-3 pr-10"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}