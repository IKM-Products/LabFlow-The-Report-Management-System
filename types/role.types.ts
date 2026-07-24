//obselete
export interface CreateRoleRequest {
  role_name: string;
}

export interface RoleData {
  id: string;
  roleName: string;
}

export interface CreateRoleResponse {
  data: RoleData;
  message: string;
  success: boolean;
}