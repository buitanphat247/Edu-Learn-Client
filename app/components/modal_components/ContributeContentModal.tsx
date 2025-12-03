"use client";

import { Modal, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface ContributeContentModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export default function ContributeContentModal({ open, onOk, onCancel }: ContributeContentModalProps) {
  const uploadProps = {
    multiple: true,
    beforeUpload: () => false,
    showUploadList: true,
  };

  return (
    <Modal title="Đóng góp nội dung" open={open} onOk={onOk} onCancel={onCancel} okText="Gửi nội dung" cancelText="Hủy">
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Chọn file tài liệu bạn muốn đóng góp vào kho nội dung. Quản trị viên sẽ kiểm duyệt trước khi hiển thị.
        </p>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} className="rounded-lg cursor-pointer">
            Chọn file để upload
          </Button>
        </Upload>
        <p className="text-xs text-gray-400 mt-3">
          Hỗ trợ các định dạng: .pdf, .doc, .docx, .ppt, .pptx, .xlsx, .zip (tối đa 50MB).
        </p>
      </div>
    </Modal>
  );
}
