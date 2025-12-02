"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Form, Input, InputNumber, Select, Button, Space, message } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import NewsFormHeader from "@/app/components/news_components/NewsFormHeader";
import ImportExportConfig from "@/app/components/import_export_components/ImportExportConfig";

const { Option } = Select;

export default function CreateClass() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("Tạo lớp học thành công!");
      router.push("/admin/classes");
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    const values = form.getFieldsValue();
    console.log("Draft exercise values", values);
    message.success("Đã lưu nháp bài tập (mock)");
  };

  return (
    <div className="space-y-6">
      <NewsFormHeader isEditMode={false} title="Tạo lớp học mới" onBack={() => router.push("/admin/classes")} />

      {/* Import/Export Header */}
      <ImportExportConfig
        type="class"
        onImport={async (file) => {
          message.success(`Đã nhập file ${file.name} thành công!`);
        }}
        onExportTemplate={(format) => {
          message.info(`Đang xuất template ${format.toUpperCase()}...`);
        }}
      />

      <Form form={form} onFinish={handleSubmit} layout="vertical" autoComplete="off">
        <Card>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tên lớp */}
              <Form.Item
                name="name"
                label={<span className="text-gray-700 font-medium">Tên lớp</span>}
                rules={[{ required: true, message: "Vui lòng nhập tên lớp!" }]}
              >
                <Input placeholder="Ví dụ: Lớp 10A1" className="rounded-lg cursor-text" autoComplete="off" />
              </Form.Item>

              {/* Mã lớp */}
              <Form.Item
                name="code"
                label={<span className="text-gray-700 font-medium">Mã lớp</span>}
                rules={[{ required: true, message: "Vui lòng nhập mã lớp!" }]}
              >
                <Input placeholder="Ví dụ: 10A1" className="rounded-lg cursor-text" />
              </Form.Item>

              {/* Khối */}
              <Form.Item
                name="grade"
                label={<span className="text-gray-700 font-medium">Khối</span>}
                rules={[{ required: true, message: "Vui lòng chọn khối!" }]}
              >
                <Select placeholder="Chọn khối" className="rounded-lg cursor-pointer">
                  <Option value="Khối 9">Khối 9</Option>
                  <Option value="Khối 10">Khối 10</Option>
                  <Option value="Khối 11">Khối 11</Option>
                  <Option value="Khối 12">Khối 12</Option>
                </Select>
              </Form.Item>

              {/* Giáo viên chủ nhiệm */}
              <Form.Item
                name="teacher"
                label={<span className="text-gray-700 font-medium">Giáo viên chủ nhiệm</span>}
                rules={[{ required: true, message: "Vui lòng nhập tên giáo viên!" }]}
              >
                <Input placeholder="Nhập tên giáo viên chủ nhiệm" className="rounded-lg cursor-text" />
              </Form.Item>

              {/* Số lượng học sinh */}
              <Form.Item
                name="students"
                label={<span className="text-gray-700 font-medium">Số lượng học sinh</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng học sinh!" },
                  { type: "number", min: 1, message: "Số lượng học sinh phải lớn hơn 0!" },
                ]}
              >
                <InputNumber placeholder="Nhập số lượng học sinh" className="w-full rounded-lg cursor-text" min={1} style={{ width: "100%" }} />
              </Form.Item>

              {/* Trạng thái */}
              <Form.Item name="status" label={<span className="text-gray-700 font-medium">Trạng thái</span>} initialValue="Đang hoạt động">
                <Select className="rounded-lg cursor-pointer">
                  <Option value="Đang hoạt động">Đang hoạt động</Option>
                  <Option value="Tạm dừng">Tạm dừng</Option>
                  <Option value="Đã kết thúc">Đã kết thúc</Option>
                </Select>
              </Form.Item>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Space>
                <Button onClick={() => router.push("/admin/classes")} className="rounded-lg cursor-pointer">
                  Hủy
                </Button>
                <Button onClick={handleSaveDraft} className="border-gray-300 rounded-lg cursor-pointer" icon={<SaveOutlined />}>
                  Lưu nháp
                </Button>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} className="rounded-lg cursor-pointer">
                  Tạo lớp học
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      </Form>
    </div>
  );
}
