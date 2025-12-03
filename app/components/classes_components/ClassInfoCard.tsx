"use client";

import { Descriptions, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import CustomCard from "@/app/components/CustomCard";

interface ClassInfo {
  name: string;
  code: string;
  students: number;
  status: string;
}

interface ClassInfoCardProps {
  classInfo: ClassInfo;
}

export default function ClassInfoCard({ classInfo }: ClassInfoCardProps) {
  return (
    <CustomCard title="Thông tin lớp học" bodyClassName="py-6">
      <Descriptions column={2} bordered>
        <Descriptions.Item label="Tên lớp" span={1}>
          <span className="font-semibold text-gray-800">{classInfo.name}</span>
        </Descriptions.Item>
        <Descriptions.Item label="Mã lớp" span={1}>
          <span className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">{classInfo.code}</span>
        </Descriptions.Item>
        <Descriptions.Item label="Số lượng học sinh" span={1}>
          <span className="flex items-center gap-2">
            <UserOutlined className="text-blue-500" />
            <span className="font-medium">{classInfo.students} học sinh</span>
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái" span={1}>
          <Tag color={classInfo.status === "Đang hoạt động" ? "green" : "orange"} className="px-2 py-1">
            {classInfo.status}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </CustomCard>
  );
}
