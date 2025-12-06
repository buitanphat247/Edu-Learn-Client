import { Button, Space, Dropdown, DatePicker } from "antd";
import type { MenuProps } from "antd";
import { ShareAltOutlined, SettingOutlined } from "@ant-design/icons";

interface ExerciseHeaderProps {
  id: string;
  title: string;
  createdDate: string;
  dueDate: any;
  onDueDateChange: (date: any) => void;
  menuItems: MenuProps["items"];
  onMenuClick: MenuProps["onClick"];
}

export default function ExerciseHeader({
  title,
  createdDate,
  dueDate,
  onDueDateChange,
  menuItems,
  onMenuClick,
}: ExerciseHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          <div className="space-y-1 text-sm text-gray-600">
            <div>Ngày tạo: {createdDate}</div>
            <div>
              Hạn cuối:{" "}
              {dueDate ? (
                <DatePicker
                  value={dueDate}
                  onChange={onDueDateChange}
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Chọn hạn cuối"
                  className="w-48"
                />
              ) : (
                <span className="text-gray-500">Không thời hạn</span>
              )}
              <Button
                type="link"
                size="small"
                onClick={() => onDueDateChange(dueDate ? null : new Date())}
                className="ml-2"
              >
                {dueDate ? "Bỏ hạn cuối" : "Thêm hạn cuối"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Space>
        <Button icon={<ShareAltOutlined />}>Chia sẻ</Button>
        <Dropdown menu={{ items: menuItems, onClick: onMenuClick }} placement="bottomRight">
          <Button icon={<SettingOutlined />} />
        </Dropdown>
      </Space>
    </div>
  );
}

