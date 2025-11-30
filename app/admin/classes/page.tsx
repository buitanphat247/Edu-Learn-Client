"use client";

import { Table, Button, Input, Space, Tag } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

const { Search } = Input;

const columns = [
  {
    title: "Tên lớp",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Mã lớp",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Số học sinh",
    dataIndex: "students",
    key: "students",
    render: (count: number) => (
      <span>
        <UserOutlined /> {count}
      </span>
    ),
  },
  {
    title: "Giáo viên",
    dataIndex: "teacher",
    key: "teacher",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag color={status === "Đang hoạt động" ? "green" : "default"}>{status}</Tag>
    ),
  },
  {
    title: "Hành động",
    key: "action",
    render: () => (
      <Space>
        <Button icon={<EditOutlined />} size="small">Sửa</Button>
        <Button icon={<DeleteOutlined />} size="small" danger>Xóa</Button>
      </Space>
    ),
  },
];

const data = [
  { key: "1", name: "Lớp 10A1", code: "10A1", students: 35, teacher: "Nguyễn Văn A", status: "Đang hoạt động" },
  { key: "2", name: "Lớp 10A2", code: "10A2", students: 32, teacher: "Trần Thị B", status: "Đang hoạt động" },
  { key: "3", name: "Lớp 11B1", code: "11B1", students: 30, teacher: "Lê Văn C", status: "Tạm dừng" },
];

export default function AdminClasses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Lớp học</h1>
        <Button type="default" icon={<PlusOutlined />}>
          Thêm lớp học
        </Button>
      </div>

      <div className="mb-4">
        <Search placeholder="Tìm kiếm lớp học..." allowClear enterButton={<SearchOutlined />} style={{ maxWidth: 400 }} />
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

