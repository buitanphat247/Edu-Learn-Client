"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { App, Spin, Button, ConfigProvider, theme } from "antd";
import { SoundOutlined, FileTextOutlined, CheckCircleOutlined, EditOutlined, BookOutlined } from "@ant-design/icons";
import { getVocabulariesByFolder, type VocabularyResponse } from "@/lib/api/vocabulary";
import Image from "next/image";

export default function VocabularyDetail() {
  const { message } = App.useApp();
  const router = useRouter();
  const params = useParams();
  const folderId = params?.folderId ? parseInt(params.folderId as string, 10) : null;
  const [vocabularies, setVocabularies] = useState<VocabularyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (folderId) {
      fetchVocabularies();
    }
  }, [folderId]);

  const fetchVocabularies = async () => {
    if (!folderId) return;
    
    const startTime = Date.now();
    setLoading(true);
    try {
      const data = await getVocabulariesByFolder(folderId);
      
      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 250;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      
      setVocabularies(data);
      if (data.length > 0) {
        setFolderName(data[0].folder.folderName);
      }
    } catch (error: any) {
      // Ensure minimum loading time even on error
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 250;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
      
      console.error("Error fetching vocabularies:", error);
      message.error(error?.message || "Không thể tải danh sách từ vựng");
      setVocabularies([]);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      message.error("Không thể phát audio");
    });
  };

  const parseExample = (exampleStr: string) => {
    try {
      if (!exampleStr) return null;
      const parsed = JSON.parse(exampleStr);
      return {
        content: parsed.content || "",
        translation: parsed.translation || "",
      };
    } catch {
      return null;
    }
  };

  const parseVariations = (variations: string[]) => {
    try {
      if (!variations || variations.length === 0) return [];
      const joined = variations.join("");
      const parsed = JSON.parse(joined);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const practiceModes = [
    {
      title: "Flashcard",
      description: "Học với thẻ ghi nhớ thông minh",
      icon: FileTextOutlined,
      color: "green",
    },
    {
      title: "Kiểm tra",
      description: "Trắc nghiệm & điền từ",
      icon: CheckCircleOutlined,
      color: "blue",
    },
    {
      title: "Gõ từ",
      description: "Nghe và viết lại từ vựng",
      icon: EditOutlined,
      color: "purple",
    },
    {
      title: "Luyện câu",
      description: "Tạo câu với AI hỗ trợ",
      icon: BookOutlined,
      color: "orange",
    },
  ];

  if (!folderId) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-slate-500">Folder ID không hợp lệ</p>
        </div>
      </main>
    );
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#3b82f6', // blue-600
          borderRadius: 8,
        },
      }}
    >
      <main className="min-h-screen bg-[#0f172a] py-8 md:py-12 font-sans text-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header */}
          <div className="mb-12">
            <nav className="mb-8 bg-[#1e293b] border border-slate-700/50 rounded-xl px-6 py-4 shadow-sm text-sm font-medium flex items-center flex-wrap gap-2">
              <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">Trang chủ</Link>
              <span className="text-slate-600">/</span>
              <Link href="/features/vocabulary" className="text-blue-400 hover:text-blue-300 transition-colors">Học từ vựng</Link>
              {folderName && (
                <>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-300 font-medium">{folderName}</span>
                </>
              )}
            </nav>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                  {folderName || "Từ vựng"}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-16 bg-blue-600 rounded-full"></div>
                  <p className="text-slate-400 font-medium">
                    {vocabularies.length > 0 ? `${vocabularies.length} từ vựng` : "Đang tải..."}
                  </p>
                </div>
              </div>
              
              {!loading && vocabularies.length > 0 && (
                <div className="flex gap-3">
                   <Button 
                    type="primary" 
                    size="large"
                    shape="round"
                    className="bg-blue-600 hover:bg-blue-500 h-11 px-8 shadow-lg shadow-blue-900/40 font-semibold border-none"
                    onClick={() => router.push(`/features/vocabulary/flashcard/${folderId}`)}
                   >
                     Học ngay
                   </Button>
                </div>
              )}
            </div>
          </div>

          {/* Practice Modes */}
          {!loading && vocabularies.length > 0 && (
            <div className="mb-16">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircleOutlined className="text-blue-500" />
                <span>Chế độ luyện tập</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {practiceModes.map((mode, index) => {
                  const IconComponent = mode.icon;
                  const handleClick = () => {
                    if (mode.title === "Flashcard") {
                      router.push(`/features/vocabulary/flashcard/${folderId}`);
                    } else {
                      message.info("Tính năng này đang được phát triển");
                    }
                  };

                  const colors: Record<string, string> = {
                    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40",
                    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/40",
                    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:bg-purple-500/20 group-hover:border-purple-500/40",
                    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20 group-hover:bg-orange-500/20 group-hover:border-orange-500/40",
                  };
                  
                  return (
                    <div
                      key={index}
                      onClick={handleClick}
                      className="group bg-[#1e293b] rounded-2xl p-5 border border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors border ${colors[mode.color].split(' group-hover')[0]}`}>
                        <IconComponent className="text-xl" />
                      </div>
                      <h3 className="text-base font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">{mode.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{mode.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vocabulary List */}
          {loading ? (
             <div className="flex flex-col items-center justify-center py-24">
               <Spin size="large" />
               <p className="mt-4 text-slate-400">Đang tải dữ liệu...</p>
             </div>
          ) : vocabularies.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOutlined className="text-blue-500" />
                <span>Danh sách từ vựng</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vocabularies.map((vocab) => {
                  const example = parseExample(vocab.example);
                  const variations = parseVariations(vocab.variations);
                  const primaryAudio = vocab.audioUrl?.[0]?.url;

                  return (
                    <div
                      key={vocab.sourceWordId}
                      className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700/50 shadow-sm hover:shadow-lg hover:border-slate-600 transition-all duration-300 group"
                    >
                      {/* Top Section */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-600/50 shadow-sm bg-slate-900">
                          {vocab.avatarUrl ? (
                            <Image
                              src={vocab.avatarUrl}
                              alt={vocab.content}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold text-xl">
                                {vocab.content.charAt(0)}
                             </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-bold text-slate-200 truncate group-hover:text-blue-400 transition-colors" title={vocab.content}>
                              {vocab.content}
                            </h3>
                            {primaryAudio && (
                              <Button
                                type="text"
                                icon={<SoundOutlined />}
                                size="small"
                                onClick={() => playAudio(primaryAudio)}
                                className="text-slate-400 hover:text-blue-400 hover:bg-slate-800 -mr-2"
                              />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {vocab.pos && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 uppercase tracking-wide border border-slate-700">
                                {vocab.pos}
                              </span>
                            )}
                            <span className="text-sm font-mono text-slate-500">{vocab.pronunciation}</span>
                          </div>

                          <p className="text-blue-400 font-bold">
                            {vocab.translation}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-700/50 mb-4"></div>

                      {/* Example Section */}
                      {example && (
                        <div className="mb-4 bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                          <div
                            className="text-sm text-slate-300 italic mb-1"
                            dangerouslySetInnerHTML={{ __html: example.content }}
                          />
                          <div
                            className="text-xs text-slate-500"
                            dangerouslySetInnerHTML={{ __html: example.translation }}
                          />
                        </div>
                      )}

                      {/* Details (Variations, Family...) */}
                      <div className="space-y-3">
                        {variations.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {variations.slice(0, 3).map((variation: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-medium rounded-md border border-blue-500/20"
                              >
                                {variation.variationWordContent || variation}
                              </span>
                            ))}
                            {variations.length > 3 && (
                               <span className="px-2 py-1 text-slate-500 text-[10px] font-medium">+{variations.length - 3}</span>
                            )}
                          </div>
                        )}
                        
                        {vocab.family && vocab.family.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Họ từ</p>
                            <div className="space-y-1">
                              {vocab.family.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="text-xs text-slate-400 flex items-center gap-1.5 overflow-hidden">
                                  <span className="w-1 h-1 bg-slate-600 rounded-full shrink-0"></span>
                                  <span className="font-semibold text-slate-300">{item.word}</span>
                                  <span className="truncate text-slate-500">- {item.meaning}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-[#1e293b] rounded-3xl border border-dashed border-slate-700 shadow-sm">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                    <BookOutlined className="text-2xl" />
                </div>
              <p className="text-slate-400 font-medium">Chưa có từ vựng nào trong bộ này</p>
            </div>
          )}
        </div>
      </main>
    </ConfigProvider>
  );
}
