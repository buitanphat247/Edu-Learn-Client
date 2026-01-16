"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { App, Spin, Button, Tabs, Table, Tag } from "antd";
import { ArrowLeftOutlined, BellOutlined, FileTextOutlined, CalendarOutlined, UserOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import ClassInfoCard from "@/app/components/classes/ClassInfoCard";
import ClassExercisesTab from "@/app/components/classes/ClassExercisesTab";
import ClassNotificationsTab from "@/app/components/classes/ClassNotificationsTab";
import ClassExamsTab from "@/app/components/classes/ClassExamsTab";
import CustomCard from "@/app/components/common/CustomCard";
import DataLoadingSplash from "@/app/components/common/DataLoadingSplash";
import { getClassById, getClassStudentsByClass, type ClassStudentRecord } from "@/lib/api/classes";
import { CLASS_STATUS_MAP, formatStudentId } from "@/lib/utils/classUtils";
import { getUserIdFromCookie } from "@/lib/utils/cookies";
import type { StudentItem } from "@/interface/students";
import type { ColumnsType } from "antd/es/table";

export default function UserClassDetail() {
  const router = useRouter();
  const params = useParams();
  const { message } = App.useApp();
  const classId = params?.id as string;

  const classIdRef = useRef(classId);
  const classNameRef = useRef<string>("");
  const messageRef = useRef(message);

  useEffect(() => {
    classIdRef.current = classId;
    messageRef.current = message;
  }, [classId, message]);

  const [classData, setClassData] = useState<{
    id: string;
    name: string;
    code: string;
    students: number;
    status: "Đang hoạt động" | "Tạm dừng";
    creator?: {
      user_id: number | string;
      username: string;
      fullname: string;
      email: string;
      avatar?: string | null;
    } | null;
    created_at?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("students");
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("");
  const [exercisePage, setExercisePage] = useState(1);
  const exercisePageSize = 4;
  const [notificationSearchQuery, setNotificationSearchQuery] = useState("");
  const [notificationPage, setNotificationPage] = useState(1);
  const notificationPageSize = 4;
  const [examSearchQuery, setExamSearchQuery] = useState("");
  const [examPage, setExamPage] = useState(1);
  const examPageSize = 4;

  // Memoize callbacks to prevent unnecessary rerenders
  const handleNotificationSearchChange = useCallback((value: string) => {
    setNotificationSearchQuery(value);
  }, []);

  const handleNotificationPageChange = useCallback((page: number) => {
    setNotificationPage(page);
  }, []);

  const handleExerciseSearchChange = useCallback((value: string) => {
    setExerciseSearchQuery(value);
  }, []);

  const handleExercisePageChange = useCallback((page: number) => {
    setExercisePage(page);
  }, []);

  const handleExamSearchChange = useCallback((value: string) => {
    setExamSearchQuery(value);
  }, []);

  const handleExamPageChange = useCallback((page: number) => {
    setExamPage(page);
  }, []);

  // Fetch class information (separate from students)
  const fetchClassInfo = useCallback(async (showLoading: boolean = true): Promise<string> => {
    const currentClassId = classIdRef.current;
    if (!currentClassId) return "";

    try {
      const userId = getUserIdFromCookie();
      if (!userId) {
        throw new Error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      }
      const numericUserId = typeof userId === "string" ? Number(userId) : userId;
      if (isNaN(numericUserId)) {
        throw new Error("User ID không hợp lệ");
      }
      const data = await getClassById(currentClassId, numericUserId);

      // Map class data
      const mappedClassData = {
        id: String(data.class_id),
        name: data.name,
        code: data.code,
        students: data.student_count,
        status: (data.status === "active" ? CLASS_STATUS_MAP.active : CLASS_STATUS_MAP.inactive) as "Đang hoạt động" | "Tạm dừng",
        creator: data.creator || null,
        created_at: data.created_at,
      };

      setClassData(mappedClassData);
      classNameRef.current = data.name; // Store className in ref
      return data.name; // Return className for use in fetchClassStudents
    } catch (error: any) {
      // Chỉ set null nếu showLoading = true để tránh mất dữ liệu khi refresh ngầm
      if (showLoading) {
        setClassData(null);
      }
      throw error;
    }
  }, []);

  // Map ClassStudentRecord to StudentItem
  const mapStudentRecordToItem = useCallback((record: ClassStudentRecord, className: string): StudentItem => {
    if (!record.student) {
      throw new Error("Student data is missing in record");
    }

    const userId = record.student.user_id || record.user_id;
    const displayStatus = record.status === "banned" ? "Bị cấm" : "Đang học";

    return {
      key: String(userId),
      userId: userId,
      studentId: formatStudentId(userId, record.student.username),
      name: record.student.fullname,
      email: record.student.email,
      phone: "",
      class: className,
      status: displayStatus,
      apiStatus: record.status || "online",
      classStudentId: record.id,
    };
  }, []);

  // Fetch class students (separate from class info)
  const fetchClassStudents = useCallback(
    async (className?: string, showLoading: boolean = false) => {
      const currentClassId = classIdRef.current;
      if (!currentClassId) return;

      try {
        if (showLoading) setStudentsLoading(true);
        const records = await getClassStudentsByClass({
          classId: currentClassId,
          page: 1,
          limit: 1000, // Lấy tất cả học sinh
        });

        // Use provided className or fallback to ref
        const studentClassName = className || classNameRef.current || "";

        // Map students - chỉ lấy học sinh có status "online" (loại bỏ "banned")
        const mappedStudents: StudentItem[] = records
          .filter((record: ClassStudentRecord) => record.status === "online")
          .map((record: ClassStudentRecord) => mapStudentRecordToItem(record, studentClassName));

        setStudents(mappedStudents);
      } catch (error: any) {
        // Không set students = [] nếu đang refresh ngầm để tránh mất dữ liệu
        // Không set students = [] nếu đang refresh ngầm để tránh mất dữ liệu
        if (showLoading) {
          setStudents([]);
        }
      } finally {
        if (showLoading) setStudentsLoading(false);
      }
    },
    [mapStudentRecordToItem]
  );

  // Fetch both class info and students
  const fetchClassDetail = useCallback(async () => {
    const currentClassId = classIdRef.current;
    if (!currentClassId) return;

    setLoading(true);
    setShowSplash(true); // Show splash when starting to load

    const startTime = Date.now();
    const minSplashDuration = 250; // Minimum 1 second

    try {
      // Fetch class info first and get className (data loading in background)
      const className = await fetchClassInfo(true);
      // Then fetch students with className
      await fetchClassStudents(className, true);
    } catch (error) {
      // Error already handled in fetchClassInfo
    } finally {
      setLoading(false);

      // Calculate remaining time to show splash (minimum 250ms)
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 250 - elapsed);

      // Hide splash after minimum display time
      setTimeout(() => {
        setShowSplash(false);
      }, remaining);
    }
  }, [fetchClassInfo, fetchClassStudents]);

  // Only fetch when classId changes
  useEffect(() => {
    if (classId) {
      fetchClassDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  // Memoize classInfo object
  const classInfo = useMemo(() => {
    if (!classData) return null;
    return {
      name: classData.name,
      code: classData.code,
      students: classData.students,
      status: classData.status,
      creator: classData.creator,
      created_at: classData.created_at,
    };
  }, [classData]);

  // Memoize status tag render function
  const renderStatusTag = useCallback((status: string) => {
    let color = "default";
    if (status === "Đang học") color = "green";
    else if (status === "Tạm nghỉ") color = "orange";
    else if (status === "Bị cấm") color = "red";
    return <Tag color={color}>{status}</Tag>;
  }, []);

  // Memoize student columns to prevent re-render
  const studentColumns: ColumnsType<StudentItem> = useMemo(
    () => [
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
        render: renderStatusTag,
      },
    ],
    [renderStatusTag]
  );

  const handleCopyCode = useCallback(() => {
    if (classData?.code) {
      navigator.clipboard.writeText(classData.code);
      messageRef.current.success("Đã sao chép mã lớp học");
    }
  }, [classData?.code]);

  const handleBack = useCallback(() => {
    router.push("/user/classes");
  }, [router]);

  const handleTabChange = useCallback((key: string) => {
    setIsTabLoading(true);
    setActiveTab(key);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 500);
  }, []);

  const renderTabContent = (content: React.ReactNode) => {
    if (isTabLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      );
    }
    return content;
  };

  // Memoize loading component
  const loadingComponent = useMemo(
    () => (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large">
          <div style={{ minHeight: "200px" }} />
        </Spin>
        <div className="absolute text-gray-600 mt-20">Đang tải thông tin lớp học...</div>
      </div>
    ),
    []
  );

  // Memoize not found component - System notification style
  const notFoundComponent = useMemo(
    () => (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="max-w-md w-full text-center space-y-2">
          {/* Icon - Document tray with notification bubble */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Document tray/box icon */}
              <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {/* Main box/tray */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
                {/* Additional lines inside box for document effect */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 8h6" className="text-gray-200" />
              </svg>

              {/* Notification bubble above */}
              <div className="absolute -top-3 -right-3">
                <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {/* Speech bubble */}
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  {/* Three dots inside bubble */}
                  <circle cx="8" cy="8" r="1" fill="white" />
                  <circle cx="12" cy="8" r="1" fill="white" />
                  <circle cx="16" cy="8" r="1" fill="white" />
                </svg>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-gray-800 mt-1 mb-1 tracking-tight uppercase">THÔNG BÁO HỆ THỐNG</h2>
            <p className="text-gray-500 text-xs leading-relaxed mb-4 px-6 font-medium italic">"Không tìm thấy lớp học"</p>
          </div>

          {/* Back Button */}
          <Button
            type="primary"
            size="middle"
            className="bg-blue-600 hover:bg-blue-700 border-0 shadow-md hover:shadow-lg transition-all duration-200 px-8"
            onClick={handleBack}
          >
            Quay lại
          </Button>
        </div>
      </div>
    ),
    [handleBack]
  );

  // Memoize students table content
  const studentsTableContent = useMemo(
    () => (
      <CustomCard title="Danh sách học sinh" bodyClassName="py-6">
        <Table
          columns={studentColumns}
          dataSource={students}
          pagination={false}
          rowClassName="hover:bg-gray-50 transition-colors"
          loading={studentsLoading}
        />
      </CustomCard>
    ),
    [students, studentsLoading, studentColumns]
  );

  // Memoize tab items to prevent re-render
  const tabItems = useMemo(
    () => [
      {
        key: "students",
        label: (
          <span>
            <UserOutlined className="mr-2" />
            Danh sách học sinh
          </span>
        ),
        children: renderTabContent(studentsTableContent),
      },
      {
        key: "notifications",
        label: (
          <span>
            <BellOutlined className="mr-2" />
            Thông báo
          </span>
        ),
        children: renderTabContent(
          <ClassNotificationsTab
            classId={classId}
            searchQuery={notificationSearchQuery}
            onSearchChange={handleNotificationSearchChange}
            currentPage={notificationPage}
            pageSize={notificationPageSize}
            onPageChange={handleNotificationPageChange}
            readOnly={true}
          />
        ),
      },
      {
        key: "exercises",
        label: (
          <span>
            <FileTextOutlined className="mr-2" />
            Bài tập
          </span>
        ),
        children: renderTabContent(
          <ClassExercisesTab
            classId={classId}
            searchQuery={exerciseSearchQuery}
            onSearchChange={handleExerciseSearchChange}
            currentPage={exercisePage}
            pageSize={exercisePageSize}
            onPageChange={handleExercisePageChange}
            readOnly={true}
          />
        ),
      },
      {
        key: "exams",
        label: (
          <span>
            <CalendarOutlined className="mr-2" />
            Kiểm tra
          </span>
        ),
        children: renderTabContent(
          <ClassExamsTab
            classId={classId}
            searchQuery={examSearchQuery}
            onSearchChange={handleExamSearchChange}
            currentPage={examPage}
            pageSize={examPageSize}
            onPageChange={handleExamPageChange}
            readOnly={true}
          />
        ),
      },
    ],
    [
      studentsTableContent,
      classId,
      notificationSearchQuery,
      notificationPage,
      notificationPageSize,
      handleNotificationSearchChange,
      handleNotificationPageChange,
      exerciseSearchQuery,
      exercisePage,
      exercisePageSize,
      handleExerciseSearchChange,
      handleExercisePageChange,
      examSearchQuery,
      examPage,
      examPageSize,
      handleExamSearchChange,
      handleExamPageChange,
      isTabLoading,
    ]
  );

  // Early returns after all hooks
  // Show splash screen (must wait for minimum time duration)
  if (showSplash || loading) {
    return <DataLoadingSplash tip="ĐANG TẢI DỮ LIỆU..." />;
  }

  if (!classData) {
    return notFoundComponent;
  }

  return (
    <div className="space-y-6">
      {/* Header - Back button */}
      <div className="flex items-center justify-between">
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Quay lại
        </Button>
      </div>

      {/* Class Information Card - Full width */}
      {classInfo && <ClassInfoCard classInfo={classInfo} onCopyCode={handleCopyCode} />}

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={handleTabChange} destroyOnHidden items={tabItems} />
    </div>
  );
}
