import apiClient from "@/app/config/api";

export interface ChatMessageResponse {
  message_id: number;
  room_id: number;
  sender_id: number;
  content?: string;
  created_at: string;
  sender?: {
    user_id: number;
    username: string;
    fullname?: string;
    avatar?: string;
  };
  fileAttachment?: any; // To be defined if needed
}

export interface GetMessagesParams {
  userId: number;
  roomId: number;
  page?: number;
  limit?: number;
}

export interface SendMessageParams {
  sender_id: number;
  room_id: number;
  content?: string;
}

export interface PaginatedMessagesResult {
  data: ChatMessageResponse[];
  total: number;
  page: number;
  limit: number;
}

export const getMessages = async (params: GetMessagesParams): Promise<PaginatedMessagesResult> => {
  try {
    const response = await apiClient.get<any>(`/chat-messages/room/${params.roomId}`, {
      params: {
        userId: params.userId,
        page: params.page,
        limit: params.limit,
      },
    });

    // 1. Check for Nested Pagination Object: response.data.data.data (Standard for our Backend now)
    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      return {
        data: response.data.data.data,
        total: response.data.data.total,
        page: response.data.data.page || params.page,
        limit: response.data.data.limit || params.limit,
      };
    }

    // 2. Check for Direct Array in Data: response.data.data (Old Format)
    if (response.data && Array.isArray(response.data.data)) {
      return {
        data: response.data.data,
        total: response.data.total || response.data.data.length,
        page: response.data.page || params.page || 1,
        limit: response.data.limit || params.limit || 50,
      };
    }

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
    console.error("Error fetching messages:", error);
    throw new Error(error?.message || "Không thể tải tin nhắn");
  }
};

export const sendMessage = async (params: SendMessageParams): Promise<ChatMessageResponse> => {
  try {
    const response = await apiClient.post<ChatMessageResponse>("/chat-messages", params);
    return response.data;
  } catch (error: any) {
    console.error("Error sending message:", error);
    throw new Error(error?.message || "Không thể gửi tin nhắn");
  }
};

export const markAsRead = async (userId: number, roomId: number): Promise<void> => {
  try {
    console.log(`API: Marking as read. User: ${userId}, Room: ${roomId}`);
    await apiClient.post(`/chat-messages/room/${roomId}/mark-read`, { userId });
  } catch (error: any) {
    console.error("Error marking messages as read:", error);
  }
};
