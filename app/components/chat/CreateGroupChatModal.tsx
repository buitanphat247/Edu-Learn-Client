"use client";

import { Modal, Input } from "antd";

interface CreateGroupChatModalProps {
  open: boolean;
  groupName: string;
  onGroupNameChange: (value: string) => void;
  onOk: () => void;
  onCancel: () => void;
}

export default function CreateGroupChatModal({ open, groupName, onGroupNameChange, onOk, onCancel }: CreateGroupChatModalProps) {
  return (
    <Modal title="Tạo nhóm chat mới" open={open} onOk={onOk} onCancel={onCancel} okText="Tạo nhóm" cancelText="Hủy">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Tên nhóm chat</label>
        <Input
          placeholder="Nhập tên nhóm chat (ví dụ: Nhóm chat lớp 10A1)"
          value={groupName}
          onChange={(e) => onGroupNameChange(e.target.value)}
          className="cursor-text"
        />
      </div>
    </Modal>
  );
}
