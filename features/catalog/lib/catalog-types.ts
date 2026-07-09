export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface TestParameter {
  id: number;
  name: string;
  unit: string;
  reference_range: string;
  display_order: number;
}

export interface CatalogItem {
  id: number;
  name: string;
  code: string;
  sample_type: string;
  price: number;
  turnaround_hours: number;
  is_active: boolean;
  department_id: number;
  type: "single" | "panel";
  parameters?: TestParameter[]; // Nested parameters associated with the profile
}