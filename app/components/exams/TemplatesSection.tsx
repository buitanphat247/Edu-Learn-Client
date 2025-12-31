"use client";

import { DownloadOutlined } from "@ant-design/icons";

interface Template {
  name: string;
  type: string;
}

interface TemplatesSectionProps {
  templates: Template[];
}

export default function TemplatesSection({ templates }: TemplatesSectionProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-800 mb-3">Tải mẫu</h3>
      <div className="space-y-2">
        {templates.map((template, index) => (
          <a key={index} href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline">
            <DownloadOutlined />
            <span>{template.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

