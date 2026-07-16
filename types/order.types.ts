export interface BaseApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
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