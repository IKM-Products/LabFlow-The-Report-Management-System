import { apiClient } from "./client";

export const adminApi = {
  // Global Administration & User Management
  createRole: (data: { name: string; description?: string }) => 
    apiClient("/role/create", { method: "POST", body: data }),

  createUser: (data: any) => 
    apiClient("/user/create", { method: "POST", body: data }),

  getProfiles: () => 
    apiClient("/admin/profile/profile-details"),

  // Lab Configuration
  insertLab: (data: any) => 
    apiClient("/admin/lab", { method: "POST", body: data }),
  
  getLab: (labId: string) => 
    apiClient(`/admin/lab/${labId}`),
    
  getAllLabs: () => 
    apiClient("/admin/lab/all"),

  // Catalog Engine Creators
  createDepartment: (data: any) => 
    apiClient("/admin/lab-test/create-department", { method: "POST", body: data }),
    
  createPanel: (data: any) => 
    apiClient("/admin/lab-test/create-department", { method: "POST", body: data }),
    
  createTestCatalog: (data: any) => 
    apiClient("/admin/lab-test/create-catalog", { method: "POST", body: data }),
    
  createPanelComponent: (data: any) => 
    apiClient("/admin/lab-test/create-panel-component", { method: "POST", body: data }),
    
  createTestParameter: (data: any) => 
    apiClient("/admin/lab-test/create-test-parameter", { method: "POST", body: data }),
    
  createReference: (data: any) => 
    apiClient("/admin/lab-test/create-reference", { method: "POST", body: data }),

  // Catalog Lists
  getDepartments: () => 
    apiClient("/lab-test/list-department"),

  getCatalogByDeptId: (deptId: string) => 
    apiClient(`/lab-test/list-catalog/${deptId}`),
    
  getPanelCatalogByPanelId: (panelId: string) => 
    apiClient(`/lab-test/list-panel-catalog/${panelId}`),
    
  getParameterByTestId: (testId: string) => 
    apiClient(`/lab-test/list-test-parameter/${testId}`),
    
  getReferenceByTestId: (testId: string) => 
    apiClient(`/lab-test/list-reference/${testId}`),
    
  getPanelByDeptId: (deptId: string) => 
    apiClient(`/lab-test/list-panel/${deptId}`),

  // Network Domain Connections
  createDoctor: (data: any) => 
    apiClient("/admin/doctor", { method: "POST", body: data }),
    
  getDoctors: () => 
    apiClient("/doctor"),
    
  getDoctorById: (doctorId: string) => 
    apiClient(`/doctor/${doctorId}`),

  // Catalog PATCH Mutations
  updateLab: (labId: string, data: any) => 
    apiClient(`/admin/lab/${labId}`, { method: "PATCH", body: data }),

  updateDepartment: (data: any) => 
    apiClient("/admin/lab-test/update-department", { method: "PATCH", body: data }),

  updatePanel: (data: any) => 
    apiClient("/admin/lab-test/update-panel", { method: "PATCH", body: data }),

  updateCatalog: (data: any) => 
    apiClient("/admin/lab-test/update-catalog", { method: "PATCH", body: data }),

  updateTestParameter: (data: any) => 
    apiClient("/admin/lab-test/update-test-parameter", { method: "PATCH", body: data }),

  updateReference: (data: any) => 
    apiClient("/admin/lab-test/update-reference", { method: "PATCH", body: data }),

  updateDoctor: (doctorId: string, data: any) => 
    apiClient(`/admin/doctor/${doctorId}`, { method: "PATCH", body: data }),
};