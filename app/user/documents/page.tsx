"use client";

import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import CardDocument from "@/app/components/card_components/Card_document";
import DocumentPreviewModal from "@/app/components/modal_components/DocumentPreviewModal";

const { Search } = Input;
const { Option } = Select;

const buildOfficeViewer = (url: string) => `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;

const viewerSources = {
  pdf: buildOfficeViewer("https://files.catbox.moe/ewg30t.pdf"),
  pptx: buildOfficeViewer("https://files.catbox.moe/rl2dde.pptx"),
  xls: buildOfficeViewer("https://files.catbox.moe/qdxjea.xls"),
  doc: buildOfficeViewer("https://files.catbox.moe/ewg30t.pdf"),
};

interface DocumentItem {
  id: string;
  title: string;
  grade: string;
  subject: string;
  updateDate: string;
  author: string;
  downloads: number;
  type: "word" | "checked" | "pdf";
  viewerUrl: string;
}

const documents: DocumentItem[] = [
  {
    id: "1",
    title: "Tài liệu ôn thi Toán 9",
    grade: "Khối 9",
    subject: "Toán học",
    updateDate: "15/01/2024",
    author: "Nguyễn Văn A",
    downloads: 125,
    type: "pdf",
    viewerUrl: viewerSources.pdf,
  },
  {
    id: "2",
    title: "Bài tập Văn học kỳ 1",
    grade: "Khối 9",
    subject: "Ngữ văn",
    updateDate: "14/01/2024",
    author: "Trần Thị B",
    downloads: 89,
    type: "word",
    viewerUrl: viewerSources.doc,
  },
  {
    id: "3",
    title: "Đề cương Vật lý",
    grade: "Khối 9",
    subject: "Vật lý",
    updateDate: "13/01/2024",
    author: "Lê Văn C",
    downloads: 156,
    type: "pdf",
    viewerUrl: viewerSources.pdf,
  },
  {
    id: "4",
    title: "Tổng hợp công thức Hóa học",
    grade: "Khối 9",
    subject: "Hóa học",
    updateDate: "12/01/2024",
    author: "Phạm Thị D",
    downloads: 203,
    type: "word",
    viewerUrl: viewerSources.doc,
  },
];

export default function UserDocuments() {
  const [searchText, setSearchText] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesGrade = !selectedGrade || doc.grade === selectedGrade;
    const matchesSubject = !selectedSubject || doc.subject === selectedSubject;
    return matchesSearch && matchesGrade && matchesSubject;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tài liệu</h1>

      <div className="flex flex-wrap gap-4 items-center">
        <Search
          placeholder="Tìm kiếm tài liệu..."
          allowClear
          enterButton={<SearchOutlined />}
          style={{ maxWidth: 400 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select placeholder="Lọc theo khối" allowClear style={{ width: 150 }} value={selectedGrade} onChange={setSelectedGrade}>
          <Option value="Khối 9">Khối 9</Option>
          <Option value="Khối 10">Khối 10</Option>
          <Option value="Khối 11">Khối 11</Option>
          <Option value="Khối 12">Khối 12</Option>
        </Select>
        <Select placeholder="Lọc theo môn" allowClear style={{ width: 150 }} value={selectedSubject} onChange={setSelectedSubject}>
          <Option value="Toán học">Toán học</Option>
          <Option value="Ngữ văn">Ngữ văn</Option>
          <Option value="Vật lý">Vật lý</Option>
          <Option value="Hóa học">Hóa học</Option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <CardDocument
            key={doc.id}
            title={doc.title}
            grade={doc.grade}
            subject={doc.subject}
            updateDate={doc.updateDate}
            author={doc.author}
            downloads={doc.downloads}
            type={doc.type}
            onPreview={() => setPreviewDoc(doc)}
          />
        ))}
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

