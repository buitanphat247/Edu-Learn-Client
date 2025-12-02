"use client";

import { useRouter } from "next/navigation";
import { Form, Input, Select, DatePicker, Upload, Button, message } from "antd";
import { UploadOutlined, SaveOutlined, CheckOutlined } from "@ant-design/icons";
import ExerciseCreateHeader from "@/app/components/exercises_components/ExerciseCreateHeader";

const { TextArea } = Input;
const { Option } = Select;

export default function AdminExerciseCreate() {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = (values: any) => {
    // Tạm thời mock submit
    console.log("Exercise form values", values);
    message.success("Tạo bài tập mới thành công (mock)");
    router.push("/admin/exercises");
  };

  const handleSaveDraft = () => {
    const values = form.getFieldsValue();
    console.log("Draft exercise values", values);
    message.success("Đã lưu nháp bài tập (mock)");
  };

  return (
    <div className="space-y-6">
      <ExerciseCreateHeader onBack={() => router.push("/admin/exercises")} />

      {/* Main form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-3">
          {/* Thông tin cơ bản - 2 cột */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Form.Item label="Tên bài tập" name="title" rules={[{ required: true, message: "Vui lòng nhập tên bài tập" }]}>
              <Input placeholder="Nhập tiêu đề bài tập" className="cursor-text" />
            </Form.Item>

            <Form.Item label="Lớp học" name="class" rules={[{ required: true, message: "Vui lòng chọn lớp học" }]}>
              <Select placeholder="Chọn lớp" allowClear className="cursor-pointer">
                <Option value="10A1">10A1</Option>
                <Option value="11B2">11B2</Option>
                <Option value="12C1">12C1</Option>
                <Option value="9A3">9A3</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Môn học" name="subject" rules={[{ required: true, message: "Vui lòng chọn môn học" }]}>
              <Select placeholder="Chọn môn" allowClear className="cursor-pointer">
                <Option value="toan">Toán học</Option>
                <Option value="van">Ngữ văn</Option>
                <Option value="ly">Vật lý</Option>
                <Option value="hoa">Hóa học</Option>
                <Option value="anh">Tiếng Anh</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Hạn nộp bài" name="deadline" rules={[{ required: true, message: "Vui lòng chọn hạn nộp" }]}>
              <DatePicker showTime style={{ width: "100%" }} placeholder="Chọn ngày và giờ hết hạn" className="cursor-pointer" />
            </Form.Item>
          </div>

          {/* File đính kèm */}
          <Form.Item label="Tài liệu đính kèm" name="attachments">
            <Upload multiple beforeUpload={() => false} showUploadList>
              <Button icon={<UploadOutlined />} className="rounded-lg cursor-pointer">
                Chọn file đính kèm
              </Button>
            </Upload>
            <p className="text-xs text-gray-400 mt-2">Hỗ trợ các định dạng: .pdf, .docx, .pptx, .xlsx, hình ảnh...</p>
          </Form.Item>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={() => router.push("/admin/classes")} className="rounded-lg cursor-pointer">
              Hủy
            </Button>
            <Button onClick={handleSaveDraft} className="border-gray-300 rounded-lg cursor-pointer" icon={<SaveOutlined />}>
              Lưu nháp
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-linear-to-r from-blue-500 to-purple-500 border-0 hover:from-blue-600 hover:to-purple-600 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
              icon={<CheckOutlined />}
            >
              Tạo bài tập
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
