"use client";

import React from "react";
import { VideoCameraOutlined, TeamOutlined, CloudOutlined, FileTextOutlined } from "@ant-design/icons";

// Custom icon for Azota (quiz/assignment icon)
const AzotaIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function Integrations() {
  const integrations = [
    {
      name: "Zoom",
      icon: <VideoCameraOutlined className="text-4xl" />,
    },
    {
      name: "Google Meet",
      icon: <TeamOutlined className="text-4xl" />,
    },
    {
      name: "Azota",
      icon: <AzotaIcon />,
    },
    {
      name: "Microsoft Teams",
      icon: <CloudOutlined className="text-4xl" />,
    },
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-[#0f172a] border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Seamless Connectivity
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
            Tích hợp với các công cụ bạn đang sử dụng
          </h3>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-80 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-xl font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors duration-300 cursor-pointer group"
            >
              <div className="group-hover:scale-110 transition-transform duration-300 text-blue-600 dark:text-blue-400">
                {integration.icon}
              </div>
              <span>{integration.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

