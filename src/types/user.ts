export interface UserLoggedInType {
  accessToken: string;
  user?: LoginUser;
}

export type AuthRole = "admin" | "user";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}

export interface LoginData {
  user: LoginUser;
  token: string;
}

export interface LoginUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  data: SignUpData;
}

export interface SignUpData {
  user: SignUpUser;
  token: string;
}

export interface SignUpUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface GetUserResponse {
  success: boolean;
  message: string;
  data: GetUserData;
}

export interface GetUserData {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UpdateProfilePayload;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
}
