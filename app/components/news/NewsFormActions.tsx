import { Form, Button, Space } from "antd";
import { SaveOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface NewsFormActionsProps {
  isEditMode: boolean;
  loading: boolean;
  onCancel?: () => void;
  onSaveDraft?: () => void;
  showSaveDraft?: boolean;
}

export default function NewsFormActions({ isEditMode, loading, onCancel, onSaveDraft, showSaveDraft = true }: NewsFormActionsProps) {
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/admin/news");
    }
  };

  const submitText = isEditMode ? "Cập nhật" : "Tạo mới";
  const submitIcon = isEditMode ? <EditOutlined /> : <PlusOutlined />;

  return (
    <Form.Item>
      <div className="flex justify-end gap-3 pt-2">
        <Space>
          <Button onClick={handleCancel} className="rounded-lg cursor-pointer">
            Hủy
          </Button>

          <Button onClick={onSaveDraft} className="border-gray-300 rounded-lg cursor-pointer" icon={<SaveOutlined />}>
            Lưu nháp
          </Button>
          <Button type="primary" htmlType="submit" icon={submitIcon} loading={loading} className="rounded-lg cursor-pointer">
            {submitText}
          </Button>
        </Space>
      </div>
    </Form.Item>
  );
}
