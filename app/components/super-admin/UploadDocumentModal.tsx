"use client";

import { Modal, Form, Input, Upload, Button, App, message } from "antd";
import { UploadOutlined, FileOutlined, DeleteOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import { useState } from "react";
import { createDocument } from "@/lib/api/documents";
import { getCurrentUser } from "@/lib/api/users";

const { TextArea } = Input;

interface UploadDocumentModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function UploadDocumentModal({ open, onCancel, onSuccess }: UploadDocumentModalProps) {
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (values: { title: string }) => {
    if (fileList.length === 0) {
      messageApi.warning("Vui lòng chọn file để upload");
      return;
    }

    const user = getCurrentUser();
    if (!user || !user.user_id) {
      messageApi.error("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại!");
      return;
    }

    setUploading(true);
    try {
      const file = fileList[0].originFileObj;
      if (!file) {
        messageApi.error("File không hợp lệ");
        setUploading(false);
        return;
      }

      await createDocument({
        title: values.title,
        file: file,
        uploaded_by: Number(user.user_id),
      });

      messageApi.success("Upload tài liệu thành công!");
      form.resetFields();
      setFileList([]);
      onSuccess();
    } catch (error: any) {
      messageApi.error(error?.message || "Không thể upload tài liệu");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (uploading) {
      messageApi.warning("Đang upload tài liệu, vui lòng đợi...");
      return;
    }
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const handleFileChange = (info: any) => {
    let newFileList = [...info.fileList];
    // Chỉ giữ lại file cuối cùng
    newFileList = newFileList.slice(-1);
    setFileList(newFileList);
  };

  const handleRemove = () => {
    setFileList([]);
  };

  const beforeUpload = () => {
    return false; // Prevent auto upload
  };

  return (
    <Modal
      title="Thêm tài liệu mới"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      maskClosable={!uploading}
      closable={!uploading}
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="title"
          label="Tiêu đề tài liệu"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề tài liệu" },
            { max: 255, message: "Tiêu đề không được vượt quá 255 ký tự" },
          ]}
        >
          <Input
            placeholder="Nhập tiêu đề tài liệu"
            disabled={uploading}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="File tài liệu"
          required
          rules={[
            {
              validator: () => {
                if (fileList.length === 0) {
                  return Promise.reject(new Error("Vui lòng chọn file để upload"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={beforeUpload}
            onRemove={handleRemove}
            maxCount={1}
            disabled={uploading}
          >
            <Button
              icon={<UploadOutlined />}
              disabled={uploading}
              size="large"
              block
            >
              Chọn file
            </Button>
          </Upload>
          {fileList.length > 0 && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileOutlined className="text-blue-500" />
                  <span className="text-sm text-gray-700">{fileList[0].name}</span>
                  <span className="text-xs text-gray-500">
                    ({(fileList[0].size! / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                {!uploading && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={handleRemove}
                  >
                    Xóa
                  </Button>
                )}
              </div>
            </div>
          )}
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleCancel}
              disabled={uploading}
              size="large"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={uploading}
              disabled={uploading}
              size="large"
              className="bg-blue-500 hover:bg-blue-600"
            >
              {uploading ? "Đang upload..." : "Upload"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

