import apiClient, { setTokens, getRefreshToken, clearTokens } from "@/app/config/api";
import type { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from "@/interface/auth";

export const signIn = async (credentials: SignInRequest): Promise<SignInResponse> => {
  try {
    const response = await apiClient.post<SignInResponse>("/auth/signin", credentials);
    
    if (response.data.data?.user?.access_token && response.data.data?.user?.refresh_token) {
      setTokens(
        response.data.data.user.access_token,
        response.data.data.user.refresh_token
      );
      
      if (typeof window !== "undefined" && response.data.data.user) {
        const userData = { ...response.data.data.user };
        delete (userData as any).access_token;
        delete (userData as any).refresh_token;
        document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      }
    }
    
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Đăng nhập thất bại";
    throw new Error(errorMessage);
  }
};

export const signUp = async (data: SignUpRequest): Promise<SignUpResponse> => {
  try {
    const response = await apiClient.post<SignUpResponse>("/auth/signup", data);
    
    const user = response.data.user as any;
    if (user?.access_token && user?.refresh_token) {
      setTokens(user.access_token, user.refresh_token);
      
      if (typeof window !== "undefined") {
        const userData = { ...user };
        delete userData.access_token;
        delete userData.refresh_token;
        document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      }
    }
    
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Đăng ký thất bại";
    throw new Error(errorMessage);
  }
};

export const signOut = async (): Promise<void> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
    return;
  }

  try {
    await apiClient.post("/auth/signout", {
      refresh_token: refreshToken,
    });
  } catch (error: any) {
    const status = error?.response?.status;
    
    if (status === 400) {
      console.error("Dữ liệu không hợp lệ khi đăng xuất");
    } else if (status === 401) {
      console.error("Refresh token không hợp lệ");
    } else {
      console.error("Error signing out:", error);
    }
  } finally {
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
  }
};

