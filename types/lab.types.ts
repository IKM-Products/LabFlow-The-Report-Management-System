// src/types/lab.types.ts

export interface Lab {
  id: string;
  lab_name: string;
  tagline?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  logo_path?: string | null;
  registration_no?: string | null;
  report_footer?: string | null;
  updated_at?: string;
  updated_by?: string | number | null;
}

export interface CreateLabPayload {
  lab_name: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_path?: string;
  registration_no?: string;
  report_footer?: string;
}

export type UpdateLabPayload = CreateLabPayload;