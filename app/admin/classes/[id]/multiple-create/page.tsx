"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { App } from "antd";
import type { UploadFile } from "antd";
import { addStudentToClass, getClassById, type AddStudentToClassParams } from "@/lib/api/classes";
import { getUserIdFromCookie } from "@/lib/utils/cookies";
import CSVUploadForm from "@/app/components/common/CSVUploadForm";
import { useEffect } from "react";

export default function MultipleCreateStudentPage() {
  const router = useRouter();
  const params = useParams();
  const { message } = App.useApp();
  const classId = params?.id as string;
  const [csvPreviewData, setCsvPreviewData] = useState<any[]>([]);
  const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [classInfo, setClassInfo] = useState<{ name: string; code: string } | null>(null);

  useEffect(() => {
    if (!classId) return;

    const fetchClassInfo = async () => {
      try {
        const userId = getUserIdFromCookie();
        const numericUserId = userId ? (typeof userId === "string" ? Number(userId) : userId) : undefined;
        const data = await getClassById(classId, numericUserId);
        setClassInfo({ name: data.name, code: data.code });
      } catch (error: any) {
        message.error(error?.message || "Không thể tải thông tin lớp học");
      }
    };

    fetchClassInfo();
  }, [classId, message]);

  const mapCSVToAPI = (csvRow: any): AddStudentToClassParams | null => {
    try {
      const user_id = csvRow.user_id ? Number(csvRow.user_id) : null;

      if (!user_id || isNaN(user_id)) {
        return null;
      }

      if (!classId) {
        return null;
      }

      return {
        class_id: classId,
        user_id,
      };
    } catch (error) {
      return null;
    }
  };

  const createItem = async (data: AddStudentToClassParams) => {
    return await addStudentToClass(data);
  };

  return (
    <div className="w-full">
      <CSVUploadForm
        templatePath="/data/template/student_template.csv"
        templateFileName="student_template.csv"
        csvPreviewData={csvPreviewData}
        setCsvPreviewData={setCsvPreviewData}
        uploadFileList={uploadFileList}
        setUploadFileList={setUploadFileList}
        submitting={submitting}
        setSubmitting={setSubmitting}
        mapCSVToAPI={mapCSVToAPI}
        createItem={createItem}
        itemName="học sinh"
        itemNamePlural="học sinh"
        onSuccess={() => {
          router.push(`/admin/classes/${classId}`);
        }}
        templateColumns={[{ title: "user_id", dataIndex: "user_id", key: "user_id", width: 150 }]}
        title="Import User Data"
        description={`Upload danh sách user_id để thêm nhiều học sinh vào lớp ${classInfo?.name || ""}. We support .CSV format up to 5MB.`}
        onBack={() => {
          router.push(`/admin/classes/${classId}`);
        }}
      />
    </div>
  );
}

