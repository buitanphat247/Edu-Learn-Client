"use client";

import { Pagination, ConfigProvider, theme } from "antd";
import type { PaginationProps } from "antd";

interface DarkPaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  className?: string;
}

export default function DarkPagination({
  current,
  total,
  pageSize,
  onChange,
  showTotal,
  showSizeChanger = false,
  showQuickJumper = false,
  className = "",
}: DarkPaginationProps) {
  return (
    <div className={`flex justify-center mt-16 ${className}`}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorBgContainer: '#1e293b',
            colorBorder: '#334155',
            colorPrimary: '#3b82f6',
            colorText: '#ffffff',
            colorTextSecondary: '#cbd5e1',
          },
          components: {
            Pagination: {
              itemActiveBg: '#3b82f6',
              itemBg: '#1e293b',
              itemInputBg: '#1e293b',
              itemLinkBg: '#1e293b',
              itemActiveColorDisabled: '#ffffff',
              colorText: '#ffffff',
              colorTextDisabled: '#64748b',
              colorPrimary: '#ffffff',
              colorPrimaryHover: '#ffffff',
            }
          }
        }}
      >
        <div className="bg-[#1e293b] px-4 py-2 rounded-xl shadow-lg border border-slate-700/50 [&_.ant-pagination-item]:text-white [&_.ant-pagination-item]:!border-none [&_.ant-pagination-item:hover]:!border-none [&_.ant-pagination-item-active]:bg-blue-600 [&_.ant-pagination-item-active]:!border-none [&_.ant-pagination-item-active_a]:!text-white [&_.ant-pagination-item-active_a]:!font-semibold [&_.ant-pagination-item_a]:text-white [&_.ant-pagination-prev]:text-white [&_.ant-pagination-next]:text-white [&_.ant-pagination-total-text]:text-slate-300">
          <Pagination
            current={current}
            total={total}
            pageSize={pageSize}
            onChange={onChange}
            showSizeChanger={showSizeChanger}
            showQuickJumper={showQuickJumper}
            showTotal={showTotal}
          />
        </div>
      </ConfigProvider>
    </div>
  );
}

