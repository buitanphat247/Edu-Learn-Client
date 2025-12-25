"use client";

import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { App, Input, Skeleton } from "antd";
import { getFolders, type FolderResponse } from "@/lib/api/vocabulary";
import VocabularyCard from "@/app/components/vocabulary/VocabularyCard";
import DarkPagination from "@/app/components/common/DarkPagination";

export default function VocabularyFeature() {
  const { message } = App.useApp();
  const [folders, setFolders] = useState<FolderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchText);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, debouncedSearchQuery]);

  const fetchFolders = async () => {
    const startTime = Date.now();
    setLoading(true);
    try {
      const result = await getFolders({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchQuery || undefined,
      });
      
      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 250;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      
      setFolders(result.data);
      setTotal(result.total);
    } catch (error: any) {
      // Ensure minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 250;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      
      message.error(error?.message || "Không thể tải danh sách folders");
      setFolders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto mb-12">
        <Input
          prefix={<SearchOutlined className="text-slate-400 text-xl mr-2" />}
          placeholder="Tìm kiếm chủ đề từ vựng..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full shadow-lg shadow-black/20"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="bg-[#1e293b] rounded-2xl border border-slate-700/50 overflow-hidden h-full flex flex-col relative">
              <div className="flex-1" style={{ padding: '24px' }}>
                <div className="flex justify-between items-start mb-5">
                  <Skeleton.Button active className="rounded-2xl" style={{ width: 56, height: 56 }} />
                  <Skeleton.Button active size="small" className="rounded-lg" style={{ width: 40, height: 24 }} />
                </div>
                <Skeleton active title={{ width: '80%', style: { marginTop: 0 } }} paragraph={{ rows: 2, width: ['100%', '70%'] }} />
              </div>
              <div className="border-t border-slate-700/50 flex justify-between items-center bg-slate-800/30" style={{ padding: '16px 24px' }}>
                <Skeleton.Button active size="small" style={{ width: 80 }} />
                <Skeleton.Avatar active size="small" />
              </div>
            </div>
          ))}
        </div>
      ) : folders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {folders.map((folder) => (
              <VocabularyCard
                key={folder.folderId}
                folderId={folder.folderId}
                folderName={folder.folderName}
                href={`/features/vocabulary/${folder.folderId}`}
              />
            ))}
          </div>

          {total > pageSize && (
            <DarkPagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              showTotal={(total, range) => (
                <span className="text-slate-300">
                  {range[0]}-{range[1]} của {total} folders
                </span>
              )}
            />
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-[#1e293b]/50 rounded-3xl border border-slate-700/50 border-dashed">
          <p className="text-slate-400 text-lg">
            {debouncedSearchQuery ? "Không tìm thấy folder nào phù hợp" : "Chưa có folder từ vựng nào"}
          </p>
        </div>
      )}
    </div>
  );
}

