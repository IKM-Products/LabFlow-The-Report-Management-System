"use client";

import { Input } from "@/components/ui/input";

interface PatientSearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export function PatientSearchBar({ value, onChange }: PatientSearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      {/* Search Icon Layout Positioned Left for Proper Input Scannability */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <svg
          className="h-4 w-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <Input
        type="text"
        placeholder="Search directory by Patient ID, Name, or Mobile..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-9 h-10 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500 shadow-xs transition-all"
      />

      {/* Clear Button Action Element - Appears Only if Search Criteria Exists */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Clear search input"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}