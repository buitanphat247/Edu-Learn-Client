"use client";

import { useState, useCallback } from "react";
import { Typography, Button, Space, Breadcrumb, Modal, Form, Input, Switch, Divider, App } from "antd";
import { PlusOutlined, KeyOutlined, RobotOutlined, UserOutlined, TeamOutlined, SafetyOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

// Sub-components
import RoleSidebar from "./components/RoleSidebar";
import PermissionMatrix from "./components/PermissionMatrix";
import { Role } from "./types";

const { Title, Text } = Typography;

const MODULES = ["Dashboard", "Tài khoản", "Lớp học", "Đề thi (RAG)", "Tài liệu Crawl", "Tin tức & Bài viết", "Sự kiện", "Phân quyền"];

const ACTIONS = [
  { key: "view", label: "Xem", color: "blue" },
  { key: "create", label: "Tạo mới", color: "green" },
  { key: "edit", label: "Chỉnh sửa", color: "orange" },
  { key: "delete", label: "Xóa", color: "red" },
  { key: "approve", label: "Duyệt", color: "purple" },
];

const mockRoles: Role[] = [
  { id: "1", name: "Super Admin", color: "red", icon: <RobotOutlined />, permissions: ["all"], status: "active" },
  {
    id: "2",
    name: "Admin",
    color: "blue",
    icon: <SafetyOutlined />,
    permissions: ["dash_view", "user_view", "user_edit", "class_view"],
    status: "active",
  },
  {
    id: "3",
    name: "Giáo viên",
    color: "green",
    icon: <TeamOutlined />,
    permissions: ["class_view", "class_edit", "exam_view", "exam_create"],
    status: "active",
  },
  { id: "4", name: "Học sinh", color: "gold", icon: <UserOutlined />, permissions: ["dash_view", "class_view"], status: "active" },
];

export default function PermissionPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [searchRole, setSearchRole] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(mockRoles[0]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const handleSaveMatrix = useCallback(() => {
    message.success("Đã cập nhật bảng phân quyền thành công!");
  }, [message]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Roles Panel - SEPARATED */}
        <div className="col-span-12 lg:col-span-4">
          <RoleSidebar
            roles={mockRoles}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            searchRole={searchRole}
            onSearchChange={setSearchRole}
            onAddRole={() => setIsRoleModalOpen(true)}
          />
        </div>

        {/* Permissions Matrix Area - SEPARATED */}
        <div className="col-span-12 lg:col-span-8">
          <PermissionMatrix selectedRole={selectedRole} modules={MODULES} actions={ACTIONS} onSave={handleSaveMatrix} />
        </div>
      </div>

      {/* New Role Modal */}
      <Modal
        title={
          <Space>
            <KeyOutlined className="text-blue-500" />
            <span>Thêm / Chỉnh sửa Vai trò</span>
          </Space>
        }
        open={isRoleModalOpen}
        onCancel={() => setIsRoleModalOpen(false)}
        onOk={() => {
          message.success("Đã cập nhật vai trò!");
          setIsRoleModalOpen(false);
        }}
        okText="Lưu lại"
        cancelText="Hủy"
        width={500}
        centered
        className="rounded-2xl overflow-hidden"
      >
        <Form layout="vertical" className="pt-4">
          <Form.Item label="Tên vai trò" required>
            <Input placeholder="Ví dụ: Moderator, Content Creator..." className="h-10 rounded-lg" />
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input.TextArea placeholder="Mô tả chức năng của vai trò này" rows={3} className="rounded-lg" />
          </Form.Item>
          <Form.Item label="Mã màu nhận diện">
            <div className="flex gap-3">
              {["blue", "red", "green", "gold", "purple", "magenta"].map((c) => (
                <div
                  key={c}
                  className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all ${
                    c === "blue" ? "border-gray-800 scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c === "gold" ? "#faad14" : c === "magenta" ? "#eb2f96" : c }}
                />
              ))}
            </div>
          </Form.Item>
          <Divider />
          <Form.Item label="Trạng thái kích hoạt">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
              <Text>Cho phép các tài khoản thuộc vai trò này đăng nhập và hoạt động</Text>
              <Switch defaultChecked />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
