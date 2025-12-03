"use client";

import { Button, Space } from "antd";
import { SaveOutlined } from "@ant-design/icons";

interface FormActionsProps {
  onCancel: () => void;
  onSaveDraft?: () => void;
  onSubmit: () => void;
  submitText?: string;
  submitIcon?: React.ReactNode;
  loading?: boolean;
  showSaveDraft?: boolean;
}

export default function FormActions({
  onCancel,
  onSaveDraft,
  onSubmit,
  submitText = "Lưu",
  submitIcon,
  loading = false,
  showSaveDraft = true,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Space>
        <Button onClick={onCancel} className="rounded-lg cursor-pointer">
          Hủy
        </Button>
        {showSaveDraft && onSaveDraft && (
          <Button onClick={onSaveDraft} className="border-gray-300 rounded-lg cursor-pointer" icon={<SaveOutlined />}>
            Lưu nháp
          </Button>
        )}
        <Button
          type="primary"
          onClick={onSubmit}
          icon={submitIcon}
          loading={loading}
          className="rounded-lg cursor-pointer"
        >
          {submitText}
        </Button>
      </Space>
    </div>
  );
}
