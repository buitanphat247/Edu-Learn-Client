import { List, Avatar } from "antd";

interface ClassListItemProps {
  name: string;
  teacher: string;
  time: string;
  room: string;
}

export default function ClassListItem({ name, teacher, time, room }: ClassListItemProps) {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar style={{ backgroundColor: "#1890ff" }}>{name[0]}</Avatar>}
        title={<span className="font-medium">{name}</span>}
        description={
          <div className="space-y-1 text-sm text-gray-600">
            <div>Giáo viên: {teacher}</div>
            <div>Thời gian: {time}</div>
            <div>Phòng: {room}</div>
          </div>
        }
      />
    </List.Item>
  );
}

