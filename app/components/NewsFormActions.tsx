"use client";

import { Form, Button, Space } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface NewsFormActionsProps {
  isEditMode: boolean;
  loading: boolean;
  onCancel?: () => void;
}

export default function NewsFormActions({ isEditMode, loading, onCancel }: NewsFormActionsProps) {
  const router = useRouter();

  return (
    <Form.Item>
      <Space>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={loading}>
          {isEditMode ? "Cập nhật" : "Tạo mới"}
        </Button>
        <Button onClick={() => onCancel ? onCancel() : router.push("/admin/news")} size="large">
          Hủy
        </Button>
      </Space>
    </Form.Item>
  );
}

