"use client";

import { useState } from "react";
import { Card, Button, Typography, Table, Tag, Checkbox, Tabs, Switch, Badge } from "antd";
import { SaveOutlined, ApiOutlined, LockOutlined, GlobalOutlined } from "@ant-design/icons";
import { Role } from "@/app/super-admin/permissions/types";

const { Title, Text } = Typography;

interface PermissionMatrixProps {
  selectedRole: Role | null;
  modules: string[];
  actions: { key: string; label: string; color: string }[];
  onSave: () => void;
}

const mockApiEndpoints = [
  { key: "1", path: "/api/v1/users", method: "GET", description: "Lấy danh sách người dùng", status: true },
  { key: "2", path: "/api/v1/users", method: "POST", description: "Tạo người dùng mới", status: true },
  { key: "3", path: "/api/v1/classes", method: "GET", description: "Lấy danh sách lớp học", status: true },
  { key: "4", path: "/api/v1/exams/rag", method: "POST", description: "Tạo đề thi bằng AI", status: false },
  { key: "5", path: "/api/v1/system/config", method: "PATCH", description: "Cập nhật cấu hình hệ thống", status: false },
  { key: "6", path: "/api/v1/admin/logs", method: "GET", description: "Xem nhật ký hệ thống", status: true },
];

export default function PermissionMatrix({ selectedRole, modules, actions, onSave }: PermissionMatrixProps) {
  const [activeTab, setActiveTab] = useState("matrix");

  const matrixData = modules.map((module) => ({
    key: module,
    module: module,
    ...actions.reduce((acc, action) => ({ ...acc, [action.key]: true }), {}),
  }));

  const apiColumns = [
    {
      title: "Đường dẫn API (Path)",
      dataIndex: "path",
      key: "path",
      render: (text: string, record: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Tag
              color={record.method === "GET" ? "blue" : record.method === "POST" ? "green" : record.method === "PATCH" ? "orange" : "red"}
              className="m-0 font-bold text-[10px] w-14 text-center"
            >
              {record.method}
            </Tag>
            <code className="text-blue-600 font-bold text-[13px] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{text}</code>
          </div>
          <Text type="secondary" className="text-[11px] italic text-gray-400">
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: "Quản lý truy cập",
      key: "access",
      align: "center" as const,
      width: 200,
      render: (_: any, record: any) => (
        <div className="flex items-center justify-center gap-4">
          <div
            className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
              record.status ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-400 border-gray-200"
            }`}
          >
            {record.status ? "ĐANG KÍCH HOẠT" : "ĐÃ VÔ HIỆU"}
          </div>
          <Switch defaultChecked={record.status} size="default" className={record.status ? "bg-blue-600" : ""} />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* True Basic Header with Save button */}
      <div className="mb-2">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="basic-tabs"
          tabBarExtraContent={
            <Button type="primary" size="small" className="bg-blue-600 hover:bg-blue-700 border-0 rounded px-3 h-7 text-[12px]" onClick={onSave}>
              Lưu thay đổi
            </Button>
          }
          items={[
            {
              key: "matrix",
              label: <span className="text-[13px]">Ma trận quyền</span>,
            },
            {
              key: "api",
              label: <span className="text-[13px]">Cấu hình API</span>,
            },
          ]}
        />
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === "matrix" ? (
          <div className="permission-content-wrapper">
            <Table<any> dataSource={matrixData} pagination={false} size="small" className="basic-minimal-table">
              <Table.Column
                title="CHỨC NĂNG"
                dataIndex="module"
                key="module"
                render={(text) => <Text className="text-gray-600 text-[13px] py-0.5 block">{text}</Text>}
              />
              {actions.map((action) => (
                <Table.Column
                  key={action.key}
                  title={<span className="text-[10px] font-medium text-gray-500 uppercase">{action.label}</span>}
                  align="center"
                  width={90}
                  render={() => (
                    <div className="flex justify-center items-center w-full py-0.5">
                      <Checkbox defaultChecked={selectedRole?.permissions.includes("all")} />
                    </div>
                  )}
                />
              ))}
            </Table>
          </div>
        ) : (
          <div className="api-config-wrapper">
            <Table<any>
              columns={apiColumns.map((col) => ({
                ...col,
                title: <span className="text-[10px] uppercase font-medium text-gray-500">{String(col.title)}</span>,
              }))}
              dataSource={mockApiEndpoints}
              pagination={false}
              size="small"
              className="basic-minimal-table"
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        .basic-tabs .ant-tabs-nav {
          margin-bottom: 0 !important;
        }
        .basic-tabs .ant-tabs-nav::before {
          border-bottom: 2px solid #f1f5f9 !important;
        }
        .basic-tabs .ant-tabs-tab {
          padding: 10px 4px !important;
          margin: 0 32px 0 0 !important;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }
        .basic-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #2563eb !important;
          font-weight: 700;
        }
        .basic-tabs .ant-tabs-ink-bar {
          height: 3px !important;
          border-radius: 3px 3px 0 0;
          background: #2563eb !important;
        }

        .basic-minimal-table .ant-table-thead > tr > th {
          background: #f8fafc !important;
          color: #1e293b !important;
          padding: 14px 16px !important;
          border-bottom: 1px solid #e2e8f0 !important;
          font-weight: 700 !important;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
        .basic-minimal-table .ant-table-tbody > tr > td {
          padding: 12px 16px !important;
          border-bottom: 1px solid #f1f5f9;
          font-size: 13px;
          color: #334155;
        }
        .basic-minimal-table .ant-table-row:hover > td {
          background-color: #f1f5f9 !important;
        }

        .basic-minimal-table {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        /* Checkbox styling - Vibrant & Clear */
        .ant-checkbox-inner {
          border-radius: 4px;
          border-color: #d1d5db;
          width: 19px;
          height: 19px;
        }
        .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #3b82f6 !important; /* Standard vibrant blue */
          border-color: #3b82f6 !important;
        }
        .ant-checkbox-checked .ant-checkbox-inner::after {
          border-color: #ffffff !important; /* Pure white tick */
          border-width: 2px !important; /* Balanced tick thickness */
        }
      `}</style>
    </div>
  );
}
