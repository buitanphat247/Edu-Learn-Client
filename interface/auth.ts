export interface Role {
  role_id: number;
  role_name: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  user_id: string;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  avatar: string;
  created_at: string;
  updated_at: string;
  role: Role;
  access_token: string;
  refresh_token: string;
}

export interface SignInRequest {
  emailOrUsername: string;
  password: string;
  device_name: string;
}

export interface SignInResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
  };
  statusCode: number;
  timestamp: string;
}

export interface SignUpRequest {
  username: string;
  fullname: string;
  email: string;
  phone: string;
  password: string;
  role_id: number;
  device_name: string;
}

export interface SignUpUser {
  user_id: number;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  avatar: string;
  role_id: number;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface SignUpResponse {
  user: SignUpUser;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}
