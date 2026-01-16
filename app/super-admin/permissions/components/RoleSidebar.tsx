"use client";

import { Card, Space, Input, Typography, Switch, Button, Table } from "antd";
import { SearchOutlined, TeamOutlined, SafetyOutlined, PlusOutlined } from "@ant-design/icons";
import { Role } from "@/app/super-admin/permissions/types";

const { Text, Paragraph } = Typography;

interface RoleSidebarProps {
  roles: Role[];
  selectedRole: Role | null;
  onSelectRole: (role: Role) => void;
  searchRole: string;
  onSearchChange: (value: string) => void;
  onAddRole: () => void;
}

export default function RoleSidebar({ roles, selectedRole, onSelectRole, searchRole, onSearchChange, onAddRole }: RoleSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50/30 border-b border-gray-100 flex items-center justify-between">
          <Space>
            <TeamOutlined className="text-blue-500" />
            <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">Danh sách vai trò</span>
          </Space>
          <Button type="text" icon={<PlusOutlined />} size="small" className="text-blue-600 hover:bg-blue-50 rounded" onClick={onAddRole} />
        </div>

        <div className="p-3 border-b border-gray-50">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Tìm kiếm..."
            size="small"
            className="rounded h-8 text-xs border-gray-200"
            value={searchRole}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Table<Role>
          dataSource={roles.filter((r) => r.name.toLowerCase().includes(searchRole.toLowerCase()))}
          pagination={false}
          showHeader={false}
          rowKey="id"
          onRow={(record: Role) => ({
            onClick: () => onSelectRole(record),
            className: `cursor-pointer transition-all ${selectedRole?.id === record.id ? "bg-blue-50/50" : ""}`,
          })}
          className="role-selection-table"
          columns={[
            {
              title: "Vai trò",
              key: "role",
              render: (_: any, record: Role) => (
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      selectedRole?.id === record.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {record.icon}
                  </div>
                  <div className="flex flex-col">
                    <Text className={`text-[13px] font-medium ${selectedRole?.id === record.id ? "text-blue-600" : "text-gray-700"}`}>
                      {record.name}
                    </Text>
                    <Text className="text-[10px] text-gray-400">
                      {record.permissions.includes("all") ? "Toàn quyền" : `${record.permissions.length} quyền`}
                    </Text>
                  </div>
                </div>
              ),
            },
            {
              title: "Trạng thái",
              key: "status",
              align: "right",
              render: (_: any, record: Role) => (
                <Switch size="small" checked={record.status === "active"} className={record.status === "active" ? "bg-blue-600" : ""} />
              ),
            },
          ]}
        />
      </div>

      <style jsx global>{`
        .role-selection-table .ant-table-cell {
          padding: 12px 16px !important;
          border-bottom: 1px solid #f8fafc !important;
        }
        .role-selection-table .ant-table-row:last-child .ant-table-cell {
          border-bottom: none !important;
        }
        .role-selection-table .ant-table-row:hover > td {
          background-color: #f1f5f9 !important;
        }
      `}</style>

      <div
        className="rounded-md overflow-hidden relative border-0 p-4"
        style={{ background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)" }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <Space direction="vertical" size="small" className="w-full">
            <Space size="small">
              <SafetyOutlined className="text-lg text-white" />
              <span className="text-white font-bold text-base">Bảo mật hệ thống</span>
            </Space>
            <div className="text-indigo-100 text-[11px] m-0 leading-relaxed opacity-90">
              Việc thay đổi phân quyền sẽ ảnh hưởng ngay lập tức đến các tài khoản liên quan. Yêu cầu thận trọng khi chỉnh sửa vai trò Super Admin.
            </div>
            <div className="pt-2">
              <button
                className="w-full py-2 rounded-md border border-white/30 text-white text-xs font-semibold transition-colors cursor-pointer"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)")}
              >
                Xem nhật ký thay đổi
              </button>
            </div>
          </Space>
        </div>
      </div>
    </div>
  );
}
