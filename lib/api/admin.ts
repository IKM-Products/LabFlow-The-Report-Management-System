// lib/api/admin.ts
import axiosInstance from "@/axios/instance";

export interface CreateDepartmentPayload {
  dept_name: string;
  dept_description: string;
}

export const adminApi = {
  // Global Administration & User Management
  createRole: (data: { name: string; description?: string }) => 
    axiosInstance.post("/role/create", data).then(res => res.data),

  createUser: (data: any) => 
    axiosInstance.post("/user/create", data).then(res => res.data),

  getProfiles: () => 
    axiosInstance.get("/admin/profile/profile-details").then(res => res.data),

  // Lab Configuration
  insertLab: (data: any) => 
    axiosInstance.post("/admin/lab", data).then(res => res.data),
  
  getLab: (labId: string) => 
    axiosInstance.get(`/admin/lab/${labId}`).then(res => res.data),
    
  getAllLabs: () => 
    axiosInstance.get("/admin/lab/all").then(res => res.data),

  // Catalog Engine Creators
  createDepartment: (data: CreateDepartmentPayload) => 
    axiosInstance.post("/admin/lab-test/create-department", data).then(res => res.data),
    
  createPanel: (data: any) => 
    axiosInstance.post("/admin/lab-test/create-panel", data).then(res => res.data),
    
  createTestCatalog: (data: any) => 
    axiosInstance.post("/admin/lab-test/create-catalog", data).then(res => res.data),
    
  createPanelComponent: (data: any) => 
    axiosInstance.post("/admin/lab-test/create-panel-component", data).then(res => res.data),
    
  createTestParameter: (data: any) => 
    axiosInstance.post("/admin/lab-test/create-test-parameter", data).then(res => res.data),
    
  createReference: (data: any) => 
    axiosInstance.post("/admin/lab-test/create-reference", data).then(res => res.data),

  // Catalog Lists
  getDepartments: () => 
    axiosInstance.get("/lab-test/list-department").then(res => res.data),

  getCatalogByDeptId: (deptId: string) => 
    axiosInstance.get(`/lab-test/list-catalog/${deptId}`).then(res => res.data),
    
  getPanelCatalogByPanelId: (panelId: string) => 
    axiosInstance.get(`/lab-test/list-panel-catalog/${panelId}`).then(res => res.data),
    
  getParameterByTestId: (testId: string) => 
    axiosInstance.get(`/lab-test/list-test-parameter/${testId}`).then(res => res.data),
    
  getReferenceByTestId: (testId: string) => 
    axiosInstance.get(`/lab-test/list-reference/${testId}`).then(res => res.data),
    
  getPanelByDeptId: (deptId: string) => 
    axiosInstance.get(`/lab-test/list-panel/${deptId}`).then(res => res.data),

  // Network Domain Connections
  createDoctor: (data: any) => 
    axiosInstance.post("/admin/doctor", data).then(res => res.data),
    
  getDoctors: () => 
    axiosInstance.get("/doctor").then(res => res.data),
    
  getDoctorById: (doctorId: string) => 
    axiosInstance.get(`/doctor/${doctorId}`).then(res => res.data),

  // Catalog PATCH Mutations
  updateLab: (labId: string, data: any) => 
    axiosInstance.patch(`/admin/lab/${labId}`, data).then(res => res.data),

  updateDepartment: (data: Partial<CreateDepartmentPayload> & { id: string }) => 
    axiosInstance.patch("/admin/lab-test/update-department", data).then(res => res.data),

  updatePanel: (data: any) => 
    axiosInstance.patch("/admin/lab-test/update-panel", data).then(res => res.data),

  updateCatalog: (data: any) => 
    axiosInstance.patch("/admin/lab-test/update-catalog", data).then(res => res.data),

  updateTestParameter: (data: any) => 
    axiosInstance.patch("/admin/lab-test/update-test-parameter", data).then(res => res.data),

  updateReference: (data: any) => 
    axiosInstance.patch("/admin/lab-test/update-reference", data).then(res => res.data),

  updateDoctor: (doctorId: string, data: any) => 
    axiosInstance.patch(`/admin/doctor/${doctorId}`, data).then(res => res.data),
};