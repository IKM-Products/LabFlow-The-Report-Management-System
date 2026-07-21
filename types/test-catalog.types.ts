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

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  messages?: string[];
  data?: T;
}