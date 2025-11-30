"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, Form, Upload, message } from "antd";
import type { UploadFile } from "antd";
import NewsFormHeader from "@/app/components/news_components/NewsFormHeader";
import NewsBasicFields from "@/app/components/news_components/NewsBasicFields";
import NewsImageUpload from "@/app/components/news_components/NewsImageUpload";
import NewsContentEditor from "@/app/components/news_components/NewsContentEditor";
import NewsFormActions from "@/app/components/news_components/NewsFormActions";

const mockNewsData: Record<string, any> = {
  "1": {
    id: "1",
    title: "Khai giảng khóa học mới",
    category: "Tin tức",
    content: "Nội dung bài viết...",
    status: "Đã xuất bản",
    image: "",
  },
  "2": {
    id: "2",
    title: "Hội thảo trực tuyến",
    category: "Sự kiện",
    content: "Nội dung bài viết...",
    status: "Đã xuất bản",
    image: "",
  },
  "3": {
    id: "3",
    title: "Ra mắt tính năng AI",
    category: "Tin tức",
    content: "Nội dung bài viết...",
    status: "Bản nháp",
    image: "",
  },
};

export default function NewsHandle() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const isEditMode = Boolean(id && id !== "new");

  useEffect(() => {
    if (isEditMode && id && mockNewsData[id]) {
      const news = mockNewsData[id];
      form.setFieldsValue({
        title: news.title,
        category: news.category,
        content: news.content,
        status: news.status,
      });
      setEditorContent(news.content || "");
      if (news.image) {
        setFileList([
          {
            uid: "-1",
            name: "image.jpg",
            status: "done",
            url: news.image,
          },
        ]);
      }
    } else {
      setEditorContent("");
    }
  }, [id, isEditMode, form]);

  const handleSubmit = async (_values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success(isEditMode ? "Cập nhật tin tức thành công!" : "Tạo tin tức thành công!");
      router.push("/admin/news");
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (info: any) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ hỗ trợ file ảnh!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <NewsFormHeader 
        isEditMode={isEditMode}
        title={isEditMode ? "Chỉnh sửa tin tức" : "Tạo tin tức mới"}
        onBack={() => router.push("/admin/news")}
      />

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Card>
          <NewsBasicFields />
          <NewsImageUpload fileList={fileList} onFileChange={handleFileChange} beforeUpload={beforeUpload} />
          <NewsContentEditor editorContent={editorContent} onContentChange={setEditorContent} form={form} />
          <NewsFormActions 
            loading={loading} 
            isEditMode={isEditMode}
            onCancel={() => router.push("/admin/news")}
          />
        </Card>
      </Form>
    </div>
  );
}
