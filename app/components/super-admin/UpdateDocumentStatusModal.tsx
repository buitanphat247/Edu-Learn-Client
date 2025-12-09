"use client";

import { Modal, Form, Select, App, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { updateDocumentStatus } from "@/lib/api/documents";

interface UpdateDocumentStatusModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  documentId: string;
  currentStatus?: string;
  documentTitle?: string;
}

export default function UpdateDocumentStatusModal({
  open,
  onCancel,
  onSuccess,
  documentId,
  currentStatus,
  documentTitle,
}: UpdateDocumentStatusModalProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [updating, setUpdating] = useState(false);

  // Reset form và cập nhật initialValues khi modal mở hoặc documentId/currentStatus thay đổi
  useEffect(() => {
    if (open) {
      form.setFieldsValue({ status: currentStatus || "pending" });
    } else {
      // Reset form khi đóng modal
      form.resetFields();
    }
  }, [open, currentStatus, form]);

  const handleSubmit = async (values: { status: string }) => {
    setUpdating(true);
    try {
      await updateDocumentStatus(documentId, values.status);
      message.success("Cập nhật trạng thái thành công!");
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(error?.message || "Không thể cập nhật trạng thái");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span>Thay đổi trạng thái tài liệu</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose={false}
      maskClosable={!updating}
      closable={!updating}
    >
      {documentTitle && (
        <div className="mb-2 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Tài liệu:</p>
          <p className="font-semibold text-gray-800">{documentTitle}</p>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: currentStatus || "pending" }}
        disabled={updating}
      >
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select
            placeholder="Chọn trạng thái"
            size="middle"
            options={[
              { value: "pending", label: "Chờ duyệt" },
              { value: "approved", label: "Đã duyệt" },
              { value: "rejected", label: "Từ chối" },
            ]}
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel} disabled={updating}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={updating} icon={<CheckOutlined />}>
              Cập nhật
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

