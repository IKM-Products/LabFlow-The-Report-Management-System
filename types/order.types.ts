export interface BaseApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface OrderListItem {
  id: string;
  visit_no: number;
  patinet_name?: string; 
  patient_name?: string; 
  test_code?: string;
  test_name?: string;
  test_price?: number;
  panel_code?: string;
  panel_name?: string;
  panel_price?: number;
  price: number;
  status: string;
  collected_by: string | null;
}

export interface Order {
  id: string;
  panel_id: string;
  price: number;
  status: string;
  test_id: string;
  visit_id: string;
  collected_at: string | null;
  collected_by: string | null;
}

export interface OrderCreatePayload {
  panel_id: string;
  price: number;
  status: string;
  test_id: string;
  visit_id: string;
}

export interface OrderUpdatePayload {
  panel_id: string;
  price: number;
  status: string;
}