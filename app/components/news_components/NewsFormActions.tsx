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

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/admin/news");
    }
  };

  return (
    <Form.Item>
      <Space>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={loading}>
          {isEditMode ? "Cập nhật" : "Tạo mới"}
        </Button>
        <Button onClick={handleCancel} size="large">
          Hủy
        </Button>
      </Space>
    </Form.Item>
  );
}
