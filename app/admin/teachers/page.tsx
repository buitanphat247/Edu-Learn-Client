"use client";

import { useState } from "react";
import { Input, Avatar, Card, Checkbox, Button, Dropdown } from "antd";
import { SearchOutlined, PlusOutlined, MoreOutlined, TeamOutlined, CloseOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

interface Group {
  id: string;
  name: string;
  type: "group";
}

interface User {
  id: string;
  name: string;
  initials: string;
  contact: string;
  contactType: "phone" | "email";
  type: "user";
}

type ListItem = Group | User;

const groups: Group[] = [
  { id: "1", name: "Ôn thi nhóm 1 khối 7", type: "group" },
  { id: "2", name: "Nhóm GV Toán", type: "group" },
  { id: "3", name: "Nhóm GV Văn", type: "group" },
];

const users: User[] = [
  { id: "4", name: "Nguyễn Văn A", initials: "NA", contact: "0988868680", contactType: "phone", type: "user" },
  { id: "5", name: "Phạm Thị B", initials: "PB", contact: "0988868681", contactType: "phone", type: "user" },
  { id: "6", name: "Tống Văn C", initials: "TC", contact: "0988868682", contactType: "phone", type: "user" },
  { id: "7", name: "Trần Thị D", initials: "TD", contact: "tranthid@gmail.com", contactType: "email", type: "user" },
  { id: "8", name: "Hồ Văn E", initials: "HE", contact: "hovane@gmail.com", contactType: "email", type: "user" },
];

const allItems: ListItem[] = [...groups, ...users];

interface ClassCard {
  id: string;
  name: string;
  category: "class" | "other";
}

const classCards: ClassCard[] = [
  { id: "1", name: "Lớp 12A", category: "class" },
  { id: "2", name: "Lớp 12B", category: "class" },
  { id: "3", name: "Lớp 12C", category: "class" },
  { id: "4", name: "Lớp 12D", category: "class" },
  { id: "5", name: "9a3", category: "other" },
];

interface ClassPermission {
  classId: string;
  assignHomework: boolean;
  gradeAssignments: boolean;
  manageStudents: boolean;
}

export default function AdminTeachers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(groups[0]);
  const [groupMembers, setGroupMembers] = useState<User[]>([users[0], users[1]]);
  const [classSearch, setClassSearch] = useState("");
  const [selectAllClasses, setSelectAllClasses] = useState(false);
  const [showAssignedOnly, setShowAssignedOnly] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, Record<string, ClassPermission>>>({});

  const filteredItems = allItems.filter((item) => {
    if (item.type === "group") {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contact.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  });

  const filteredClasses = classCards.filter((cls) => cls.name.toLowerCase().includes(classSearch.toLowerCase()));

  const classCategories = {
    class: filteredClasses.filter((cls) => cls.category === "class"),
    other: filteredClasses.filter((cls) => cls.category === "other"),
  };

  const handleItemClick = (item: ListItem) => {
    setSelectedItem(item);
  };

  const getCurrentPermissions = (): Record<string, ClassPermission> => {
    if (!selectedItem) return {};
    return permissions[selectedItem.id] || {};
  };

  const selectedGroup = selectedItem?.type === "group" ? selectedItem : null;
  const selectedUser = selectedItem?.type === "user" ? selectedItem : null;

  const handleRemoveMember = (userId: string) => {
    setGroupMembers(groupMembers.filter((m) => m.id !== userId));
  };

  const handlePermissionChange = (classId: string, permission: keyof ClassPermission, value: boolean) => {
    if (!selectedItem) return;
    setPermissions((prev) => ({
      ...prev,
      [selectedItem.id]: {
        ...prev[selectedItem.id],
        [classId]: {
          ...(prev[selectedItem.id]?.[classId] || {}),
          classId,
          [permission]: value,
        },
      },
    }));
  };

  const getMenuItems = (): MenuProps["items"] => [
    { key: "edit", label: "Sửa" },
    { key: "delete", label: "Xóa", danger: true },
  ];

  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-300 flex flex-col">
        <div className="py-4 pr-2 border-b border-gray-300">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Tìm tên, phone hoặc Email"
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoComplete="none"
            />
            <button
              onClick={() => {
                // Handle add new item
              }}
              className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors shrink-0"
            >
              <PlusOutlined />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredItems.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                  isSelected ? "bg-blue-50 border-l-4 border-blue-600" : "hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.type === "group" ? (
                    <TeamOutlined className="text-xl text-gray-600 shrink-0" />
                  ) : (
                    <Avatar className="shrink-0" style={{ backgroundColor: "#1890ff" }}>
                      {item.initials}
                    </Avatar>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${isSelected ? "text-blue-600" : "text-gray-800"}`}>
                      {item.name}
                    </div>
                    {item.type === "user" && (
                      <div className="text-xs text-gray-500 truncate">{item.contact}</div>
                    )}
                  </div>
                </div>
                <Dropdown menu={{ items: getMenuItems() }} trigger={["click"]}>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 hover:bg-gray-200 rounded transition-colors shrink-0"
                  >
                    <MoreOutlined className="text-gray-600" />
                  </button>
                </Dropdown>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Group Members Section - Only show for groups */}
        {selectedGroup && (
          <div className="bg-white border-b border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Thành viên trong nhóm: {selectedGroup.name}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <button className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
                <PlusOutlined />
              </button>
              {groupMembers.map((member) => (
                <div key={member.id} className="relative group">
                  <Avatar className="cursor-pointer" style={{ backgroundColor: "#1890ff" }}>
                    {member.initials}
                  </Avatar>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    <CloseOutlined />
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {member.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Info Section - Only show for users */}
        {selectedUser && (
          <div className="bg-white border-b border-gray-300 p-6">
            <div className="flex items-center gap-4">
              <Avatar size={64} style={{ backgroundColor: "#1890ff" }}>
                {selectedUser.initials}
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{selectedUser.name}</h2>
                <p className="text-sm text-gray-600">{selectedUser.contact}</p>
              </div>
            </div>
          </div>
        )}

        {/* Class Permissions Section */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Phân quyền trong lớp</h2>

            <div className="flex items-center gap-4 mb-4">
              <Input
                placeholder="Tìm kiếm theo tên lớp"
                prefix={<SearchOutlined className="text-gray-400" />}
                suffix={
                  classSearch && (
                    <CloseOutlined
                      className="text-gray-400 cursor-pointer hover:text-gray-600"
                      onClick={() => setClassSearch("")}
                    />
                  )
                }
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
                className="flex-1 max-w-md"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                {filteredClasses.length} ({Object.keys(getCurrentPermissions()).length}/{filteredClasses.length} lớp){" "}
                <button className="text-blue-600 hover:underline">Chọn tất cả lớp</button>
              </div>
              <div className="flex items-center gap-4">
                <Checkbox checked={selectAllClasses} onChange={(e) => setSelectAllClasses(e.target.checked)}>
                  Chọn tất cả
                </Checkbox>
                <Checkbox checked={showAssignedOnly} onChange={(e) => setShowAssignedOnly(e.target.checked)}>
                  Lớp đã gán quyền
                </Checkbox>
                <Button>Hủy</Button>
                <Button type="primary">Lưu</Button>
              </div>
            </div>
          </div>

          {/* Class Cards */}
          <div className="space-y-6">
            {classCategories.class.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Lớp</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {classCategories.class.map((cls) => (
                    <Card key={cls.id} styles={{ body: { padding: "16px" } }}>
                      <h4 className="font-semibold text-gray-800 mb-4">{cls.name}</h4>
                      <div className="space-y-3">
                        <Checkbox
                          checked={getCurrentPermissions()[cls.id]?.assignHomework || false}
                          onChange={(e) => handlePermissionChange(cls.id, "assignHomework", e.target.checked)}
                        >
                          Giao bài tập, giao đề thi
                        </Checkbox>
                        <Checkbox
                          checked={getCurrentPermissions()[cls.id]?.gradeAssignments || false}
                          onChange={(e) => handlePermissionChange(cls.id, "gradeAssignments", e.target.checked)}
                        >
                          Chấm bài
                        </Checkbox>
                        <Checkbox
                          checked={getCurrentPermissions()[cls.id]?.manageStudents || false}
                          onChange={(e) => handlePermissionChange(cls.id, "manageStudents", e.target.checked)}
                        >
                          Quản lý danh sách học sinh
                        </Checkbox>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {classCategories.other.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Khác</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {classCategories.other.map((cls) => (
                    <Card key={cls.id} styles={{ body: { padding: "16px" } }}>
                      <h4 className="font-semibold text-gray-800 mb-4">{cls.name}</h4>
                      <div className="space-y-3">
                        <Checkbox
                          checked={getCurrentPermissions()[cls.id]?.assignHomework || false}
                          onChange={(e) => handlePermissionChange(cls.id, "assignHomework", e.target.checked)}
                        >
                          Giao bài tập, giao đề thi
                        </Checkbox>
                        <Checkbox
                          checked={getCurrentPermissions()[cls.id]?.gradeAssignments || false}
                          onChange={(e) => handlePermissionChange(cls.id, "gradeAssignments", e.target.checked)}
                        >
                          Chấm bài
                        </Checkbox>
                        <Checkbox
                          checked={getCurrentPermissions()[cls.id]?.manageStudents || false}
                          onChange={(e) => handlePermissionChange(cls.id, "manageStudents", e.target.checked)}
                        >
                          Quản lý danh sách học sinh
                        </Checkbox>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

