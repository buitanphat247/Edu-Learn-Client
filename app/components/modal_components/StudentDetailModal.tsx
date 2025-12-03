"use client";

import { Modal, Avatar, Tag, Descriptions } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, BookOutlined, IdcardOutlined, CalendarOutlined } from "@ant-design/icons";
import CustomCard from "@/app/components/CustomCard";
import type { StudentItem } from "@/app/components/students_components/types";

interface StudentDetailModalProps {
  open: boolean;
  onCancel: () => void;
  student: StudentItem | null;
  classInfo?: {
    name: string;
    code: string;
  };
}

export default function StudentDetailModal({ open, onCancel, student, classInfo }: StudentDetailModalProps) {
  const getStatusColor = (status: string) => {
    if (status === "Đang học") return "green";
    if (status === "Tạm nghỉ") return "orange";
    if (status === "Đã tốt nghiệp") return "blue";
    return "default";
  };

  return (
    <Modal
      title="Chi tiết học sinh"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
      destroyOnHidden={false}
      maskClosable={true}
    >
      {student && (
        <div className="space-y-6">
          {/* Avatar và thông tin cơ bản */}
          <div className="text-center">
            <Avatar size={120} icon={<UserOutlined />} className="mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">{student.name}</h3>
            <Tag color="blue" className="mb-4">
              {student.studentId}
            </Tag>
            <Tag color={getStatusColor(student.status)}>{student.status}</Tag>
          </div>

          {/* Thông tin chi tiết */}
          <Descriptions column={1} bordered>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <IdcardOutlined />
                  Mã học sinh
                </span>
              }
            >
              <span className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">{student.studentId}</span>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <UserOutlined />
                  Họ và tên
                </span>
              }
            >
              <span className="font-semibold text-gray-800">{student.name}</span>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <MailOutlined />
                  Email
                </span>
              }
            >
              {student.email}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <PhoneOutlined />
                  Số điện thoại
                </span>
              }
            >
              {student.phone}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <BookOutlined />
                  Lớp học
                </span>
              }
            >
              {classInfo ? `${classInfo.name} (${classInfo.code})` : student.class}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <CalendarOutlined />
                  Trạng thái
                </span>
              }
            >
              <Tag color={getStatusColor(student.status)}>{student.status}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );
}
