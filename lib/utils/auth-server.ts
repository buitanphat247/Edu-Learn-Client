import { cookies } from "next/headers";

export interface AuthState {
  authenticated: boolean;
  userData: {
    user_id: number | string;
    username: string;
    fullname: string;
    email: string;
    phone: string;
    avatar: string;
    role?: {
      role_id: number;
      role_name: string;
      created_at: string;
      updated_at: string;
    };
  } | null;
}

export async function getServerAuthState(): Promise<AuthState> {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    const tokenCookie = cookieStore.get("accessToken");
    
    if (userCookie?.value && tokenCookie?.value) {
      try {
        const userData = JSON.parse(userCookie.value);
        return {
          authenticated: true,
          userData: userData,
        };
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        return {
          authenticated: false,
          userData: null,
        };
      }
    }
    
    return {
      authenticated: false,
      userData: null,
    };
  } catch (error) {
    console.error("Error reading server auth state:", error);
    return {
      authenticated: false,
      userData: null,
    };
  }
}

