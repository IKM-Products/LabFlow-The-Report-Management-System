export type loginResponse = {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    session_id: string;
    user_id: string;
    tenant_id: string;
    user_type: string;
  };
};

export interface AuthUser {
  id: string;
  phone: string;
  email: string;
  full_name: string;
  is_password_expired: boolean
}