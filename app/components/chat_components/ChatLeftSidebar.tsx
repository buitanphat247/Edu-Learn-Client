"use client";

import { Avatar, Badge, Input } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import CustomCard from "@/app/components/CustomCard";
import type { ChatParticipant } from "./types";

interface ChatLeftSidebarProps {
  participants: ChatParticipant[];
  onParticipantClick?: (participant: ChatParticipant) => void;
}

export default function ChatLeftSidebar({ participants, onParticipantClick }: ChatLeftSidebarProps) {
  return (
    // <CustomCard bodyClassName="p-0 h-full flex flex-col" className="h-full">
    <div className="h-full flex flex-col border-r border-gray-200">
      {/* Header */}
      <div className="p-4">
        <Input placeholder="Tìm kiếm thành viên..." prefix={<SearchOutlined className="text-gray-400" />} className="rounded" />
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-0">
          {participants.map((participant) => (
            <div
              key={participant.id}
              onClick={() => onParticipantClick?.(participant)}
              className="flex items-center gap-3 p-2.5 rounded hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <Badge dot={participant.isOnline} color="green" offset={[-2, 2]}>
                <Avatar size={40} icon={<UserOutlined />} src={participant.avatar} className="bg-linear-to-br from-blue-400 to-purple-400">
                  {participant.name.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 truncate">{participant.name}</span>
                  {participant.role === "admin" && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-sm">Admin</span>}
                  {participant.role === "teacher" && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-sm">GV</span>}
                </div>
                {participant.isOnline ? (
                  <span className="text-xs text-green-600">Đang hoạt động</span>
                ) : (
                  <span className="text-xs text-gray-500">{participant.lastSeen || "Không hoạt động"}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
