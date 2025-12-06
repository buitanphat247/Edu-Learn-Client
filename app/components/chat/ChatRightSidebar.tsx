"use client";

import { Avatar, Tag, Descriptions, Button, Divider } from "antd";
import { SettingOutlined, UserOutlined, InfoCircleOutlined, MoreOutlined } from "@ant-design/icons";
import CustomCard from "@/app/components/common/CustomCard";
import type { ChatGroupInfo } from "@/interface/chat";

interface ChatRightSidebarProps {
  groupInfo: ChatGroupInfo;
  onSettingsClick?: () => void;
}

export default function ChatRightSidebar({ groupInfo, onSettingsClick }: ChatRightSidebarProps) {
  return (
    // <CustomCard bodyClassName="p-0 h-full flex flex-col" className="h-full">
    <div className="h-full flex flex-col border-l border-gray-200 bg-white">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800">Thông tin nhóm</h3>
          <Button icon={<SettingOutlined />} type="text" onClick={onSettingsClick} className="cursor-pointer" />
        </div>
        <div className="flex items-center gap-3">
          <Avatar size={60} icon={<UserOutlined />} className="bg-linear-to-br from-blue-400 to-purple-400">
            {groupInfo.name.charAt(0)}
          </Avatar>
          <div>
            <h4 className="font-semibold text-gray-800">{groupInfo.name}</h4>
            <p className="text-sm text-gray-500">{groupInfo.code}</p>
            <Tag color={groupInfo.status === "Hoạt động" ? "green" : "orange"} className="mt-1">
              {groupInfo.status}
            </Tag>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <InfoCircleOutlined className="text-blue-500" />
              <h4 className="font-semibold text-gray-800">Thông tin chung</h4>
            </div>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Tên nhóm">{groupInfo.name}</Descriptions.Item>
              <Descriptions.Item label="Mã lớp">{groupInfo.code}</Descriptions.Item>
              <Descriptions.Item label="Thành viên">{groupInfo.participants} người</Descriptions.Item>
              <Descriptions.Item label="Tin nhắn">{groupInfo.totalMessages} tin nhắn</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{groupInfo.createdAt}</Descriptions.Item>
            </Descriptions>
          </div>

          {groupInfo.description && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Mô tả</h4>
              <p className="text-sm text-gray-600">{groupInfo.description}</p>
            </div>
          )}

          <Divider />

          {/* Actions */}
          <div className="space-y-2">
            <Button block icon={<MoreOutlined />} className="cursor-pointer">
              Quản lý thành viên
            </Button>
            <Button block icon={<SettingOutlined />} className="cursor-pointer">
              Cài đặt nhóm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
