import apiClient from "@/app/config/api";
import type { SignUpUser } from "@/interface/auth";

export interface UserInfoResponse {
  user_id: number | string;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  avatar: string;
  role_id?: number;
  role: {
    role_id: number;
    role_name: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

interface UserInfoApiResponse {
  status: boolean;
  message: string;
  data: UserInfoResponse;
  statusCode: number;
  timestamp: string;
}

export const getUserInfo = async (userId: number | string): Promise<UserInfoResponse> => {
  try {
    const response = await apiClient.get<UserInfoApiResponse>(`/users/${userId}`);
    
    if (response.data.status && response.data.data) {
      return response.data.data;
    }
    
    return response.data as any;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Không thể lấy thông tin user";
    throw new Error(errorMessage);
  }
};

export const getCurrentUser = (): SignUpUser | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }
  
  return null;
};

