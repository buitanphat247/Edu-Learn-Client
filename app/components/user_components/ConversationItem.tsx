import { Avatar } from "antd";

interface ConversationItemProps {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  name,
  avatar,
  lastMessage,
  time,
  unread,
  isSelected,
  onClick,
}: ConversationItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-gray-300 ${
        isSelected ? "bg-blue-100" : ""
      }`}
    >
      <Avatar size="large" className="bg-blue-500 shrink-0">
        {avatar}
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-gray-800 truncate">{name}</span>
          <span className="text-xs text-gray-500 shrink-0 ml-2">{time}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
          {unread > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 shrink-0 ml-2">
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

