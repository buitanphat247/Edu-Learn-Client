"use client";

import { Avatar, Badge, Input, Button } from "antd";
import { SearchOutlined, UserOutlined, MessageOutlined } from "@ant-design/icons";
import type { ChatGroupInfo } from "@/interface/chat";

interface GroupChatListProps {
  groups: ChatGroupInfo[];
  onGroupClick?: (group: ChatGroupInfo) => void;
  onCreateGroup?: () => void;
}

export default function GroupChatList({ groups, onGroupClick, onCreateGroup }: GroupChatListProps) {
  return (
    <div className="h-full flex flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Input
            placeholder="Tìm kiếm nhóm..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="rounded flex-1"
          />
          <Button
            icon={<MessageOutlined />}
            type="primary"
            onClick={onCreateGroup}
            className="cursor-pointer"
          >
            Tạo nhóm
          </Button>
        </div>
      </div>

      {/* Group List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-0">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => onGroupClick?.(group)}
              className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
            >
              <Avatar
                size={48}
                icon={<UserOutlined />}
                className="bg-linear-to-br from-blue-400 to-purple-400"
              >
                {group.name.charAt(0)}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-800 truncate">{group.name}</span>
                  <Badge count={group.totalMessages} showZero={false} size="small" />
                </div>
                <p className="text-sm text-gray-600 truncate">{group.code}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{group.participants} thành viên</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">{group.totalMessages} tin nhắn</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


