export interface CreateRolePayload {
  role_name: "ROLE_ADMIN" | "ROLE_TECHNICIAN";
}

export interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  role_name: "ROLE_ADMIN" | "ROLE_TECHNICIAN";
}

export interface LoginPayload {
  email: string;
  password: string;
}

/*
|--------------------------------------------------------------------------
| Login API Response
|--------------------------------------------------------------------------
|
| Update this interface if your login response differs.
|
*/

export interface LoginResponse {
  success: boolean;
  message: string;

  data: {
    access_token: string;
    session_id: string;
    user_id: string;
    user_type: "ROLE_ADMIN" | "ROLE_TECHNICIAN";
  };
}

/*
|--------------------------------------------------------------------------
| GetMe API Response
|--------------------------------------------------------------------------
*/

export interface ProfileResponse {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  role_name: string;
  email: string;
}