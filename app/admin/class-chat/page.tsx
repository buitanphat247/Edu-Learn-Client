"use client";

import { useState } from "react";
import { Tabs, App, Input, Avatar, Badge } from "antd";
import { SearchOutlined, UserOutlined, PlusOutlined, MessageOutlined } from "@ant-design/icons";
import ChatCenter from "@/app/components/chat/ChatCenter";
import ChatRightSidebar from "@/app/components/chat/ChatRightSidebar";
import ChatLeftSidebar from "@/app/components/chat/ChatLeftSidebar";
import EmptyChatCenter from "@/app/components/chat/EmptyChatCenter";
import CreateGroupChatModal from "@/app/components/chat/CreateGroupChatModal";
import type { ChatMessage, ChatGroupInfo, ChatParticipant } from "@/interface/chat";
import type { PrivateChat } from "@/app/components/chat/PrivateChatList";

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
  {
    id: "4",
    participant: { id: "4", name: "Phạm Thị D", avatar: "", role: "student", isOnline: true },
    lastMessage: "Cảm ơn bạn đã giúp đỡ!",
    lastMessageTime: "2 giờ trước",
    unreadCount: 0,
  },
  {
    id: "5",
    participant: { id: "5", name: "Bùi Văn E", avatar: "", role: "student", isOnline: false, lastSeen: "30 phút trước" },
    lastMessage: "Bài tập hôm nay các em làm xong chưa?",
    lastMessageTime: "3 giờ trước",
    unreadCount: 3,
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
  {
    id: "4",
    name: "Lớp 12C1",
    code: "12C1",
    participants: 28,
    totalMessages: 98,
    createdAt: "01/09/2024",
    status: "Tạm dừng",
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

const mockParticipants: ChatParticipant[] = [
  { id: "1", name: "Nguyễn Văn A", avatar: "", role: "admin", isOnline: true },
  { id: "2", name: "Trần Thị B", avatar: "", role: "teacher", isOnline: true },
  { id: "3", name: "Lê Văn C", avatar: "", role: "student", isOnline: false, lastSeen: "5 phút trước" },
  { id: "4", name: "Phạm Thị D", avatar: "", role: "student", isOnline: true },
];

export default function AdminClassChat() {
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState<"private" | "group">("private");
  const [selectedChat, setSelectedChat] = useState<ChatGroupInfo | null>(null);
  const [selectedChatName, setSelectedChatName] = useState<string>("");
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

  const handleChatClick = (chatId: string, isGroup: boolean) => {
    if (isGroup) {
      const group = mockGroups.find((g) => g.id === chatId);
      if (group) {
        setSelectedChat(group);
        setSelectedChatName(group.name);
        setMessages(mockMessages);
      }
    } else {
      const privateChat = mockPrivateChats.find((c) => c.id === chatId);
      if (privateChat) {
        // Create mock group info for private chat
        const mockGroup: ChatGroupInfo = {
          id: chatId,
          name: privateChat.participant.name,
          code: "",
          participants: 2,
          totalMessages: 0,
          createdAt: new Date().toLocaleDateString("vi-VN"),
          status: "Hoạt động",
        };
        setSelectedChat(mockGroup);
        setSelectedChatName(privateChat.participant.name);
        setMessages([
          {
            id: "1",
            senderId: privateChat.participant.id,
            senderName: privateChat.participant.name,
            senderAvatar: "",
            content: privateChat.lastMessage,
            timestamp: privateChat.lastMessageTime,
            isOwn: false,
          },
        ]);
      }
    }
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
    <div className="h-full flex overflow-hidden bg-white">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 shrink-0 flex flex-col border-r border-gray-200 bg-white">
        {/* Header with Search and Create Group */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3 px-4 pt-4">
            <Input placeholder="Tìm kiếm" prefix={<SearchOutlined className="text-gray-400" />} className="rounded flex-1" />
            <button onClick={() => setIsCreateModalOpen(true)} className="p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors">
              <PlusOutlined className="text-lg text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors">
              <UserOutlined className="text-lg text-gray-600" />
            </button>
          </div>
          <div className="px-0">
            <Tabs
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key as "private" | "group");
                setSelectedChat(null);
                setSelectedChatName("");
                setMessages([]);
              }}
              items={[
                {
                  key: "private",
                  label: "Friends",
                },
                {
                  key: "group",
                  label: "Group",
                },
              ]}
              className="cursor-pointer [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-nav]:px-4"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="space-y-0">
            {activeTab === "private"
              ? mockPrivateChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id, false)}
                    className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                      selectedChat?.id === chat.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <Badge dot={chat.participant.isOnline} color="green" offset={[-2, 2]}>
                      <Avatar size={48} icon={<UserOutlined />} src={chat.participant.avatar || undefined} className="bg-linear-to-br from-blue-400 to-purple-400">
                        {chat.participant.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800 truncate">{chat.participant.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{chat.lastMessageTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex-1">{chat.lastMessage}</p>
                        {chat.unreadCount && chat.unreadCount > 0 && <Badge count={chat.unreadCount} size="small" className="ml-2" />}
                      </div>
                    </div>
                  </div>
                ))
              : mockGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => handleChatClick(group.id, true)}
                    className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                      selectedChat?.id === group.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <Avatar size={48} icon={<UserOutlined />} className="bg-linear-to-br from-blue-400 to-purple-400">
                      {group.name.charAt(0)}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800 truncate">{group.name}</span>
                          <MessageOutlined className="text-xs text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-400 ml-2">Hôm nay</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {group.totalMessages} tin nhắn • {group.participants} thành viên
                        </p>
                        {group.totalMessages > 0 && (
                          <Badge count={group.totalMessages > 99 ? "99+" : group.totalMessages} size="small" className="ml-2" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {selectedChat ? (
          <>
            {/* Center - Chat Messages */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
              <ChatCenter messages={messages} currentUserId={currentUserId} groupName={selectedChatName} onSendMessage={handleSendMessage} />
            </div>

            {/* Right Sidebar - Group Info */}
            <div className="w-80 shrink-0 h-full">
              <ChatRightSidebar groupInfo={selectedChat} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <EmptyChatCenter />
          </div>
        )}
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
