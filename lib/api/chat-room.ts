import apiClient from "@/app/config/api";

export enum ChatRoomType {
  DIRECT = "direct",
  GROUP = "group",
}

export interface ChatRoomResponse {
  room_id: number;
  room_type: ChatRoomType;
  name?: string;
  created_by?: number;
  created_at: string;
  unread_count?: number;
  last_message?: any;
  members?: any[];
}

export interface GetChatRoomsParams {
  userId: number | string;
  page?: number;
  limit?: number;
  joined_at?: string;
}

export interface GetChatRoomsResult {
  data: ChatRoomResponse[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Get chat rooms for current user
 */
export const getChatRooms = async (params: GetChatRoomsParams): Promise<GetChatRoomsResult> => {
  try {
    if (!params.userId) {
      throw new Error("userId is required");
    }

    const requestParams: Record<string, any> = {
      userId: params.userId,
    };

    if (params.page) requestParams.page = params.page;
    if (params.limit) requestParams.limit = params.limit;

    console.log("Fetching chat rooms with params:", requestParams);

    const response = await apiClient.get<any>("/chat-rooms", {
      params: requestParams,
    });

    console.log("Chat rooms response:", response.data);

    // Handle paginated response structure if present
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
    console.error("Error fetching chat rooms:", error);
    throw new Error(error?.message || "Không thể lấy danh sách phòng chat");
  }
};

export interface CreateChatRoomParams {
  userId: number;
  room_type: ChatRoomType;
  name?: string;
  members?: number[];
}

export const createChatRoom = async (params: CreateChatRoomParams): Promise<ChatRoomResponse> => {
  try {
    const response = await apiClient.post<ChatRoomResponse>("/chat-rooms", {
      user_id: params.userId,
      room_type: params.room_type,
      name: params.name,
      user_ids: params.members,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating chat room:", error);
    throw new Error(error?.message || "Không thể tạo phòng chat");
  }
};

export const deleteConversation = async (userId: number | string, roomId: number | string): Promise<void> => {
  try {
    await apiClient.delete(`/chat-rooms/${roomId}/conversation`, {
      params: { userId },
    });
  } catch (error: any) {
    throw new Error(error?.message || "Không thể xóa đoạn chat");
  }
};
