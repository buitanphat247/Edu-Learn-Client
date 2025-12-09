"use client";

import { Modal, Descriptions, Avatar, Tag, Typography, Spin } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, CalendarOutlined } from "@ant-design/icons";
import type { UserInfoResponse } from "@/lib/api/users";

const { Title, Text } = Typography;

interface UserDetailModalProps {
  open: boolean;
  onCancel: () => void;
  userDetail: UserInfoResponse | null;
  loading?: boolean;
}

export default function UserDetailModal({ open, onCancel, userDetail, loading = false }: UserDetailModalProps) {
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const roleMap: Record<number, { color: string; text: string }> = {
    1: { color: "red", text: "Admin" },
    2: { color: "blue", text: "Giảng viên" },
    3: { color: "green", text: "Học sinh" },
  };

  const roleInfo = userDetail
    ? roleMap[userDetail.role_id || 3] || { color: "default", text: userDetail.role?.role_name || "N/A" }
    : { color: "default", text: "N/A" };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <UserOutlined className="text-blue-500 text-xl" />
          <span>Chi tiết người dùng</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
      className="user-detail-modal"
      destroyOnClose={false}
      maskClosable={true}
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="small" />
        </div>
      ) : userDetail ? (
        <div className="space-y-3">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
            <Avatar
              size={100}
              src={userDetail.avatar}
              icon={<UserOutlined />}
              className="border-4 border-blue-100 shadow-lg"
            />
            <div className="flex-1">
              <Title level={4} className=" text-gray-800" style={{ marginBottom: '0.5rem' }}>
                {userDetail.fullname}
              </Title>
              <Text type="secondary" className="text-base block mb-1">
                @{userDetail.username}
              </Text>
              <Tag color={roleInfo.color} className="px-3 py-1 text-sm font-semibold">
                {userDetail.role?.role_name}
              </Tag>
            </div>
          </div>

          {/* Detailed Information */}
          <Descriptions
            column={1}
            bordered
            size="middle"
            labelStyle={{
              backgroundColor: "#f5f5f5",
              fontWeight: 600,
              width: "180px",
            }}
            contentStyle={{
              backgroundColor: "#fff",
            }}
          >
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <IdcardOutlined className="text-blue-500" />
                  <span>User ID</span>
                </span>
              }
            >
              <Text strong className="text-gray-700">
                {userDetail.user_id}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <UserOutlined className="text-blue-500" />
                  <span>Username</span>
                </span>
              }
            >
              <Text className="text-gray-700">{userDetail.username}</Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <UserOutlined className="text-blue-500" />
                  <span>Họ và tên</span>
                </span>
              }
            >
              <Text className="text-gray-700">{userDetail.fullname}</Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <MailOutlined className="text-blue-500" />
                  <span>Email</span>
                </span>
              }
            >
              <Text className="text-gray-700">{userDetail.email}</Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <PhoneOutlined className="text-blue-500" />
                  <span>Số điện thoại</span>
                </span>
              }
            >
              <Text className="text-gray-700">{userDetail.phone || "-"}</Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <IdcardOutlined className="text-blue-500" />
                  <span>Vai trò</span>
                </span>
              }
            >
              <div className="flex items-center gap-2">
                <Tag color={roleInfo.color} className="px-2 py-1">
                  {userDetail.role?.role_name}
                </Tag>
                <Text type="secondary" className="text-sm">
                  (Role ID: {userDetail.role_id || userDetail.role?.role_id || "N/A"})
                </Text>
              </div>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <CalendarOutlined className="text-blue-500" />
                  <span>Ngày tạo</span>
                </span>
              }
            >
              <Text className="text-gray-700">{formatDateTime(userDetail.created_at)}</Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <CalendarOutlined className="text-blue-500" />
                  <span>Ngày cập nhật</span>
                </span>
              }
            >
              <Text className="text-gray-700">{formatDateTime(userDetail.updated_at)}</Text>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : null}
    </Modal>
  );
}
