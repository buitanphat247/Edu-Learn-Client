"use client";

import { Avatar, Badge, Input } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import type { ChatParticipant } from "./types";

export interface PrivateChat {
  id: string;
  participant: ChatParticipant;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
}

interface PrivateChatListProps {
  chats: PrivateChat[];
  onChatClick?: (chat: PrivateChat) => void;
  onCreateGroup?: () => void;
}

export default function PrivateChatList({ chats, onChatClick, onCreateGroup }: PrivateChatListProps) {
  return (
    <div className="h-full flex flex-col border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="rounded flex-1"
          />
          <button
            onClick={onCreateGroup}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer text-sm font-medium"
          >
            Tạo nhóm
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-0">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatClick?.(chat)}
              className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
            >
              <Badge dot={chat.participant.isOnline} color="green" offset={[-2, 2]}>
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  src={chat.participant.avatar}
                  className="bg-linear-to-br from-blue-400 to-purple-400"
                >
                  {chat.participant.name.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-800 truncate">{chat.participant.name}</span>
                  {chat.unreadCount && chat.unreadCount > 0 && (
                    <Badge count={chat.unreadCount} size="small" />
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                <span className="text-xs text-gray-400">{chat.lastMessageTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

