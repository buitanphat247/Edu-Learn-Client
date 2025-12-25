"use client";

import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { App, Input, Skeleton, Select } from "antd";
import { getLessons, type Lesson } from "@/lib/api/lessons";
import LessonCard from "@/app/components/listening/LessonCard";
import DarkPagination from "@/app/components/common/DarkPagination";

export default function ListeningFeature() {
  const { message } = App.useApp();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchText);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, debouncedSearchQuery, selectedLevel, selectedLanguage]);

  const fetchLessons = async () => {
    const startTime = Date.now();
    setLoading(true);
    try {
      const result = await getLessons({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchQuery || undefined,
        level: selectedLevel,
        language: selectedLanguage,
      });
      
      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 250;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      
      setLessons(result.data);
      setTotal(result.total);
    } catch (error: any) {
      // Ensure minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 250;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      
      message.error(error?.message || "Không thể tải danh sách lessons");
      setLessons([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Search and Filters */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <Input
              prefix={<SearchOutlined className="text-slate-400 text-xl mr-2" />}
              placeholder="Tìm kiếm bài học..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full shadow-lg shadow-black/20"
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              placeholder="Chọn cấp độ"
              allowClear
              className="w-full shadow-lg shadow-black/20"
              onChange={(value) => {
                setSelectedLevel(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "A1", value: "A1" },
                { label: "A2", value: "A2" },
                { label: "B1", value: "B1" },
                { label: "B2", value: "B2" },
                { label: "C1", value: "C1" },
                { label: "C2", value: "C2" },
                { label: "Beginner", value: "beginner" },
                { label: "Intermediate", value: "intermediate" },
                { label: "Advanced", value: "advanced" },
              ]}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              placeholder="Chọn ngôn ngữ"
              allowClear
              className="w-full shadow-lg shadow-black/20"
              onChange={(value) => {
                setSelectedLanguage(value);
                setCurrentPage(1);
              }}
              options={[
                { label: "Tiếng Anh", value: "en" },
                { label: "Tiếng Việt", value: "vi" },
                { label: "Tiếng Pháp", value: "fr" },
                { label: "Tiếng Đức", value: "de" },
                { label: "Tiếng Tây Ban Nha", value: "es" },
              ]}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-[#1e293b] rounded-2xl border border-slate-700/50 overflow-hidden h-full flex flex-col">
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton.Button active className="rounded-full" style={{ width: 60, height: 24 }} />
                  <Skeleton.Button active className="rounded-full" style={{ width: 40, height: 40 }} />
                </div>
                <Skeleton active title={{ width: '90%', style: { marginTop: 0 } }} paragraph={{ rows: 2, width: ['100%', '80%'] }} />
                <div className="mt-4 space-y-2">
                  <Skeleton active paragraph={false} title={{ width: '60%', style: { margin: 0, height: 16 } }} />
                  <Skeleton active paragraph={false} title={{ width: '70%', style: { margin: 0, height: 16 } }} />
                </div>
              </div>
              <div className="border-t border-slate-700/50 flex justify-between items-center p-6 bg-slate-800/30">
                <Skeleton.Button active size="small" style={{ width: 120 }} />
                <Skeleton.Button active size="small" style={{ width: 24, height: 24 }} />
              </div>
            </div>
          ))}
        </div>
      ) : lessons.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                id={lesson.id}
                name={lesson.name}
                level={lesson.level}
                language={lesson.language}
                challengeCount={lesson.challengeCount}
                practiceCount={lesson.practiceCount}
                audioSrc={lesson.audioSrc}
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
                  {range[0]}-{range[1]} của {total} bài học
                </span>
              )}
            />
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-[#1e293b]/50 rounded-3xl border border-slate-700/50 border-dashed">
          <p className="text-slate-400 text-lg">
            {debouncedSearchQuery || selectedLevel || selectedLanguage
              ? "Không tìm thấy bài học nào phù hợp"
              : "Chưa có bài học nào"}
          </p>
        </div>
      )}
    </div>
  );
}

