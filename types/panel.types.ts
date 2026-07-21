// Standard API Generic Envelope
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  messages?: string[];
}

// Panel Payloads
export interface CreatePanelPayload {
  dept_id: string;
  id: string;
  panel_code: string;
  panel_name: string;
  panel_price: number;
}

export interface UpdatePanelPayload {
  dept_id: string;
  id: string;
  panel_code: string;
  panel_name: string;
  panel_price: number;
}

// Panel Response Items
export interface CreatedPanelData {
  code: string;
  departmentID: string;
  id: string;
  isActive: boolean;
  name: string;
  panelPrice: number;
  updatedAt: string;
}

export interface PanelListItem {
  dept_id: string;
  panel_code: string;
  panel_id: string;
  panel_name: string;
  panel_price: number;
}

// Panel Component Payloads & Items
export interface CreatePanelComponentPayload {
  panel_id: string;
  sequence_no: number;
  test_id: string;
}

export interface PanelCatalogItem {
  panel_id: string;
  sequence_no: number;
  test_id: string;
}