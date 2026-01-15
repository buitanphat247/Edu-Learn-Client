import apiClient from "@/app/config/api";

export interface UserBlock {
  id: number;
  blocker_id: number;
  blocked_id: number;
  created_at: string;
  blocked?: {
    user_id: number;
    fullname?: string;
    username: string;
    avatar?: string;
  };
}

export const getBlockedUsers = async (userId: number): Promise<UserBlock[]> => {
  try {
    const response = await apiClient.get<{ data: UserBlock[] }>("/chat/blocks", {
      params: { userId },
    });
    return response.data.data || [];
  } catch (error: any) {
    console.error("Error fetching blocked users:", error);
    return [];
  }
};

export const blockUser = async (userId: number, targetUserId: number): Promise<void> => {
  await apiClient.post("/chat/block", {
    userId,
    targetUserId,
  });
};

export const unblockUser = async (userId: number, targetUserId: number): Promise<void> => {
  await apiClient.post("/chat/unblock", {
    userId,
    targetUserId,
  });
};
