export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isOwn?: boolean;
  type?: "text" | "image" | "file";
  attachments?: string[];
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar: string;
  role: "admin" | "teacher" | "student";
  isOnline: boolean;
  lastSeen?: string;
}

export interface ChatGroupInfo {
  id: string;
  name: string;
  code: string;
  description?: string;
  participants: number;
  totalMessages: number;
  createdAt: string;
  status: "Hoạt động" | "Tạm dừng";
}
