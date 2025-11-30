"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Upload, message, Tabs } from "antd";
import type { MenuProps } from "antd";
import { ArrowLeftOutlined, SettingOutlined, DeleteOutlined, FileTextOutlined as FileIcon, BarChartOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import ExerciseContent from "@/app/components/exercise_components/ExerciseContent";
import GradeTable, { type GradeData } from "@/app/components/exercise_components/GradeTable";

const exerciseData = {
  id: "9",
  title: "Bài tập số 9",
  createdDate: "01/09/2025 17:42",
  dueDate: null,
  assignedTo: "9a3",
  content: "",
  files: [
    {
      uid: "1",
      name: "Bài toán thực tế_hàm số.pdf",
      status: "done",
      url: "#",
    },
  ],
};

const students = [
  { id: "5", name: "Học sinh 5", status: "not_submitted" },
  { id: "1", name: "Nguyễn Văn A", status: "submitted" },
  { id: "2", name: "Trần Thị B", status: "submitted" },
  { id: "3", name: "Lê Văn C", status: "not_submitted" },
  { id: "4", name: "Phạm Thị D", status: "submitted" },
];

const gradeData: GradeData[] = [
  {
    key: "1",
    studentId: "1",
    studentName: "Nguyễn Văn A",
    class: "9a3",
    score: 8.5,
    status: "Đã chấm",
    submittedDate: "15/01/2025",
    gradedDate: "16/01/2025",
  },
  {
    key: "2",
    studentId: "2",
    studentName: "Trần Thị B",
    class: "9a3",
    score: 9.0,
    status: "Đã chấm",
    submittedDate: "14/01/2025",
    gradedDate: "15/01/2025",
  },
  {
    key: "3",
    studentId: "3",
    studentName: "Lê Văn C",
    class: "9a3",
    score: null,
    status: "Chưa nộp",
    submittedDate: null,
    gradedDate: null,
  },
  {
    key: "4",
    studentId: "4",
    studentName: "Phạm Thị D",
    class: "9a3",
    score: 7.5,
    status: "Đã chấm",
    submittedDate: "16/01/2025",
    gradedDate: "17/01/2025",
  },
  {
    key: "5",
    studentId: "5",
    studentName: "Hoàng Văn E",
    class: "10a1",
    score: 8.0,
    status: "Đã chấm",
    submittedDate: "13/01/2025",
    gradedDate: "14/01/2025",
  },
  {
    key: "6",
    studentId: "6",
    studentName: "Vũ Thị F",
    class: "10a1",
    score: 9.5,
    status: "Đã chấm",
    submittedDate: "12/01/2025",
    gradedDate: "13/01/2025",
  },
  {
    key: "7",
    studentId: "7",
    studentName: "Đỗ Văn G",
    class: "11b2",
    score: null,
    status: "Chưa nộp",
    submittedDate: null,
    gradedDate: null,
  },
];

export default function ExerciseDetail() {
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>(exerciseData.files as UploadFile[]);
  const [dueDate, setDueDate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("exercise");
  const [selectedClass, setSelectedClass] = useState<string | undefined>(exerciseData.assignedTo);

  const menuItems: MenuProps["items"] = [
    {
      key: "settings",
      label: "Cài đặt",
      icon: <SettingOutlined />,
    },
    {
      key: "delete",
      label: "Xóa",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "delete") {
      message.warning("Tính năng xóa đang được phát triển");
    } else if (e.key === "settings") {
      message.info("Tính năng cài đặt đang được phát triển");
    }
  };

  const handleFileRemove = (file: UploadFile) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
  };

  const handleFileChange = (info: any) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-10);
    setFileList(newFileList);
  };

  const beforeUpload = (file: File) => {
    const isValidType =
      file.type.startsWith("image/") ||
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/vnd.ms-excel" ||
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type.startsWith("audio/") ||
      file.type.startsWith("video/");

    if (!isValidType) {
      message.error("Chỉ hỗ trợ file định dạng ảnh, pdf, word, excel, audio hoặc video!");
      return Upload.LIST_IGNORE;
    }

    const isLt50M = file.size / 1024 / 1024 < 50;
    if (!isLt50M) {
      message.error("File phải nhỏ hơn 50MB!");
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  return (
    <div className="bg-gray-50">
      <div className="space-y-6">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/admin/exercises")}>
          Quay lại
        </Button>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "exercise",
              label: (
                <span>
                  <FileIcon className="mr-2" />
                  Bài tập và đề thi
                </span>
              ),
              children: (
                <ExerciseContent
                  exerciseData={{ ...exerciseData, files: fileList }}
                  students={students as Array<{ id: string; name: string; status: "submitted" | "not_submitted" }>}
                  dueDate={dueDate}
                  fileList={fileList}
                  onDueDateChange={setDueDate}
                  onFileRemove={handleFileRemove}
                  onFileChange={handleFileChange}
                  beforeUpload={beforeUpload}
                  menuItems={menuItems}
                  onMenuClick={handleMenuClick}
                />
              ),
            },
            {
              key: "grades",
              label: (
                <span>
                  <BarChartOutlined className="mr-2" />
                  Bảng điểm
                </span>
              ),
              children: (
                <GradeTable
                  gradeData={gradeData}
                  selectedClass={selectedClass}
                  onClassChange={setSelectedClass}
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

