import { Modal, Button, Avatar, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface CreatePostModalProps {
  open: boolean;
  postContent: string;
  onContentChange: (content: string) => void;
  onPost: () => void;
  onCancel: () => void;
}

export default function CreatePostModal({
  open,
  postContent,
  onContentChange,
  onPost,
  onCancel,
}: CreatePostModalProps) {
  return (
    <Modal
      title="Tạo bài viết"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onPost} disabled={!postContent.trim()}>
          Đăng bài
        </Button>,
      ]}
      width={600}
    >
      <div className="space-y-4 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar size="large" icon={<UserOutlined />} className="bg-blue-500">
            HS
          </Avatar>
          <div>
            <div className="font-semibold text-gray-800">Bạn</div>
            <div className="text-sm text-gray-500">Chia sẻ điều gì đó với cộng đồng</div>
          </div>
        </div>
        <TextArea
          rows={6}
          placeholder="Bạn đang nghĩ gì?"
          maxLength={500}
          value={postContent}
          onChange={(e) => onContentChange(e.target.value)}
          className="resize-none"
          autoFocus
        />
      </div>
    </Modal>
  );
}

