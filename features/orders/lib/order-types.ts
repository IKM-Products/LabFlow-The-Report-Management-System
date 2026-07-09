export interface OrderItem {
  id: number;
  visit_id: number;
  test_id?: number | null;
  panel_id?: number | null;
  test_name: string;
  status: "pending" | "sample_collected" | "completed" | string;
  price: number;
  sample_collected_by?: string;
  ordered_at: string;
  patient_name: string;
  sample_type: string;
}