"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { App } from "antd";
import StudentDetailModal from "@/app/components/modal_components/StudentDetailModal";
import ClassHeader from "@/app/components/classes_components/ClassHeader";
import ClassInfoCard from "@/app/components/classes_components/ClassInfoCard";
import ClassStudentsTable from "@/app/components/classes_components/ClassStudentsTable";
import type { StudentItem } from "@/app/components/students_components/types";

// Mock data - trong thực tế sẽ fetch từ API
const mockClassData = {
  "1": {
    id: "1",
    name: "Lớp 10A1",
    code: "10A1",
    students: 35,
    status: "Đang hoạt động",
  },
  "2": {
    id: "2",
    name: "Lớp 10A2",
    code: "10A2",
    students: 32,
    status: "Đang hoạt động",
  },
  "3": {
    id: "3",
    name: "Lớp 11B1",
    code: "11B1",
    students: 30,
    status: "Tạm dừng",
  },
};

// Mock danh sách 50 học sinh
const mockStudents = [
  { key: "1", studentId: "HS001", name: "Nguyễn Văn A", email: "hs001@example.com", phone: "0987001001", status: "Đang học" },
  { key: "2", studentId: "HS002", name: "Trần Thị B", email: "hs002@example.com", phone: "0987001002", status: "Đang học" },
  { key: "3", studentId: "HS003", name: "Lê Văn C", email: "hs003@example.com", phone: "0987001003", status: "Tạm nghỉ" },
  { key: "4", studentId: "HS004", name: "Phạm Thị D", email: "hs004@example.com", phone: "0987001004", status: "Đang học" },
  { key: "5", studentId: "HS005", name: "Bùi Văn E", email: "hs005@example.com", phone: "0987001005", status: "Đang học" },
  { key: "6", studentId: "HS006", name: "Đỗ Thị F", email: "hs006@example.com", phone: "0987001006", status: "Bảo lưu" },
  { key: "7", studentId: "HS007", name: "Võ Văn G", email: "hs007@example.com", phone: "0987001007", status: "Đang học" },
  { key: "8", studentId: "HS008", name: "Hồ Thị H", email: "hs008@example.com", phone: "0987001008", status: "Đang học" },
  { key: "9", studentId: "HS009", name: "Đặng Văn I", email: "hs009@example.com", phone: "0987001009", status: "Tạm nghỉ" },
  { key: "10", studentId: "HS010", name: "Ngô Thị K", email: "hs010@example.com", phone: "0987001010", status: "Đang học" },
  { key: "11", studentId: "HS011", name: "Nguyễn Văn L", email: "hs011@example.com", phone: "0987001011", status: "Đang học" },
  { key: "12", studentId: "HS012", name: "Trần Thị M", email: "hs012@example.com", phone: "0987001012", status: "Bảo lưu" },
  { key: "13", studentId: "HS013", name: "Lê Văn N", email: "hs013@example.com", phone: "0987001013", status: "Đang học" },
  { key: "14", studentId: "HS014", name: "Phạm Thị O", email: "hs014@example.com", phone: "0987001014", status: "Đang học" },
  { key: "15", studentId: "HS015", name: "Bùi Văn P", email: "hs015@example.com", phone: "0987001015", status: "Tạm nghỉ" },
  { key: "16", studentId: "HS016", name: "Đỗ Thị Q", email: "hs016@example.com", phone: "0987001016", status: "Đang học" },
  { key: "17", studentId: "HS017", name: "Võ Văn R", email: "hs017@example.com", phone: "0987001017", status: "Đang học" },
  { key: "18", studentId: "HS018", name: "Hồ Thị S", email: "hs018@example.com", phone: "0987001018", status: "Bảo lưu" },
  { key: "19", studentId: "HS019", name: "Đặng Văn T", email: "hs019@example.com", phone: "0987001019", status: "Đang học" },
  { key: "20", studentId: "HS020", name: "Ngô Thị U", email: "hs020@example.com", phone: "0987001020", status: "Đang học" },
  { key: "21", studentId: "HS021", name: "Nguyễn Văn V", email: "hs021@example.com", phone: "0987001021", status: "Tạm nghỉ" },
  { key: "22", studentId: "HS022", name: "Trần Thị X", email: "hs022@example.com", phone: "0987001022", status: "Đang học" },
  { key: "23", studentId: "HS023", name: "Lê Văn Y", email: "hs023@example.com", phone: "0987001023", status: "Đang học" },
  { key: "24", studentId: "HS024", name: "Phạm Thị Z", email: "hs024@example.com", phone: "0987001024", status: "Bảo lưu" },
  { key: "25", studentId: "HS025", name: "Bùi Văn AA", email: "hs025@example.com", phone: "0987001025", status: "Đang học" },
  { key: "26", studentId: "HS026", name: "Đỗ Thị AB", email: "hs026@example.com", phone: "0987001026", status: "Tạm nghỉ" },
  { key: "27", studentId: "HS027", name: "Võ Văn AC", email: "hs027@example.com", phone: "0987001027", status: "Đang học" },
  { key: "28", studentId: "HS028", name: "Hồ Thị AD", email: "hs028@example.com", phone: "0987001028", status: "Đang học" },
  { key: "29", studentId: "HS029", name: "Đặng Văn AE", email: "hs029@example.com", phone: "0987001029", status: "Bảo lưu" },
  { key: "30", studentId: "HS030", name: "Ngô Thị AF", email: "hs030@example.com", phone: "0987001030", status: "Đang học" },
  { key: "31", studentId: "HS031", name: "Nguyễn Văn AG", email: "hs031@example.com", phone: "0987001031", status: "Đang học" },
  { key: "32", studentId: "HS032", name: "Trần Thị AH", email: "hs032@example.com", phone: "0987001032", status: "Tạm nghỉ" },
  { key: "33", studentId: "HS033", name: "Lê Văn AI", email: "hs033@example.com", phone: "0987001033", status: "Đang học" },
  { key: "34", studentId: "HS034", name: "Phạm Thị AJ", email: "hs034@example.com", phone: "0987001034", status: "Đang học" },
  { key: "35", studentId: "HS035", name: "Bùi Văn AK", email: "hs035@example.com", phone: "0987001035", status: "Tạm nghỉ" },
  { key: "36", studentId: "HS036", name: "Đỗ Thị AL", email: "hs036@example.com", phone: "0987001036", status: "Đang học" },
  { key: "37", studentId: "HS037", name: "Võ Văn AM", email: "hs037@example.com", phone: "0987001037", status: "Đang học" },
  { key: "38", studentId: "HS038", name: "Hồ Thị AN", email: "hs038@example.com", phone: "0987001038", status: "Bảo lưu" },
  { key: "39", studentId: "HS039", name: "Đặng Văn AO", email: "hs039@example.com", phone: "0987001039", status: "Đang học" },
  { key: "40", studentId: "HS040", name: "Ngô Thị AP", email: "hs040@example.com", phone: "0987001040", status: "Đang học" },
  { key: "41", studentId: "HS041", name: "Nguyễn Văn AQ", email: "hs041@example.com", phone: "0987001041", status: "Tạm nghỉ" },
  { key: "42", studentId: "HS042", name: "Trần Thị AR", email: "hs042@example.com", phone: "0987001042", status: "Đang học" },
  { key: "43", studentId: "HS043", name: "Lê Văn AS", email: "hs043@example.com", phone: "0987001043", status: "Đang học" },
  { key: "44", studentId: "HS044", name: "Phạm Thị AT", email: "hs044@example.com", phone: "0987001044", status: "Bảo lưu" },
  { key: "45", studentId: "HS045", name: "Bùi Văn AU", email: "hs045@example.com", phone: "0987001045", status: "Đang học" },
  { key: "46", studentId: "HS046", name: "Đỗ Thị AV", email: "hs046@example.com", phone: "0987001046", status: "Đang học" },
  { key: "47", studentId: "HS047", name: "Võ Văn AW", email: "hs047@example.com", phone: "0987001047", status: "Tạm nghỉ" },
  { key: "48", studentId: "HS048", name: "Hồ Thị AX", email: "hs048@example.com", phone: "0987001048", status: "Đang học" },
  { key: "49", studentId: "HS049", name: "Đặng Văn AY", email: "hs049@example.com", phone: "0987001049", status: "Đang học" },
  { key: "50", studentId: "HS050", name: "Ngô Thị AZ", email: "hs050@example.com", phone: "0987001050", status: "Tạm nghỉ" },
];

export default function ClassDetail() {
  const router = useRouter();
  const params = useParams();
  const { modal, message } = App.useApp();
  const classId = params?.id as string;
  const classData = mockClassData[classId as keyof typeof mockClassData];
  
  // Map students với class data và convert status
  const studentsWithClass: StudentItem[] = mockStudents.map((student) => {
    let status: "Đang học" | "Tạm nghỉ" | "Đã tốt nghiệp" = "Đang học";
    if (student.status === "Tạm nghỉ") status = "Tạm nghỉ";
    else if (student.status === "Đã tốt nghiệp") status = "Đã tốt nghiệp";
    else if (student.status === "Bảo lưu") status = "Tạm nghỉ"; // Map "Bảo lưu" to "Tạm nghỉ"
    
    return {
      ...student,
      class: classData?.name || "N/A",
      status,
    };
  });

  const [students, setStudents] = useState<StudentItem[]>(studentsWithClass);
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  if (!classData) {
    return (
      <div className="space-y-6">
        <ClassHeader className="Lớp học" onEdit={() => {}} onDelete={() => {}} />
        <ClassInfoCard
          classInfo={{
            name: "Không tìm thấy",
            code: "N/A",
            students: 0,
            status: "Không tồn tại",
          }}
        />
      </div>
    );
  }

  const handleEdit = () => {
    message.info("Tính năng chỉnh sửa đang được phát triển");
  };

  const handleDelete = () => {
    modal.confirm({
      title: "Xác nhận xóa lớp học",
      content: `Bạn có chắc chắn muốn xóa lớp học "${classData.name}"? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        message.warning("Tính năng xóa đang được phát triển");
      },
    });
  };

  const handleViewStudent = (student: StudentItem) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleRemoveStudent = (student: StudentItem) => {
    modal.confirm({
      title: "Xác nhận xóa học sinh",
      content: `Bạn có chắc chắn muốn xóa học sinh "${student.name}" ra khỏi lớp "${classData.name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        setStudents((prev) => prev.filter((s) => s.key !== student.key));
        message.success(`Đã xóa học sinh "${student.name}" ra khỏi lớp`);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ClassHeader className={classData.name} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Thông tin lớp học */}
      <ClassInfoCard
        classInfo={{
          name: classData.name,
          code: classData.code,
          students: classData.students,
          status: classData.status,
        }}
      />

      {/* Danh sách học sinh */}
      <ClassStudentsTable students={students} onViewStudent={handleViewStudent} onRemoveStudent={handleRemoveStudent} />

      {/* Modal xem chi tiết học sinh */}
      <StudentDetailModal
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        classInfo={{
          name: classData.name,
          code: classData.code,
        }}
      />
    </div>
  );
}
