"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, App } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ChatLeftSidebar from "@/app/components/chat_components/ChatLeftSidebar";
import ChatCenter from "@/app/components/chat_components/ChatCenter";
import ChatRightSidebar from "@/app/components/chat_components/ChatRightSidebar";
import type { ChatMessage, ChatParticipant, ChatGroupInfo } from "@/app/components/chat_components/types";

// Mock data
const mockGroupData: Record<string, ChatGroupInfo> = {
  "1": {
    id: "1",
    name: "Lớp 10A1",
    code: "10A1",
    description: "Nhóm chat chính thức của lớp 10A1. Nơi trao đổi thông tin và học tập.",
    participants: 35,
    totalMessages: 245,
    createdAt: "01/09/2024",
    status: "Hoạt động",
  },
  "2": {
    id: "2",
    name: "Lớp 10A2",
    code: "10A2",
    description: "Nhóm chat chính thức của lớp 10A2.",
    participants: 32,
    totalMessages: 189,
    createdAt: "01/09/2024",
    status: "Hoạt động",
  },
  "3": {
    id: "3",
    name: "Lớp 11B1",
    code: "11B1",
    participants: 30,
    totalMessages: 156,
    createdAt: "01/09/2024",
    status: "Hoạt động",
  },
  "4": {
    id: "4",
    name: "Lớp 12C1",
    code: "12C1",
    participants: 28,
    totalMessages: 98,
    createdAt: "01/09/2024",
    status: "Tạm dừng",
  },
};

const mockParticipants: ChatParticipant[] = [
  { id: "1", name: "Nguyễn Văn A", avatar: "", role: "admin", isOnline: true },
  { id: "2", name: "Trần Thị B", avatar: "", role: "teacher", isOnline: true },
  { id: "3", name: "Lê Văn C", avatar: "", role: "student", isOnline: false, lastSeen: "5 phút trước" },
  { id: "4", name: "Phạm Thị D", avatar: "", role: "student", isOnline: true },
  { id: "5", name: "Bùi Văn E", avatar: "", role: "student", isOnline: false, lastSeen: "1 giờ trước" },
  { id: "6", name: "Đỗ Thị F", avatar: "", role: "student", isOnline: true },
  { id: "7", name: "Võ Văn G", avatar: "", role: "student", isOnline: true },
  { id: "8", name: "Hồ Thị H", avatar: "", role: "student", isOnline: false, lastSeen: "30 phút trước" },
];

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: "1",
    senderName: "Nguyễn Văn A",
    senderAvatar: "",
    content: "Chào mừng các bạn đến với nhóm chat lớp 10A1!",
    timestamp: "08:00",
    isOwn: false,
  },
  {
    id: "2",
    senderId: "2",
    senderName: "Trần Thị B",
    senderAvatar: "",
    content: "Cảm ơn thầy! Em rất vui được tham gia nhóm.",
    timestamp: "08:05",
    isOwn: false,
  },
  {
    id: "3",
    senderId: "current",
    senderName: "Bạn",
    senderAvatar: "",
    content: "Chào mọi người! Em cũng rất vui được tham gia.",
    timestamp: "08:10",
    isOwn: true,
  },
  {
    id: "4",
    senderId: "4",
    senderName: "Phạm Thị D",
    senderAvatar: "",
    content: "Có ai biết bài tập toán hôm nay không ạ?",
    timestamp: "09:15",
    isOwn: false,
  },
  {
    id: "5",
    senderId: "2",
    senderName: "Trần Thị B",
    senderAvatar: "",
    content: "Bài tập toán các em làm từ trang 45 đến trang 50 nhé!",
    timestamp: "09:20",
    isOwn: false,
  },
  {
    id: "6",
    senderId: "current",
    senderName: "Bạn",
    senderAvatar: "",
    content: "Cảm ơn cô! Em sẽ làm ngay.",
    timestamp: "09:25",
    isOwn: true,
  },
];

export default function ClassChatDetail() {
  const params = useParams();
  const router = useRouter();
  const { message } = App.useApp();
  const chatId = params?.id as string;
  const currentUserId = "current";

  const [groupInfo, setGroupInfo] = useState<ChatGroupInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [participants] = useState<ChatParticipant[]>(mockParticipants);

  useEffect(() => {
    const data = mockGroupData[chatId];
    if (data) {
      setGroupInfo(data);
    } else {
      message.error("Không tìm thấy nhóm chat");
      router.push("/admin/class-chat");
    }
  }, [chatId, router, message]);

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: "Bạn",
      senderAvatar: "",
      content,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  if (!groupInfo) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-112px)] border border-gray-200 overflow-hidden rounded-md flex flex-col bg-white">
      {/* Main Chat Layout - 3 columns */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Participants */}
        <div className="w-80 shrink-0 h-full">
          <ChatLeftSidebar participants={participants} />
        </div>

        {/* Center - Chat Messages */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <ChatCenter messages={messages} currentUserId={currentUserId} groupName={groupInfo.name} onSendMessage={handleSendMessage} />
        </div>

        {/* Right Sidebar - Group Info */}
        <div className="w-80 shrink-0 h-full">
          <ChatRightSidebar groupInfo={groupInfo} />
        </div>
      </div>
    </div>
  );
}
