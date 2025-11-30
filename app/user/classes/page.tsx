"use client";

import { Table, Tag, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

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
  },
  {
    title: "Giáo viên chủ nhiệm",
    dataIndex: "teacher",
    key: "teacher",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag color={status === "Đang học" ? "green" : "default"}>{status}</Tag>
    ),
  },
  {
    title: "Hành động",
    key: "action",
    render: () => (
      <Button icon={<EyeOutlined />} size="small">
        Xem chi tiết
      </Button>
    ),
  },
];

const data = [
  { key: "1", name: "Lớp 9A3", code: "9A3", students: 35, teacher: "Nguyễn Văn A", status: "Đang học" },
  { key: "2", name: "Lớp 10A1", code: "10A1", students: 32, teacher: "Trần Thị B", status: "Đang học" },
];

export default function UserClasses() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Lớp học của tôi</h1>

      <Table columns={columns} dataSource={data} />
    </div>
  );
}

