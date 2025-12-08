"use client";

import DocumentPreviewModal from "./DocumentPreviewModal";
import { useDocumentPreview, type DocumentPreviewData } from "./useDocumentPreview";

export interface DocumentPreviewProps {
  /**
   * Render function để nhận các hàm openPreview và previewDoc
   * @example
   * <DocumentPreview>
   *   {({ openPreview }) => (
   *     <Button onClick={() => openPreview({ title: "Doc", fileUrl: "..." })}>
   *       Xem
   *     </Button>
   *   )}
   * </DocumentPreview>
   */
  children: (props: {
    openPreview: (doc: DocumentPreviewData) => void;
    previewDoc: DocumentPreviewData | null;
    isOpen: boolean;
    closePreview: () => void;
  }) => React.ReactNode;
}

/**
 * Component wrapper để dễ dàng sử dụng preview tài liệu
 * Tự động quản lý state và modal
 */
export default function DocumentPreview({ children }: DocumentPreviewProps) {
  const { previewDoc, openPreview, closePreview, handleAfterClose, isOpen } = useDocumentPreview();

  return (
    <>
      {children({ openPreview, previewDoc, isOpen, closePreview })}
      <DocumentPreviewModal
        open={isOpen}
        title={previewDoc?.title}
        fileUrl={previewDoc?.fileUrl}
        onClose={closePreview}
        afterClose={handleAfterClose}
      />
    </>
  );
}

