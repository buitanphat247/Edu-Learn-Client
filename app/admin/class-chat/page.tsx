"use client";

import { useState } from "react";
import { Tabs, App } from "antd";
import PrivateChatList, { type PrivateChat } from "@/app/components/chat_components/PrivateChatList";
import GroupChatList from "@/app/components/chat_components/GroupChatList";
import ChatCenter from "@/app/components/chat_components/ChatCenter";
import ChatRightSidebar from "@/app/components/chat_components/ChatRightSidebar";
import EmptyChatCenter from "@/app/components/chat_components/EmptyChatCenter";
import CreateGroupChatModal from "@/app/components/modal_components/CreateGroupChatModal";
import type { ChatMessage, ChatGroupInfo } from "@/app/components/chat_components/types";

// Mock data
const mockPrivateChats: PrivateChat[] = [
  {
    id: "1",
    participant: { id: "1", name: "Nguyễn Văn A", avatar: "", role: "admin", isOnline: true },
    lastMessage: "Cảm ơn bạn đã giúp đỡ!",
    lastMessageTime: "2 phút trước",
    unreadCount: 2,
  },
  {
    id: "2",
    participant: { id: "2", name: "Trần Thị B", avatar: "", role: "teacher", isOnline: true },
    lastMessage: "Bài tập hôm nay các em làm xong chưa?",
    lastMessageTime: "15 phút trước",
    unreadCount: 0,
  },
  {
    id: "3",
    participant: { id: "3", name: "Lê Văn C", avatar: "", role: "student", isOnline: false, lastSeen: "5 phút trước" },
    lastMessage: "Em sẽ nộp bài sau ạ",
    lastMessageTime: "1 giờ trước",
    unreadCount: 1,
  },
];

const mockGroups: ChatGroupInfo[] = [
  {
    id: "1",
    name: "Lớp 10A1",
    code: "10A1",
    description: "Nhóm chat chính thức của lớp 10A1. Nơi trao đổi thông tin và học tập.",
    participants: 35,
    totalMessages: 245,
    createdAt: "01/09/2024",
    status: "Hoạt động",
  },
  {
    id: "2",
    name: "Lớp 10A2",
    code: "10A2",
    description: "Nhóm chat chính thức của lớp 10A2.",
    participants: 32,
    totalMessages: 189,
    createdAt: "01/09/2024",
    status: "Hoạt động",
  },
  {
    id: "3",
    name: "Lớp 11B1",
    code: "11B1",
    participants: 30,
    totalMessages: 156,
    createdAt: "01/09/2024",
    status: "Hoạt động",
  },
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
];

export default function AdminClassChat() {
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState<"private" | "group">("private");
  const [selectedChat, setSelectedChat] = useState<ChatGroupInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const currentUserId = "current";

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      message.warning("Vui lòng nhập tên nhóm chat");
      return;
    }
    message.success(`Đã tạo nhóm chat "${newGroupName.trim()}" (mock)`);
    setNewGroupName("");
    setIsCreateModalOpen(false);
  };

  const handleGroupClick = (group: ChatGroupInfo) => {
    setSelectedChat(group);
    setMessages(mockMessages);
  };

  const handlePrivateChatClick = (chat: any) => {
    // Mock: tạo group info từ private chat
    const mockGroup: ChatGroupInfo = {
      id: chat.id,
      name: chat.participant.name,
      code: "",
      participants: 2,
      totalMessages: 0,
      createdAt: new Date().toLocaleDateString("vi-VN"),
      status: "Hoạt động",
    };
    setSelectedChat(mockGroup);
    setMessages([
      {
        id: "1",
        senderId: chat.participant.id,
        senderName: chat.participant.name,
        senderAvatar: "",
        content: chat.lastMessage,
        timestamp: chat.lastMessageTime,
        isOwn: false,
      },
    ]);
  };

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

  return (
    <div className="h-[calc(100vh-112px)] border border-gray-200 overflow-hidden rounded-md flex flex-col bg-white">
      {/* Tabs */}
      <div className="border-b border-gray-200 px-4 bg-white">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key as "private" | "group");
            setSelectedChat(null);
            setMessages([]);
          }}
          items={[
            {
              key: "private",
              label: "Chat riêng tư",
            },
            {
              key: "group",
              label: "Group",
            },
          ]}
          className="cursor-pointer"
        />
      </div>

      {/* Main Chat Layout - 3 columns */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Chat List */}
        <div className="w-80 shrink-0 h-full">
          {activeTab === "private" ? (
            <PrivateChatList
              chats={mockPrivateChats}
              onChatClick={handlePrivateChatClick}
              onCreateGroup={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <GroupChatList
              groups={mockGroups}
              onGroupClick={handleGroupClick}
              onCreateGroup={() => setIsCreateModalOpen(true)}
            />
          )}
        </div>

        {/* Center - Chat Messages */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {selectedChat ? (
            <ChatCenter
              messages={messages}
              currentUserId={currentUserId}
              groupName={selectedChat.name}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <EmptyChatCenter />
          )}
        </div>

        {/* Right Sidebar - Group Info */}
        <div className="w-80 shrink-0 h-full">
          {selectedChat ? (
            <ChatRightSidebar groupInfo={selectedChat} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 border-l border-gray-200">
              <div className="text-center text-gray-400">
                <p>Chọn một cuộc trò chuyện để xem thông tin</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateGroupChatModal
        open={isCreateModalOpen}
        groupName={newGroupName}
        onGroupNameChange={setNewGroupName}
        onOk={handleCreateGroup}
        onCancel={() => {
          setIsCreateModalOpen(false);
          setNewGroupName("");
        }}
      />
    </div>
  );
}
