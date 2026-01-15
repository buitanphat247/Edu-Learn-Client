import apiClient from "@/app/config/api";

/**
 * Friend Request API
 */

export interface FriendRequestResponse {
  id: number;
  requester_id: number;
  addressee_id: number;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  accepted_at?: string | null;
  requester?: {
    user_id: number;
    username: string;
    fullname: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    status?: "online" | "offline" | "away";
    role_id?: number;
    role?: {
      role_id: number;
      role_name: string;
      created_at: string;
      updated_at: string;
    };
    created_at?: string;
    updated_at?: string;
  };
  addressee?: {
    user_id: number;
    username: string;
    fullname: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    status?: "online" | "offline" | "away";
    role_id?: number;
    role?: {
      role_id: number;
      role_name: string;
      created_at: string;
      updated_at: string;
    };
    created_at?: string;
    updated_at?: string;
  };
}

export interface GetFriendRequestsParams {
  userId: number | string;
  page?: number;
  limit?: number;
}

export interface GetFriendRequestsResult {
  requests: FriendRequestResponse[];
  total: number;
  page: number;
  limit: number;
}

// API returns array directly, not wrapped in object
export type GetFriendRequestsApiResponse = FriendRequestResponse[];

export interface CreateFriendRequestParams {
  requester_id: number;
  addressee_id: number;
}

export const sendFriendRequest = async (params: CreateFriendRequestParams): Promise<FriendRequestResponse> => {
  try {
    const response = await apiClient.post<any>("/friends/request", params);
    
    if (response.data?.status && response.data.data) {
      return response.data.data;
    }
    
    // Fallback if structure is different
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Không thể gửi lời mời kết bạn");
  }
};

/**
 * Get pending friend requests for current user
 */
export const getFriendRequests = async (params: GetFriendRequestsParams): Promise<GetFriendRequestsResult> => {
  try {
    if (!params.userId) {
      throw new Error("userId is required");
    }

    const requestParams: Record<string, any> = {
      userId: params.userId,
      page: params.page || 1,
      limit: params.limit || 20,
    };

    console.log("Fetching friend requests with params:", requestParams);

    // API returns object with data field or array directly
    const response = await apiClient.get<any>("/friends/pending", {
      params: requestParams,
    });

    console.log("Friend requests response:", response.data);

    // Handle response structure: { status: true, message: "Success", data: [] }
    if (response.data?.status && Array.isArray(response.data.data)) {
      return {
        requests: response.data.data,
        total: response.data.data.length,
        page: params.page || 1,
        limit: params.limit || 20,
      };
    }

    // Handle direct array response
    if (Array.isArray(response.data)) {
      return {
        requests: response.data,
        total: response.data.length,
        page: params.page || 1,
        limit: params.limit || 20,
      };
    }

    throw new Error("Invalid response format: Expected array or object with data field");
  } catch (error: any) {
    console.error("Error fetching friend requests:", error);
    console.error("Error response:", error?.response?.data);

    // Extract error message from various possible locations
    let errorMessage = "Không thể lấy danh sách lời mời kết bạn";

    if (error?.response?.data) {
      const data = error.response.data;
      errorMessage = data.message || data.error || errorMessage;

      // If backend returns 404, it might mean no endpoint exists
      if (error.response.status === 404) {
        errorMessage = "API endpoint không tồn tại. Vui lòng kiểm tra backend có hỗ trợ /api/friends/pending";
      }

      // If backend returns 400, show validation error
      if (error.response.status === 400) {
        errorMessage = data.message || "Dữ liệu không hợp lệ. " + (data.error || "");
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

/**
 * Accept friend request
 */
export interface AcceptFriendRequestResponse {
  friend_id: number;
  requester_id: number;
  addressee_id: number;
  status: "accepted";
  created_at: string;
  updated_at: string;
}

export interface AcceptFriendRequestApiResponse {
  status: boolean;
  message: string;
  data: AcceptFriendRequestResponse;
  statusCode: number;
  timestamp: string;
}

export const acceptFriendRequest = async (friendRequestId: number, userId: number | string): Promise<AcceptFriendRequestResponse> => {
  try {
    const response = await apiClient.patch<AcceptFriendRequestApiResponse>(`/friends/${friendRequestId}/accept`, undefined, {
      params: { userId },
    });

    if (response.data.status && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Không thể chấp nhận lời mời kết bạn");
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Không thể chấp nhận lời mời kết bạn";
    throw new Error(errorMessage);
  }
};

/**
 * Reject friend request
 */
export interface RejectFriendRequestResponse {
  friend_id: number;
  requester_id: number;
  addressee_id: number;
  status: "rejected";
  created_at: string;
  updated_at: string;
}

export interface RejectFriendRequestApiResponse {
  status: boolean;
  message: string;
  data: RejectFriendRequestResponse;
  statusCode: number;
  timestamp: string;
}

export const rejectFriendRequest = async (friendRequestId: number, userId: number | string): Promise<RejectFriendRequestResponse> => {
  try {
    const response = await apiClient.delete<RejectFriendRequestApiResponse>(`/friends/${friendRequestId}/reject`, {
      params: { userId },
    });

    if (response.data.status && response.data.data) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Không thể từ chối lời mời kết bạn");
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || "Không thể từ chối lời mời kết bạn";
    throw new Error(errorMessage);
  }
};

export interface GetFriendsParams {
  userId: number | string;
  status?: "pending" | "accepted" | "blocked";
  page?: number;
  limit?: number;
}

export interface GetFriendsResult {
  data: FriendRequestResponse[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Get friends list for current user
 */
export const getFriends = async (params: GetFriendsParams): Promise<GetFriendsResult> => {
  try {
    if (!params.userId) {
      throw new Error("userId is required");
    }

    const requestParams: Record<string, any> = {
      userId: params.userId,
      status: params.status || "accepted",
    };

    if (params.page) requestParams.page = params.page;
    if (params.limit) requestParams.limit = params.limit;

    console.log("Fetching friends with params:", requestParams);

    const response = await apiClient.get<any>("/friends", {
      params: requestParams,
    });

    console.log("Friends response:", response.data);

    // Handle paginated response: { data: [], total: 0, page: 1, limit: 10 }
    if (response.data && Array.isArray(response.data.data)) {
      return {
        data: response.data.data,
        total: response.data.total || response.data.data.length,
        page: response.data.page || params.page || 1,
        limit: response.data.limit || params.limit || 10,
      };
    }

    // Handle direct array response
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
        page: params.page || 1,
        limit: params.limit || response.data.length,
      };
    }

    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error fetching friends:", error);
    throw new Error(error?.message || "Không thể lấy danh sách bạn bè");
  }
};
