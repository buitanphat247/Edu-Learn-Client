import { Avatar, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";

interface ChatHeaderProps {
  name: string;
  avatar: string;
  status?: string;
}

export default function ChatHeader({ name, avatar, status = "Đang hoạt động" }: ChatHeaderProps) {
  return (
    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-300 bg-gray-50 shrink-0">
      <div className="flex items-center gap-3">
        <Avatar size="default" className="bg-blue-500">
          {avatar}
        </Avatar>
        <div>
          <div className="font-semibold text-gray-800">{name}</div>
          <div className="text-xs text-gray-500">{status}</div>
        </div>
      </div>
      <Button type="text" icon={<MoreOutlined />} />
    </div>
  );
}

