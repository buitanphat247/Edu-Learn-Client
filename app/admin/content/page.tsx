"use client";

import { useState } from "react";
import DocumentPreviewModal from "@/app/components/modal_components/DocumentPreviewModal";
import ContentSidebar from "@/app/components/content_components/ContentSidebar";
import ContentHeader from "@/app/components/content_components/ContentHeader";
import DocumentGrid, { type DocumentItem } from "@/app/components/content_components/DocumentGrid";

// Hàm tạo viewer URL dựa trên loại file
const getViewerUrl = (url: string) => {
  const lowerUrl = url.toLowerCase();
  
  // Nếu là PDF thì dùng Google Docs viewer
  if (lowerUrl.endsWith(".pdf")) {
    return `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(url)}`;
  }
  
  // Còn lại dùng Microsoft Office viewer
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
};

const documents: DocumentItem[] = [
  // Demo documents với link mới
  {
    id: "demo-1",
    title: "Nội dung PPT TD7",
    grade: "Khối 7",
    subject: "Toán học",
    updateDate: "15/01/2025 10:00",
    author: "Admin",
    downloads: 0,
    type: "word",
    viewerUrl: getViewerUrl(
      "https://pub-3aaf3c9cd7694383ab5e47980be6dc67.r2.dev/documents/Noi_Dung_PPT_TD7_1764660724073_npx1xf.docx"
    ),
  },
  {
    id: "demo-2",
    title: "Edu-Learn Document",
    grade: "Khối 10",
    subject: "Tài liệu",
    updateDate: "15/01/2025 10:00",
    author: "Admin",
    downloads: 0,
    type: "pdf",
    viewerUrl: getViewerUrl(
      "https://pub-3aaf3c9cd7694383ab5e47980be6dc67.r2.dev/documents/Edu-Learn_1764659592287_sh5pd0.pdf"
    ),
  },
  {
    id: "demo-3",
    title: "PowerPoint Presentation",
    grade: "Khối 11",
    subject: "Tài liệu",
    updateDate: "15/01/2025 10:00",
    author: "Admin",
    downloads: 0,
    type: "checked",
    viewerUrl: getViewerUrl(
      "https://pub-3aaf3c9cd7694383ab5e47980be6dc67.r2.dev/documents/4c4aa0608cecaecaf22e766981277258_1764660940329_55lqr9.pptx"
    ),
  },
];

export default function AdminContent() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  return (
    <div className="flex h-full bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 border border-gray-200 rounded-xl overflow-hidden">
      <ContentSidebar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ContentHeader title="Tài liệu mới nhất" activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        <DocumentGrid documents={documents} onPreview={setPreviewDoc} />
      </div>

      <DocumentPreviewModal
        open={Boolean(previewDoc)}
        title={previewDoc?.title || ""}
        viewerUrl={previewDoc?.viewerUrl || ""}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
}
