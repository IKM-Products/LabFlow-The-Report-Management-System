export interface TestCatalogPayload {
  dept_id: string;
  id: string;
  sample_type: string;
  test_code: string;
  test_name: string;
  test_price: number;
  turnaround_time: number;
}

export interface TestCatalogItem {
  dept_id: string;
  sample_type: string;
  test_catalog_id: string;
  test_code: string;
  test_name: string;
  test_price: number;
  turnaround_time: number;
}

export interface CreatedTestCatalogResponseData {
  code: string;
  departmentID: string;
  id: string;
  isActive: boolean;
  name: string;
  sampleType: string;
  testPrice: number;
  turnAroundTime: number;
  updatedAt: string;
}

export interface PanelTestCatalogItem {
  test_catalog_code: string;
  test_catalog_id: string;
  test_catalog_name: string;
  test_catalog_price: number;
}

export interface PanelCatalogDetails {
  panel_code: string;
  panel_id: string;
  panel_name: string;
  panel_price: number;
  test_catalog_items: PanelTestCatalogItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  messages?: string[];
  data?: T;
}

export type CatalogByPanelResponse = ApiResponse<PanelCatalogDetails>;