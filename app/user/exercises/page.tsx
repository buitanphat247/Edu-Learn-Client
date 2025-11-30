"use client";

import { Table, Button, Input, Tag, Select } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Search } = Input;
const { Option } = Select;

const data = [
  { key: "1", name: "Bài tập Toán chương 1", class: "9A3", subject: "Toán học", date: "15/01/2024", deadline: "20/01/2024", status: "Chưa nộp" },
  { key: "2", name: "Bài tập Văn tuần 2", class: "9A3", subject: "Ngữ văn", date: "14/01/2024", deadline: "18/01/2024", status: "Đã nộp" },
  { key: "3", name: "Bài tập Lý chương 3", class: "9A3", subject: "Vật lý", date: "13/01/2024", deadline: "19/01/2024", status: "Quá hạn" },
];

export default function UserExercises() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Tên bài tập",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Ngày giao",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Hạn nộp",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Đã nộp" ? "green" : status === "Quá hạn" ? "red" : "orange"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => router.push(`/user/exercises/${record.key}`)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Bài tập của tôi</h1>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <Search
          placeholder="Tìm kiếm bài tập..."
          allowClear
          enterButton={<SearchOutlined />}
          style={{ maxWidth: 400 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          style={{ width: 150 }}
          value={selectedStatus}
          onChange={setSelectedStatus}
        >
          <Option value="Chưa nộp">Chưa nộp</Option>
          <Option value="Đã nộp">Đã nộp</Option>
          <Option value="Quá hạn">Quá hạn</Option>
        </Select>
      </div>
      <Table columns={columns} dataSource={filteredData} />
    </div>
  );
}

