"use client";

import { memo } from "react";
import { Button, Space, Tag, Table } from "antd";
import { DeleteOutlined, EyeOutlined, UserAddOutlined, UsergroupAddOutlined, StopOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import CustomCard from "@/app/components/common/CustomCard";
import type { StudentItem } from "@/interface/students";

interface ClassStudentsTableProps {
  students: StudentItem[];
  onViewStudent: (student: StudentItem) => void;
  onRemoveStudent: (student: StudentItem) => void;
  onAddSingle?: () => void;
  onAddMultiple?: () => void;
  onViewBanned?: (student: StudentItem) => void;
  onViewBannedList?: () => void;
  onBanStudent?: (student: StudentItem) => void;
}

function ClassStudentsTable({ students, onViewStudent, onRemoveStudent, onAddSingle, onAddMultiple, onViewBanned, onViewBannedList, onBanStudent }: ClassStudentsTableProps) {

  const studentColumns: ColumnsType<StudentItem> = [
    {
      title: "Mã học sinh",
      dataIndex: "studentId",
      key: "studentId",
      render: (text: string) => <span className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">{text}</span>,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "Đang học") color = "green";
        else if (status === "Tạm nghỉ") color = "orange";
        else if (status === "Bị cấm") color = "red";
        
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_: any, record: StudentItem) => {
        const isBanned = record.apiStatus === "banned";
        const isOnline = record.apiStatus === "online" || !record.apiStatus;
        
        return (
          <Space size="small">
            <Button icon={<EyeOutlined />} size="small" onClick={() => onViewStudent(record)} className="cursor-pointer">
              Xem
            </Button>
            {isOnline && onBanStudent && (
              <Button 
                icon={<StopOutlined />} 
                size="small" 
                danger 
                onClick={() => onBanStudent(record)} 
                className="cursor-pointer"
              >
                Cấm
              </Button>
            )}
            {isBanned && onViewBanned && (
              <Button 
                icon={<StopOutlined />} 
                size="small" 
                danger 
                onClick={() => onViewBanned(record)} 
                className="cursor-pointer"
              >
                Bị cấm
              </Button>
            )}
            <Button icon={<DeleteOutlined />} size="small" danger onClick={() => onRemoveStudent(record)} className="cursor-pointer">
              Xóa
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <CustomCard 
      title="Danh sách học sinh" 
      bodyClassName="py-6"
      extra={
        <Space>
          <Button
            type="default"
            icon={<UserAddOutlined />}
            size="middle"
            className="bg-white border-gray-300 hover:bg-gray-50 shadow-sm"
            onClick={onAddSingle}
          >
            Thêm single
          </Button>
          <Button
            type="default"
            icon={<UsergroupAddOutlined />}
            size="middle"
            className="bg-white border-gray-300 hover:bg-gray-50 shadow-sm"
            onClick={onAddMultiple}
          >
            Thêm multiple
          </Button>
          {onViewBannedList && (
            <Button
              type="default"
              icon={<StopOutlined />}
              size="middle"
              danger
              className="bg-white border-red-300 hover:bg-red-50 shadow-sm"
              onClick={onViewBannedList}
            >
              Danh sách cấm
            </Button>
          )}
        </Space>
      }
    >
      <Table columns={studentColumns} dataSource={students} pagination={false} rowClassName="hover:bg-gray-50 transition-colors" />
    </CustomCard>
  );
}

export default memo(ClassStudentsTable);
