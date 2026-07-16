export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_name: string;
}

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_name: string;
}