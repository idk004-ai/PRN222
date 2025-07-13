export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: UserInfo;
  message?: string;
}

export interface UserInfo {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  role: string;
  roleType: number;
}
