import { Modal } from "antd";

interface DocumentPreviewModalProps {
  open: boolean;
  title: string;
  viewerUrl: string;
  onClose: () => void;
}

export default function DocumentPreviewModal({ open, title, viewerUrl, onClose }: DocumentPreviewModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="90%"
      styles={{ body: { padding: 0 } }}
      centered
      destroyOnHidden
      title={title}
    >
      <iframe
        title={title}
        src={viewerUrl}
        style={{ width: "100%", height: "85vh" }}
        className="border-0"
      />
    </Modal>
  );
}


